import type { Context } from "hono";

export class AgentController {
    async listAgents(c: Context) {
        const agents = [
            {
                type: "support",
                name: "Support Agent",
                description:
                    "Handles general support inquiries and troubleshooting",
            },
            {
                type: "order",
                name: "Order Agent",
                description:
                    "Handles order tracking, delivery, cancellations",
            },
            {
                type: "billing",
                name: "Billing Agent",
                description:
                    "Handles invoices, refunds, payments",
            },
        ];

        return c.json(agents);
    }

    async getCapabilities(c: Context) {
        const type = c.req.param("type");

        const capabilitiesMap: Record<
            string,
            any
        > = {
            support: {
                tools: [
                    "queryConversationHistory",
                    "getRecentIssues",
                ],
                actions: [
                    "Answer FAQs",
                    "Troubleshoot problems",
                    "Provide help guides",
                ],
            },

            order: {
                tools: [
                    "fetchOrderDetails",
                    "checkDeliveryStatus",
                    "cancelOrder",
                ],
                actions: [
                    "Track orders",
                    "Check ETA",
                    "Cancel orders",
                ],
            },

            billing: {
                tools: [
                    "getInvoiceDetails",
                    "checkRefundStatus",
                    "requestRefund",
                ],
                actions: [
                    "View invoices",
                    "Check payments",
                    "Handle refunds",
                ],
            },
        };

        const capabilities = capabilitiesMap[type];

        if (!capabilities) {
            return c.json(
                { error: "Agent type not found" },
                404
            );
        }

        return c.json({
            type,
            ...capabilities,
        });
    }
}
