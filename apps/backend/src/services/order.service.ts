import prisma from "@repo/db";

export class OrderService {
    async createOrder(userId: string, trackingId: string, status: string, deliveryEta: Date) {
        try {
            const order = await prisma.order.create({
                data: {
                    userId,
                    trackingId,
                    status,
                    deliveryEta,
                },
            });
            return order;
        } catch (error) {
            console.error("Error creating order:", error);
            throw error;
        }
    }

    async getOrderByStatus(userId: string, status: string) {
        try {
            const orders = await prisma.order.findMany({
                where: {
                    userId,
                    status,
                },
            });

            if (!orders) {
                throw new Error("Orders not found");
            }

            return orders;
        } catch (error) {
            console.error("Error getting orders by status:", error);
            throw error;
        }
    }

    async getOrderByTrackingId(trackingId: string) {
        try {
            const order = await prisma.order.findUnique({
                where: {
                    trackingId,
                },
            });
            return order;
        } catch (error) {
            console.error("Error getting order by tracking id:", error);
            throw error;
        }
    }

    async getDeliveryStatus(trackingId: string) {
        try {
            const order = await prisma.order.findUnique({
                where: {
                    trackingId,
                },
            });

            if (!order) {
                throw new Error("Order not found");
            }
            return {
                status: order.status,
                eta: order.deliveryEta,
            };
        } catch (error) {
            console.error("Error getting delivery status:", error);
            throw error;
        }
    }

    async cancelOrder(trackingId: string) {
        try {
            const order = await prisma.order.update({
                where: {
                    trackingId,
                },
                data: {
                    status: "cancelled",
                },
            });
            return order;
        } catch (error) {
            console.error("Error cancelling order:", error);
            throw error;
        }
    }
}