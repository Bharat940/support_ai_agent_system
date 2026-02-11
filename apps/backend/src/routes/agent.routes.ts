import { Hono } from "hono";
import { AgentController } from "../controllers/agent.controller.js";

const router = new Hono();
const controller = new AgentController();

router.get("/", (c) =>
    controller.listAgents(c)
);

router.get("/:type/capabilities", (c) =>
    controller.getCapabilities(c)
);

export default router;

