import { generateText } from "ai";
import type { StreamTextResult } from "ai";
import { model } from "../lib/ai.js";
import { orderAgent } from "./order.agent.js";
import { billingAgent } from "./billing.agent.js";
import { supportAgent } from "./support.agent.js";

export async function classifyIntent(message: string) {
    const prompt = `
        Classify the user query into one intent:

        support: general chat, troubleshooting, history, summary
        order: tracking, delivery, order status
        billing: refunds, invoices, payment

        Query: "${message}"

        Return JSON:
        { "intent": "" }
        `;

    const result = await generateText({
        model,
        prompt,
    });

    try {
        const text = result.text.replace(/```json\n?|```/g, "").trim();
        return JSON.parse(text);
    } catch (error) {
        console.log("Error parsing intent:", error);
        return { intent: "unknown" };
    }
}

type AgentResponse =
    | { text: any; agent: "unknown" }
    | {
          stream: StreamTextResult<any, any>;
          agent: "support" | "order" | "billing";
      };

export async function routeQuery(
    message: string,
    conversationContext: any[],
    conversationId: string
): Promise<AgentResponse> {
    const { intent } = await classifyIntent(message);

    console.log(`[ROUTER] Routing to ${intent} agent`);

    switch (intent) {
        case "order":
            const orderStream = await orderAgent(
                message,
                conversationContext,
                conversationId
            );
            return {
                stream: orderStream,
                agent: "order",
            };

        case "billing":
            const billingStream = await billingAgent(
                message,
                conversationContext,
                conversationId
            );
            return {
                stream: billingStream,
                agent: "billing",
            };

        case "support":
            const stream = await supportAgent(
                message,
                conversationContext,
                conversationId
            );
            return {
                stream,
                agent: "support",
            };

        default:
            return {
                text: "I'm sorry, I couldn't quite understand your request. Could you please rephrase it?\n\nI can help you with:\n- **Orders**: tracking, delivery status, cancellations\n- **Billing**: invoices, refunds, payments\n- **Support**: general questions and troubleshooting\n\nWhat would you like help with?",
                agent: "unknown",
            };
    }
}
