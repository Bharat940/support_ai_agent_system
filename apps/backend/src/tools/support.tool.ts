import { ChatService } from "../services/chat.service.js";

const chatService = new ChatService();

export const supportTools = {
    async queryConversationHistory(conversationId: string) {
        try {
            const conversation = await chatService.getConversation(conversationId);

            if (!conversation) {
                throw new Error("Conversation not found");
            }

            return conversation;
        } catch (error) {
            console.log("Error in queryConversationHistory", error);
            throw error;
        }
    },
};