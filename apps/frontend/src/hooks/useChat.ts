import { useChat as useVercelChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useState } from 'react';

export const useChat = (conversationId?: string) => {
    const [activeAgent, setActiveAgent] = useState<'router' | 'support' | 'order' | 'billing'>('router');

    const {
        messages,
        sendMessage,
        status,
        stop,
        setMessages,
        error,
    } = useVercelChat({
        id: conversationId,
        transport: new DefaultChatTransport({
            api: `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/chat/process`,
        }),
        onFinish: ({ message }) => {
            console.log('Finished stream', message);

            // Extract agent from metadata
            if (message.metadata && typeof message.metadata === 'object') {
                const metadata = message.metadata as Record<string, unknown>;
                if ('agent' in metadata && typeof metadata.agent === 'string') {
                    const agent = metadata.agent;
                    if (['router', 'support', 'order', 'billing'].includes(agent)) {
                        setActiveAgent(agent as 'router' | 'support' | 'order' | 'billing');
                    }
                }
            }
        },
        onError: (err) => {
            console.error('Chat error:', err);
        },
    });

    return {
        messages,
        sendMessage,
        status,
        stop,
        error,
        activeAgent,
        setActiveAgent,
        setMessages,
        isLoading: status === 'streaming' || status === 'submitted',
    };
};