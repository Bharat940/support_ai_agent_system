import { BillingService } from "../services/billing.service.js";

const billingService = new BillingService();

export const billingTools = {
    async getInvoiceId(invoiceId: string) {
        try {
            const invoice = await billingService.getInvoiceById(invoiceId);

            if (!invoice) {
                throw new Error("Invoice not found");
            }

            return invoice;
        } catch (error) {
            console.log("Error in getInvoiceDetails", error);
            throw error;
        }
    },

    async checkRefundStatus(invoiceId: string) {
        try {
            const status = await billingService.getRefundStatus(invoiceId);

            if (!status) {
                throw new Error("Refund status not found");
            }

            return status;
        } catch (error) {
            console.log("Error in checkRefundStatus", error);
            throw error;
        }
    },

    async requestRefund(invoiceId: string) {
        try {
            const refund = await billingService.requestRefund(invoiceId);

            if (!refund) {
                throw new Error("Refund not found");
            }

            return refund;
        } catch (error) {
            console.log("Error in requestRefund", error);
            throw error;
        }
    }
};
