import "dotenv/config"
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'

import chatRoutes from "./routes/chat.routes.js"
import agentRoutes from "./routes/agent.routes.js"
import orderRoutes from "./routes/order.routes.js"
import healthRoutes from "./routes/health.routes.js"

const app = new Hono()

app.use('/*', cors())

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

// Rate Limiting Middleware (Simple In-Memory)
const rateLimit = new Map<string, { count: number; lastReset: number }>();

app.use('*', async (c, next) => {
  const ip = c.req.header('x-forwarded-for') || 'unknown';
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxRequests = 100; // 100 requests per minute

  const record = rateLimit.get(ip) || { count: 0, lastReset: now };

  if (now - record.lastReset > windowMs) {
    record.count = 0;
    record.lastReset = now;
  }

  if (record.count >= maxRequests) {
    return c.json({ error: 'Too many requests' }, 429);
  }

  record.count++;
  rateLimit.set(ip, record);

  await next();
});

// Global Error Handling Middleware
app.onError((err, c) => {
  console.error('Global Error Catch:', err);
  return c.json({
    error: 'Internal Server Error',
    message: err.message || 'Something went wrong',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  }, 500);
});

const appRoutes = app.route("/api/chat", chatRoutes)
  .route("/api/agents", agentRoutes)
  .route("/api/orders", orderRoutes)
  .route("/api/health", healthRoutes)

serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
});

export type AppType = typeof appRoutes;
