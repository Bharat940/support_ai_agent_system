# AI Customer Support Agent System

A fullstack AI customer support platform built with a Multi-Agent Architecture. This system uses a "Brain" (Router Agent) to intelligently delegate user inquiries to specialized sub-agents with access to live database tools.

---

## Architecture & Technical Decisions

### Monorepo Structure
Managed with TurboRepo, ensuring high-speed builds and seamless code sharing:
- **apps/backend**: [Hono.dev](https://hono.dev) server providing a high-performance REST API & Hono RPC.
- **apps/frontend**: React + Vite application with a glassmorphic UI.
- **packages/db**: Shared PostgreSQL client using Prisma ORM.
- **packages/typescript-config**: Shared TS configurations.

### Multi-Agent Design
Built using the Vercel AI SDK, the system features:
1. **Router Agent**: Analyzes intent and routes queries (Support, Order, or Billing).
2. **Support Agent**: Specialized in FAQs and general troubleshooting.
3. **Order Agent**: Integrated with DB tools to track and modify user orders.
4. **Billing Agent**: Queries payment history, invoices, and handles refund statuses.

### Key Technical Highlights
- **End-to-End Type Safety**: Leverages Hono RPC to share types between backend and frontend without manual interface synchronization.
- **Streaming Responses**: Token-by-token processing for an interactive user experience.
- **Rate Limiting**: Custom middleware to protect the API from abuse.
- **Persistent Context**: Full conversation history is maintained for context-aware sub-agent interactions.

---

## Tech Stack

- **Framework**: [Hono.dev](https://hono.dev) (Backend), [Vite](https://vitejs.dev/) + React (Frontend).
- **AI Engine**: [Vercel AI SDK](https://sdk.vercel.ai/) with OpenAI.
- **ORM**: [Prisma](https://www.prisma.io/).
- **Database**: PostgreSQL (Hosted on Railway).
- **Styling**: Tailwind CSS.

---

## Getting Started

### 1. Prerequisites
- **Node.js**: v20 or higher (Required for Prisma 7).
- **pnpm**: v9 or higher.
- **PostgreSQL**: A running instance (local or Railway).

### 2. Installation
```bash
pnpm install
```

### 3. Environment Configuration
Create `.env` files in both apps/backend and apps/frontend. Refer to `.env.example` in each directory.

### 4. Database Setup
```bash
# Generate Prisma Client
pnpm run db:generate

# Sync schema and seed data (Orders, Invoices, Messages)
pnpm run db:push
pnpm run seed
```

### 5. Start Development
```bash
pnpm dev
```
- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend**: [http://localhost:3000](http://localhost:3000)

---