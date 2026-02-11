import { streamText, tool, stepCountIs } from "ai";
import { model } from "../lib/ai.js";
import { OrderService } from "../services/order.service.js";
import { z } from "zod";

const orderService = new OrderService();

export async function orderAgent(
    message: string,
    conversationContext?: any[],
    _conversationId?: string
) {
    const result = streamText({
        model,
        messages: [
            {
                role: "system",
                content: `You are an Order Management Agent for our customer support system.         
                Your responsibilities:
                - Track order status and delivery information
                - Provide delivery ETAs
                - Handle order cancellations

                IMPORTANT: Always use the available tools to fetch real-time data from our database.
                If the user doesn't provide a tracking ID, politely ask for it.

                ERROR HANDLING:
                - If a tool returns "Order not found":
                  1. Inform the user that the Order ID "XYZ" could not be found.
                  2. Explain that valid Order IDs usually follow the format "ORD-XXX-XXX" (e.g., "ORD-123-456").
                  3. Ask them to double-check their order confirmation email.
                
                Be helpful, professional, and provide accurate information based on the tool results.`,
            },
            ...(conversationContext || []),
            {
                role: "user",
                content: message,
            },
        ],
        tools: {
            fetchOrderDetails: tool({
                description: "Fetch complete order details including items, status, and delivery information using the order tracking ID",
                inputSchema: z.object({
                    trackingId: z.string().describe("The order tracking ID"),
                }),
                execute: async ({ trackingId }) => {
                    const order = await orderService.getOrderByTrackingId(trackingId);

                    if (!order) {
                        throw new Error("Order not found");
                    }

                    return order;
                },
            }),
            checkDeliveryStatus: tool({
                description: "Check the delivery status and ETA for an order using the tracking ID",
                inputSchema: z.object({
                    trackingId: z.string().describe("The order tracking ID"),
                }),
                execute: async ({ trackingId }) => {
                    return orderService.getDeliveryStatus(trackingId);
                },
            }),
            cancelOrder: tool({
                description: "Cancel an order using the tracking ID. This will update the order status to cancelled.",
                inputSchema: z.object({
                    trackingId: z.string().describe("The order tracking ID to cancel"),
                }),
                execute: async ({ trackingId }) => {
                    return orderService.cancelOrder(trackingId);
                },
            }),
        },
        stopWhen: stepCountIs(5),
        // REMOVED onFinish - controller handles saving
    });

    return result;
}
