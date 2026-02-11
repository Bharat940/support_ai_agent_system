// src/chat/ChatMessage.tsx
import ReactMarkdown from 'react-markdown';
import { Avatar } from '../components/ui/Avatar';
import { Card } from '../components/ui/Card';
import { User, Bot, ShoppingBag, CreditCard, LifeBuoy } from 'lucide-react';
import type { UIMessage } from 'ai';

interface ChatMessageProps {
    message: UIMessage;
    agentType?: 'router' | 'support' | 'order' | 'billing';
}

export const ChatMessage = ({ message, agentType = 'support' }: ChatMessageProps) => {
    const isUser = message.role === 'user';

    const metadata = (message.metadata ?? {}) as Record<string, unknown>;
    const messageAgent = metadata.agent;
    const effectiveAgentType =
        !isUser &&
            typeof messageAgent === 'string' &&
            ['router', 'support', 'order', 'billing'].includes(messageAgent)
            ? (messageAgent as ChatMessageProps['agentType'])
            : agentType;

    const createdAtRaw = metadata.createdAt;
    const createdAt =
        typeof createdAtRaw === 'number'
            ? createdAtRaw
            : typeof createdAtRaw === 'string'
                ? Date.parse(createdAtRaw)
                : createdAtRaw instanceof Date
                    ? createdAtRaw.getTime()
                    : undefined;

    const getAgentIcon = () => {
        switch (effectiveAgentType) {
            case 'order':
                return <ShoppingBag className="h-5 w-5 text-orange-600" />;
            case 'billing':
                return <CreditCard className="h-5 w-5 text-green-600" />;
            case 'support':
                return <LifeBuoy className="h-5 w-5 text-blue-600" />;
            default:
                return <Bot className="h-5 w-5 text-purple-600" />;
        }
    };

    const getAgentName = () => {
        switch (effectiveAgentType) {
            case 'order':
                return 'Order Specialist';
            case 'billing':
                return 'Billing Support';
            case 'support':
                return 'Support Agent';
            default:
                return 'AI Assistant';
        }
    };

    return (
        <div className={`flex w-full gap-3 p-4 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
            <Avatar
                className={isUser ? 'bg-gray-200' : 'bg-white border border-gray-100 shadow-sm'}
                fallback={isUser ? <User className="h-5 w-5 text-gray-600" /> : getAgentIcon()}
            />

            <div className={`flex flex-col max-w-[80%] ${isUser ? 'items-end' : 'items-start'}`}>
                <div className="flex items-center gap-2 mb-1 px-1">
                    <span className="text-xs font-semibold text-gray-600">
                        {isUser ? 'You' : getAgentName()}
                    </span>
                    {createdAt != null && !Number.isNaN(createdAt) && (
                        <span className="text-xs text-gray-400">
                            {new Date(createdAt).toLocaleTimeString()}
                        </span>
                    )}
                </div>

                <Card className={`p-3 px-4 shadow-sm ${isUser
                    ? 'bg-blue-600 text-black border-blue-600'
                    : 'bg-white text-gray-800'
                    }`}>
                    <div className={`prose prose-sm break-words ${isUser ? 'prose-invert' : ''}`}>
                        {message.parts && message.parts.length > 0 ? (
                            message.parts.map((part, index) => {
                                switch (part.type) {
                                    case 'text':
                                        return (
                                            <ReactMarkdown key={index}>
                                                {part.text}
                                            </ReactMarkdown>
                                        );

                                    case 'tool-invocation':
                                    case 'tool-call':
                                    case 'tool-result':
                                        return null;

                                    default:
                                        if (part.type.startsWith('tool-')) {
                                            const p = part as any;
                                            const toolName = p.toolName || part.type.replace('tool-', '');
                                            const state = p.state;

                                            return (
                                                <div key={index} className="bg-gray-50 p-3 rounded-lg border border-gray-200 my-2 text-sm">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <div className={`w-2 h-2 rounded-full ${state === 'result' || state === 'output-available' ? 'bg-green-500' : 'bg-amber-400 animate-pulse'
                                                            }`} />
                                                        <span className="font-medium text-gray-700 font-mono text-xs">
                                                            {toolName}
                                                        </span>
                                                    </div>

                                                    {(state === 'result' || state === 'output-available') && (
                                                        <div className="mt-2 text-gray-600 bg-gray-50 p-2 rounded text-xs font-mono overflow-x-auto">
                                                            {JSON.stringify(p.result || p.output, null, 2).slice(0, 200)}
                                                            {JSON.stringify(p.result || p.output).length > 200 && '...'}
                                                        </div>
                                                    )}
                                                    {(state !== 'result' && state !== 'output-available' && state !== 'output-error') && (
                                                        <div className="text-xs text-gray-400 italic">
                                                            Running...
                                                        </div>
                                                    )}
                                                    {state === 'output-error' && (
                                                        <div className="text-xs text-red-500 italic">
                                                            Error: {p.errorText || 'Unknown error'}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        }
                                        return null;


                                }
                            })
                        ) : (
                            <ReactMarkdown>{(message as any).content || ''}</ReactMarkdown>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
};