import prisma from "@repo/db";

export class ChatService {
    async createConversation(userId: string) {
        try {
            const conversation = await prisma.conversation.create({
                data: {
                    userId,
                },
            });
            return conversation;
        } catch (error) {
            console.error("Error creating conversation:", error);
            throw error;
        }
    }

    async addMessage(
        conversationId: string,
        role: "user" | "assistant",
        content: string
    ) {
        try {
            const message = await prisma.message.create({
                data: {
                    conversationId,
                    role,
                    content,
                },
            });
            return message;
        } catch (error) {
            console.error("Error adding message:", error);
            throw error;
        }
    }

    async getConversation(conversationId: string) {
        try {
            const conversation = await prisma.conversation.findUnique({
                where: {
                    id: conversationId,
                },
                include: {
                    messages: true,
                },
            });
            return conversation;
        } catch (error) {
            console.error("Error getting conversation:", error);
            throw error;
        }
    }

    async listConversations(userId: string) {
        try {
            const conversations = await prisma.conversation.findMany({
                where: {
                    userId,
                },
                orderBy: {
                    createdAt: "desc",
                },
            });
            return conversations;
        } catch (error) {
            console.error("Error listing conversations:", error);
            throw error;
        }
    }

    async deleteConversation(conversationId: string) {
        try {
            const conversation = await prisma.conversation.delete({
                where: {
                    id: conversationId,
                },
            });
            return conversation;
        } catch (error) {
            console.error("Error deleting conversation:", error);
            throw error;
        }
    }
}