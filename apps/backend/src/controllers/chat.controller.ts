import type { Context } from "hono";
import { ChatService } from "../services/chat.service.js";
import { routeQuery } from "../agents/router.agent.js";

const chatService = new ChatService();

export class ChatController {
    async createConversation(c: Context) {
        try {
            const { userId } = await c.req.json();

            if (!userId) {
                return c.json({ error: "userId required" }, 400);
            }

            const conversation = await chatService.createConversation(userId);
            return c.json(conversation, 201);
        } catch (error) {
            console.error("Error creating conversation:", error);
            return c.json({ error: "Failed to create conversation" }, 500);
        }
    }

    async addMessage(c: Context) {
        try {
            const { conversationId, role, content } = await c.req.json();

            if (!conversationId || !role || !content) {
                return c.json({ error: "Missing fields" }, 400);
            }

            const message = await chatService.addMessage(
                conversationId,
                role,
                content
            );

            return c.json(message, 201);
        } catch (error) {
            console.error("Error adding message:", error);
            return c.json({ error: "Failed to add message" }, 500);
        }
    }

    async processMessage(c: Context) {
        try {
            const body = await c.req.json();
            let { conversationId, message } = body;
            const { messages } = body;

            // Support Vercel AI SDK structure (messages array)
            if (!message && messages && Array.isArray(messages) && messages.length > 0) {
                const lastMessage = messages[messages.length - 1];
                if (lastMessage.content) {
                    message = lastMessage.content;
                } else if (lastMessage.parts && Array.isArray(lastMessage.parts)) {
                    // Extract text from parts
                    message = lastMessage.parts
                        .filter((p: any) => p.type === 'text')
                        .map((p: any) => p.text)
                        .join('');
                }
            }

            if (!conversationId || !message) {
                return c.json(
                    { error: "conversationId and message are required" },
                    400
                );
            }

            // Get conversation history for context
            const conversation = await chatService.getConversation(conversationId);

            if (!conversation) {
                return c.json({ error: "Conversation not found" }, 404);
            }

            // Build conversation context from message history
            const conversationContext = conversation.messages.map((msg: any) => ({
                role: msg.role,
                content: msg.content,
            }));

            // Save user message
            await chatService.addMessage(conversationId, "user", message);

            // Route to appropriate agent with context
            const result = await routeQuery(message, conversationContext, conversationId);

            // Handle Streaming Response
            if ('stream' in result) {
                const streamResult = result as { stream: any; agent: string };

                // Use toUIMessageStreamResponse with messageMetadata
                return streamResult.stream.toUIMessageStreamResponse({
                    messageMetadata: ({ part }: { part: { type: string; value?: string } }) => {
                        // Send agent info when the message starts
                        if (part.type === 'start') {
                            return {
                                agent: streamResult.agent,
                                createdAt: Date.now(),
                            };
                        }
                        return undefined;
                    },
                    onFinish: async ({ messages: finishedMessages }: { messages: any[] }) => {
                        // Save the last assistant message
                        if (finishedMessages.length > 0) {
                            const lastMessage = finishedMessages[finishedMessages.length - 1];
                            if (lastMessage.role === 'assistant') {
                                const textContent = lastMessage.parts
                                    .filter((p: any) => p.type === 'text')
                                    .map((p: any) => p.text)
                                    .join('');

                                if (textContent) {
                                    await chatService.addMessage(
                                        conversationId,
                                        "assistant",
                                        textContent
                                    );
                                }
                            }
                        }
                    },
                });
            }

            // Handle unknown agent (non-streaming fallback)
            const { text: agentResult, agent } = result;

            // Save assistant response
            await chatService.addMessage(
                conversationId,
                "assistant",
                typeof agentResult === 'string' ? agentResult : agentResult
            );

            return c.json({
                response: typeof agentResult === 'string' ? agentResult : agentResult,
                agent: agent,
            });
        } catch (error) {
            console.error("Error processing message:", error);
            return c.json({ error: "Failed to process message" }, 500);
        }
    }

    async getConversation(c: Context) {
        try {
            const id = c.req.param("id");
            const conversation = await chatService.getConversation(id);

            if (!conversation) {
                return c.json({ error: "Conversation not found" }, 404);
            }

            return c.json(conversation);
        } catch (error) {
            console.error("Error fetching conversation:", error);
            return c.json({ error: "Failed to fetch conversation" }, 500);
        }
    }

    async listConversations(c: Context) {
        try {
            const userId = c.req.query("userId");

            if (!userId) {
                return c.json({ error: "userId query required" }, 400);
            }

            const conversations = await chatService.listConversations(userId);
            return c.json(conversations);
        } catch (error) {
            console.error("Error listing conversations:", error);
            return c.json({ error: "Failed to list conversations" }, 500);
        }
    }

    async deleteConversation(c: Context) {
        try {
            const id = c.req.param("id");
            await chatService.deleteConversation(id);

            return c.json({ message: "Conversation deleted" });
        } catch (error) {
            console.error("Error deleting conversation:", error);
            return c.json({ error: "Failed to delete conversation" }, 500);
        }
    }
}