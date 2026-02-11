import prisma from "./src/index.js";

async function test() {
    console.log("Testing database connection...");
    try {
        await prisma.$connect();
        console.log("✅ Connected to database!");

        // Test count to verify model access
        const count = await prisma.conversation.count();
        console.log(`✅ Found ${count} conversations`);

        await prisma.$disconnect();
        console.log("✅ Disconnected successfully");
    } catch (error) {
        console.error("❌ Error:", error);
        process.exit(1);
    }
}

test();
