import { ChatService } from "../services/chat.service.js";

const chatService = new ChatService();

export async function buildContext(
    conversationId: string
) {
    const convo = await chatService.getConversation(conversationId);

    if (!convo) {
        return [];
    }

    const messages = convo.messages
        ?.slice(-10)
        .map((m) => ({
            role: m.role,
            content: m.content,
        }));

    return messages;
}