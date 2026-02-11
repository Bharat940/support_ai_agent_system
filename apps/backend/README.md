# Backend Service

The backend is built with **Hono** and **Vercel AI SDK**, serving as the brain of the customer support system.

## Architecture
- **Controllers**: Handle HTTP requests and responses.
- **Services**: Business logic and database interactions.
- **Agents**: AI Agents (Router, support, Order, Billing) defined with specific prompts and tools.
- **Tools**: Functions that agents can call to interact with the database.

## API Endpoints

### Chat
- `POST /api/chat/messages`: Send a message (Standard).
- `POST /api/chat/process`: Process message with AI Agents (Streaming).
- `GET /api/chat/conversations`: List conversations.
- `GET /api/chat/conversations/:id`: Get conversation history.

### Agents
- `GET /api/agents`: List available agents.
- `GET /api/agents/:type/capabilities`: Get specific agent capabilities.

## Scripts
- `pnpm dev`: Start development server (watch mode).
- `pnpm build`: Build for production.
- `pnpm start`: Start production server.
