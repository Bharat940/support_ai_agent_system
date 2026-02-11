# AI Customer Support Agent System

A fullstack AI-powered customer support system with a multi-agent architecture. This project uses a Router Agent to delegate queries to specialized sub-agents (Order, Billing, Support), maintaining conversational context and using real-time tools.

## Features
- **Multi-Agent Architecture**: Router, Order, Billing, and Support Agents.
- **Tool Use**: Agents can query the database for real orders, invoices, and conversation history.
- **Streaming Responses**: Token-by-token AI responses for a snappy UI.
- **Conversational Memory**: Agents remember previous context.
- **Modern Stack**: React/Vite Frontend, Hono Backend, PostgreSQL + Prisma.

## Repository Structure
- `apps/backend`: Hono.dev server with AI agents and API routes.
- `apps/frontend`: React + Vite UI with Tailwind CSS.
- `packages/db`: Shared Prisma schema and database client.

## Quick Start

### Prerequisites
- Node.js & pnpm
- PostgreSQL Database
- OpenAI API Key

### Installation

1.  **Install dependencies**
    ```bash
    pnpm install
    ```

2.  **Environment Setup**
    -   Copy `.env.example` to `.env` in `apps/backend` and `apps/frontend`.
    -   Set `DATABASE_URL` and `OPENAI_API_KEY`.

3.  **Database Setup**
    ```bash
    # Generate Prisma Client
    pnpm db:generate

    # Push Schema to DB
    pnpm db:push

    # Seed Database
    pnpm seed
    ```

4.  **Run Development Server**
    ```bash
    pnpm dev
    ```
    This will start both frontend (localhost:5173) and backend (localhost:3000).

## Deployment
See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions on Vercel and Railway.
