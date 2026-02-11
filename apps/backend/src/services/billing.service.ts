import prisma from "@repo/db";

export class BillingService {
    async getInvoices(userId: string) {
        try {
            const invoices = await prisma.invoice.findMany({
                where: { userId },
            });

            if (!invoices) {
                throw new Error("Invoices not found");
            }

            return invoices;
        } catch (error) {
            console.log("Error in getInvoices", error);
            throw error;
        }
    }

    async getInvoiceById(invoiceId: string) {
        try {
            const invoice = await prisma.invoice.findUnique({
                where: { id: invoiceId },
            });

            if (!invoice) {
                throw new Error("Invoice not found");
            }

            return invoice;
        } catch (error) {
            console.log("Error in getInvoiceById", error);
            throw error;
        }
    }

    async getRefundStatus(invoiceId: string) {
        try {
            const invoice = await this.getInvoiceById(invoiceId);

            if (!invoice) {
                throw new Error("Invoice not found");
            }

            if (!invoice.refundStatus) {
                throw new Error("Refund not found");
            }

            return invoice.refundStatus;
        } catch (error) {
            console.log("Error in getRefundStatus", error);
            throw error;
        }
    }

    async requestRefund(invoiceId: string) {
        try {
            const invoice = await this.getInvoiceById(invoiceId);

            if (!invoice) {
                throw new Error("Invoice not found");
            }

            if (invoice.refundStatus) {
                throw new Error("Refund already requested");
            }

            const refund = await prisma.invoice.update({
                where: { id: invoiceId },
                data: {
                    refundStatus: "Processing",
                },
            });

            return refund;
        } catch (error) {
            console.log("Error in requestRefund", error);
            throw error;
        }
    }
}