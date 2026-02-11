import { Hono } from "hono";
import { ChatController } from "../controllers/chat.controller.js";

const router = new Hono();
const controller = new ChatController();

router.post("/conversations", (c) =>
    controller.createConversation(c)
);

router.get("/conversations", (c) =>
    controller.listConversations(c)
);

router.get("/conversations/:id", (c) =>
    controller.getConversation(c)
);

router.delete("/conversations/:id", (c) =>
    controller.deleteConversation(c)
);

router.post("/messages", (c) =>
    controller.addMessage(c)
);

// New endpoint for processing messages with AI agents
router.post("/process", (c) =>
    controller.processMessage(c)
);

export default router;