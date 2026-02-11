import { Hono } from "hono";
import { OrderController } from "../controllers/order.controller.js";

const router = new Hono();
const controller = new OrderController();

router.post("/", (c) =>
    controller.createOrder(c)
);

router.get("/", (c) =>
    controller.getOrderByStatus(c)
);

router.get("/:trackingId", (c) =>
    controller.getOrderByTrackingId(c)
);

router.get(
    "/:trackingId/status",
    (c) => controller.getDeliveryStatus(c)
);

router.patch(
    "/:trackingId/cancel",
    (c) => controller.cancelOrder(c)
);

export default router;