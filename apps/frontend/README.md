# Frontend Application

A **React** application built with **Vite** and **Tailwind CSS**. It provides a chat interface to interact with the AI Support Agents.

## Features
- **Real-time Streaming**: Displays AI responses token-by-token.
- **Agent Awareness**: Shows which agent (Order, Billing, Support) is currently handling the request.
- **Chat History**: Sidebar with previous conversations.
- **Responsive Design**: Mobile-friendly UI.

## Configuration
The frontend connects to the backend via the `VITE_API_URL` environment variable.

- **Development**: Defaults to `http://localhost:3000`.
- **Production**: Set `VITE_API_URL` in your deployment provider (e.g., Vercel).

## Scripts
- `pnpm dev`: Start dev server.
- `pnpm build`: Build for production.
- `pnpm preview`: Preview production build.
