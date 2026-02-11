import prisma from "../src/index.js";


async function main() {
    console.log("Start seeding ...");

    // Clean up existing data
    await prisma.message.deleteMany();
    await prisma.conversation.deleteMany();
    await prisma.order.deleteMany();
    await prisma.invoice.deleteMany();

    // Create Sample User (Implicitly used by ID)
    const userId = "test-user-1";

    // --- Orders ---
    const order1 = await prisma.order.create({
        data: {
            userId,
            trackingId: "ORD-123-456",
            status: "DELIVERED",
            deliveryEta: new Date("2023-12-25T10:00:00Z"),
        },
    });

    const order2 = await prisma.order.create({
        data: {
            userId,
            trackingId: "ORD-789-012",
            status: "SHIPPED",
            deliveryEta: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        },
    });

    const order3 = await prisma.order.create({
        data: {
            userId,
            trackingId: "ORD-345-678",
            status: "PROCESSING",
            deliveryEta: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        },
    });

    console.log("Created Orders:", { order1, order2, order3 });

    // --- Invoices ---
    const invoice1 = await prisma.invoice.create({
        data: {
            userId,
            amount: 49.99,
            status: "PAID",
            refundStatus: "NONE",
        },
    });

    const invoice2 = await prisma.invoice.create({
        data: {
            userId,
            amount: 120.50,
            status: "PENDING",
            refundStatus: "NONE",
        },
    });

    const invoice3 = await prisma.invoice.create({
        data: {
            userId,
            amount: 25.00,
            status: "PAID",
            refundStatus: "REFUNDED",
        },
    });

    console.log("Created Invoices:", { invoice1, invoice2, invoice3 });

    // --- Conversations ---
    const conversation = await prisma.conversation.create({
        data: {
            userId,
            messages: {
                create: [
                    {
                        role: "user",
                        content: "Where is my order ORD-789-012?",
                    },
                    {
                        role: "assistant",
                        content: "I checked the status of order #ORD-789-012. It is currently SHIPPED and is expected to arrive in 2 days.",
                    },
                ],
            },
        },
    });

    console.log("Created Conversation:", conversation);

    console.log("Seeding finished.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
