import type { Context } from "hono";
import { OrderService } from "../services/order.service.js";

const orderService = new OrderService();

export class OrderController {
    async createOrder(c: Context) {
        try {
            const body = await c.req.json();
            const { userId, trackingId, status, deliveryEta } = body;

            if (!userId || !trackingId || !status || !deliveryEta) {
                return c.json({ error: "Missing required fields" }, 400);
            }

            const order = await orderService.createOrder(
                userId,
                trackingId,
                status,
                new Date(deliveryEta)
            );

            return c.json(order, 201);
        } catch (error) {
            console.error(error);
            return c.json({ error: "Failed to create order" }, 500);
        }
    }

    async getOrderByStatus(c: Context) {
        try {
            const userId = c.req.query("userId");
            const status = c.req.query("status");

            if (!userId || !status) {
                return c.json(
                    { error: "User not found" },
                    404
                );
            }

            const orders = await orderService.getOrderByStatus(userId, status);

            return c.json(orders, 200);
        } catch (error) {
            console.error(error);
            return c.json(
                { error: "Failed to get orders by status" },
                500
            );
        }
    }

    async getOrderByTrackingId(c: Context) {
        try {
            const trackingId = c.req.param("trackingId");

            const order = await orderService.getOrderByTrackingId(trackingId);

            if (!order) {
                return c.json({ error: "Order not found" }, 404);
            }

            return c.json(order, 200);
        } catch (error) {
            console.error(error);
            return c.json(
                { error: "Failed to get order by tracking id" },
                500
            );
        }
    }

    async getDeliveryStatus(c: Context) {
        try {
            const trackingId = c.req.param("trackingId");

            const order = await orderService.getDeliveryStatus(trackingId);

            if (!order) {
                return c.json({ error: "Order not found" }, 404);
            }

            return c.json(order, 200);
        } catch (error) {
            console.error(error);
            return c.json(
                { error: "Failed to get delivery status" },
                500
            );
        }
    }

    async cancelOrder(c: Context) {
        try {
            const trackingId = c.req.param("trackingId");

            if (!trackingId) {
                return c.json(
                    { error: "trackingId required" },
                    400
                );
            }

            const order =
                await orderService.cancelOrder(
                    trackingId
                );

            return c.json(order, 200);
        } catch (error) {
            console.error(error);
            return c.json(
                { error: "Failed to cancel order" },
                500
            );
        }
    }

}
