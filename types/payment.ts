import mongoose from "mongoose";

export interface Payment {
    bookingId: string | mongoose.Types.ObjectId;
    paymentId: string;
    orderId: string;
    amount?: number;
    method?: "PAYPAL" | "CREDIT_CARD" | "DEBIT_CARD" | "UPI" | "CASH";
    status?: "created" | "authorized" | "captured" | "refunded" | "failed";
    currency?: string;
    createdAt?: Date;
    updatedAt?: Date;
}