import { streamText, tool, stepCountIs } from "ai";
import { model } from "../lib/ai.js";
import { ChatService } from "../services/chat.service.js";
import { z } from "zod";

const chatService = new ChatService();

export async function supportAgent(
    message: string,
    conversationContext?: any[],
    conversationId?: string
) {
    const result = streamText({
        model,
        messages: [
            {
                role: "system",
                content: `You are a Customer Support Agent for our customer support system.
                Your responsibilities:
                - Answer frequently asked questions
                - Help with troubleshooting common issues
                - Provide general assistance and guidance
                - Access conversation history to provide personalized support
                
                Current Conversation ID: ${conversationId}

                IMPORTANT: Use the available tools to access conversation history when needed.
                
                ERROR HANDLING:
                - If you cannot find relevant information in the conversation history:
                  1. Politely inform the user that you couldn't find a match.
                  2. Ask for more specific keywords or details about what they are looking for.
                  3. Offer to help with a new query instead.

                Be friendly, helpful, and provide clear, accurate information.`,
            },
            ...(conversationContext || []),
            {
                role: "user",
                content: message,
            },
        ],
        tools: {
            queryConversationHistory: tool({
                description: "Query specific conversation history by ID",
                inputSchema: z.object({
                    conversationId: z.string().describe("The conversation ID to query"),
                }),
                execute: async ({ conversationId }) => {
                    const conversation = await chatService.getConversation(conversationId);

                    if (!conversation) {
                        throw new Error("Conversation not found");
                    }

                    return conversation;
                },
            }),
        },
        stopWhen: stepCountIs(5),
        // REMOVED onFinish - controller handles saving
    });

    return result;
}
