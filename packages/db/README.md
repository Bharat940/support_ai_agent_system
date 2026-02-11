# Database Package (@repo/db)

Shared database package containing the **Prisma** schema and client.

## Models
- **Conversation**: Stores chat sessions.
- **Message**: Stores individual messages (user/assistant).
- **Order**: Stores sample order data for the Order Agent.
- **Invoice**: Stores sample invoice data for the Billing Agent.

## Commands
- `pnpm db:generate`: Generate Prisma Client.
- `pnpm db:push`: Push schema changes to the database.
- `pnpm db:studio`: Open Prisma Studio to view data.
- `pnpm seed`: Run the seed script to populate data.

## Seeding
The `seed.ts` script populates the database with:
- Sample Orders (Processing, Shipped, Delivered)
- Sample Invoices (Paid, Pending)
- A sample conversation history.
