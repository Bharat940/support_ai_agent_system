import { OrderService } from "../services/order.service.js";

const orderService = new OrderService();

export const orderTools = {
    async fetchOrderDetails(trackingId: string) {
        try {
            const order = await orderService.getOrderByTrackingId(trackingId);

            if (!order) {
                throw new Error("Order not found");
            }

            return order;
        } catch (error) {
            console.log("Error in fetcOrderDetails", error);
            throw error;
        }
    },

    async checkDeliveryStatus(trackingId: string) {
        try {
            const status = await orderService.getDeliveryStatus(trackingId);

            if (!status) {
                throw new Error("Status not found");
            }

            return status;
        } catch (error) {
            console.log("Error in checkDeliveryStatus", error);
            throw error;
        }
    },

    async cancelOrder(trackingId: string) {
        try {
            const order = await orderService.cancelOrder(trackingId);

            if (!order) {
                throw new Error("Order not found");
            }

            return order;
        } catch (error) {
            console.log("Error in cancelOrder", error);
            throw error;
        }
    }
};