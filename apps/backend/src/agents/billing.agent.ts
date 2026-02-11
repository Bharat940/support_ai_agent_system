import { streamText, tool, stepCountIs } from "ai";
import { model } from "../lib/ai.js";
import { BillingService } from "../services/billing.service.js";
import { z } from "zod";

const billingService = new BillingService();

export async function billingAgent(
    message: string,
    conversationContext?: any[],
    _conversationId?: string
) {
    const result = streamText({
        model,
        messages: [
            {
                role: "system",
                content: `You are a Billing Support Agent for our customer support system.
                Your responsibilities:
                - Assist with invoice inquiries
                - Process refund requests
                - check refund status
                
                IMPORTANT: Always use the available tools to fetch real-time data from our database.
                If the user doesn't provide an invoice ID or necessary details, politely ask for them.
                
                ERROR HANDLING:
                - If a tool returns "Invoice not found":
                  1. Inform the user that the Invoice ID "XYZ" could not be found.
                  2. Explain that valid Invoice IDs are long alphanumeric strings (e.g., "cmli1r3kv0003ngw6u1pgzhid").
                  3. If the user provided an ID starting with "ORD-", explain that is an Order ID and they need to check their billing documents for the Invoice ID.
                
                Be helpful, professional, and provide accurate information based on the tool results.`,
            },
            ...(conversationContext || []),
            {
                role: "user",
                content: message,
            },
        ],
        tools: {
            getInvoiceDetails: tool({
                description: "Get detailed information about a specific invoice using the invoice ID",
                inputSchema: z.object({
                    invoiceId: z.string().describe("The invoice ID"),
                }),
                execute: async ({ invoiceId }) => {
                    const invoice = await billingService.getInvoiceById(invoiceId);

                    if (!invoice) {
                        throw new Error("Invoice not found");
                    }

                    return invoice;
                },
            }),
            checkRefundStatus: tool({
                description: "Check the status of a refund request using the invoice ID",
                inputSchema: z.object({
                    invoiceId: z.string().describe("The invoice ID"),
                }),
                execute: async ({ invoiceId }) => {
                    const status = await billingService.getRefundStatus(invoiceId);

                    if (!status) {
                        throw new Error("Refund status not found");
                    }

                    return status;
                },
            }),
            requestRefund: tool({
                description: "Submit a request for a refund using the invoice ID",
                inputSchema: z.object({
                    invoiceId: z.string().describe("The invoice ID"),
                    reason: z.string().describe("Reason for the refund request").optional(),
                }),
                execute: async ({ invoiceId, reason }) => {
                    if (reason) {
                        console.log(
                            `Refund requested for invoice ${invoiceId} with reason: ${reason}`
                        );
                    }

                    const result = await billingService.requestRefund(invoiceId);
                    return result;
                },
            }),
        },
        stopWhen: stepCountIs(5),
        // REMOVED onFinish - controller handles saving
    });

    return result;
}
