import { orderAgent } from "./src/agents/order.agent.js";
import { billingAgent } from "./src/agents/billing.agent.js";
import { supportAgent } from "./src/agents/support.agent.js";

console.log("🧪 Testing AI Agent Tool Integration\n");

// Test 1: Order Agent
console.log("1️⃣ Testing Order Agent with tool call...");
const orderResult = await orderAgent(
    "What is the status of order TRK123456?",
    []
);
console.log("Response:", orderResult.text);
console.log("Tool Calls:", orderResult.toolCalls?.length || 0);
console.log("Tool Results:", orderResult.toolResults?.length || 0);
console.log("\n---\n");

// Test 2: Billing Agent
console.log("2️⃣ Testing Billing Agent with tool call...");
const billingResult = await billingAgent(
    "Can you check the refund status for invoice INV789?",
    []
);
console.log("Response:", billingResult.text);
console.log("Tool Calls:", billingResult.toolCalls?.length || 0);
console.log("Tool Results:", billingResult.toolResults?.length || 0);
console.log("\n---\n");

// Test 3: Support Agent
console.log("3️⃣ Testing Support Agent with tool call...");
const supportResult = await supportAgent(
    "Can you show me my conversation history for conversation conv_123?",
    []
);
console.log("Response:", supportResult.text);
console.log("Tool Calls:", supportResult.toolCalls?.length || 0);
console.log("Tool Results:", supportResult.toolResults?.length || 0);
console.log("\n---\n");

console.log("✅ Test complete!");
console.log("\n📊 Summary:");
console.log(`Order Agent: ${orderResult.toolCalls?.length || 0} tool calls`);
console.log(`Billing Agent: ${billingResult.toolCalls?.length || 0} tool calls`);
console.log(`Support Agent: ${supportResult.toolCalls?.length || 0} tool calls`);

if (
    (orderResult.toolCalls?.length || 0) > 0 ||
    (billingResult.toolCalls?.length || 0) > 0 ||
    (supportResult.toolCalls?.length || 0) > 0
) {
    console.log("\n🎉 SUCCESS: Agents are using tools!");
} else {
    console.log("\n⚠️  WARNING: No tools were called. Check the AI model configuration.");
}

process.exit(0);
