import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Sidebar } from '../chat/Sidebar';
import { ChatInput } from '../chat/ChatInput';
import { ChatMessage } from '../chat/ChatMessage';
import { TypingIndicator } from '../chat/TypingIndicator';
import { AgentIndicator } from '../chat/AgentIndicator';
import { useChat } from '../hooks/useChat';
import { Button } from '../components/ui/Button';
import { client } from '../lib/client';

// Define types for Hono RPC responses since inference might be generic
interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    createdAt: string;
}

interface Conversation {
    id: string;
    userId: string;
    messages: Message[];
    createdAt: string;
}

export const ChatLayout = () => {
    const { conversationId } = useParams();
    const navigate = useNavigate();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [isLoadingHistory, setIsLoadingHistory] = useState(false);

    // Initialize chat hook
    const {
        messages,
        sendMessage,
        error,
        activeAgent,
        setMessages,
        isLoading
    } = useChat(conversationId);

    // Fetch conversation history for Sidebar
    useEffect(() => {
        const userId = "test-user-1";
        setIsLoadingHistory(true);

        async function loadConversations() {
            try {
                // @ts-ignore - AppType inference is complex in this monorepo setup
                const res = await client.api.chat.conversations.$get({ query: { userId } });
                const data = await res.json() as unknown as Conversation[];

                if (Array.isArray(data)) {
                    setConversations(data);
                }
            } catch (err: any) {
                console.error("Failed to load conversations:", err);
            } finally {
                setIsLoadingHistory(false);
            }
        }

        loadConversations();
    }, [conversationId]);

    // Load initial messages for active conversation
    useEffect(() => {
        if (conversationId) {
            // @ts-ignore - AppType inference is complex in this monorepo setup
            client.api.chat.conversations[':id'].$get({ param: { id: conversationId } })
                .then((res: any) => res.json())
                .then((rawData: any) => {
                    const data = rawData as unknown as Conversation;
                    if (data && data.messages) {
                        // Convert to UIMessage format with parts
                        const uiMessages = data.messages.map((m: any) => ({
                            id: m.id,
                            role: m.role,
                            parts: [{ type: 'text', text: m.content } as const],
                            // AI SDK UI renders timestamps from metadata (if provided)
                            metadata: {
                                createdAt: m.createdAt
                                    ? new Date(m.createdAt).getTime()
                                    : Date.now(),
                            },
                        }));
                        setMessages(uiMessages);
                    }
                })
                .catch((err: any) => console.error("Failed to load messages:", err));
        } else {
            setMessages([]);
        }
    }, [conversationId, setMessages]);

    const handleNewChat = async () => {
        try {
            const userId = "test-user-1";
            // @ts-ignore - AppType inference is complex in this monorepo setup
            const res = await client.api.chat.conversations.$post({
                json: { userId }
            });
            const newChat = await res.json() as unknown as Conversation;
            if (newChat && newChat.id) {
                navigate(`/c/${newChat.id}`);
            }
        } catch (error) {
            console.error("Failed to create new chat:", error);
        }
    };

    const handleDeleteChat = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm("Are you sure you want to delete this chat?")) return;

        try {
            // @ts-ignore - AppType inference is complex in this monorepo setup
            await client.api.chat.conversations[':id'].$delete({
                param: { id }
            });
            setConversations(prev => prev.filter(c => c.id !== id));
            if (conversationId === id) {
                navigate('/');
            }
        } catch (error) {
            console.error("Failed to delete chat:", error);
        }
    };

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            <Sidebar
                conversations={conversations}
                onNewChat={handleNewChat}
                onDeleteChat={handleDeleteChat}
                isLoading={isLoadingHistory}
            />

            <main className="flex-1 flex flex-col">
                {/* Chat Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
                    {conversationId ? (
                        messages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                <p>Start a conversation...</p>
                            </div>
                        ) : (
                            messages.map(m => (
                                <ChatMessage
                                    key={m.id}
                                    message={m}
                                    agentType={activeAgent}
                                />
                            ))
                        )
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-500">
                            <h2 className="text-2xl font-bold mb-2">Welcome to AI Support</h2>
                            <p className="text-center max-w-md">
                                Select a conversation from the sidebar or start a new one to get help with your orders, billing, or general questions.
                            </p>
                            <Button onClick={handleNewChat} className="mt-6">
                                Start New Conversation
                            </Button>
                        </div>
                    )}
                    {isLoading && <TypingIndicator />}
                    {error && (
                        <div className="text-red-500 text-center p-2">
                            Error: {error.message}
                        </div>
                    )}
                </div>

                {/* Input Area */}
                {conversationId && (
                    <div className="bg-white">
                        <AgentIndicator activeAgent={activeAgent} />
                        <ChatInput
                            onSend={(msg) => {
                                sendMessage(
                                    { text: msg },
                                    {
                                        body: {
                                            conversationId,
                                        },
                                    }
                                );
                            }}
                            isLoading={isLoading}
                        />
                    </div>
                )}
            </main>
        </div>
    );
};