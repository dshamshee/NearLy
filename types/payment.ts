import mongoose from "mongoose";

export interface Payment {
    bookingId: mongoose.Types.ObjectId;
    paymentId: string;
    orderId: string;
    amount: number;
    method: "PAYPAL" | "CREDIT_CARD" | "DEBIT_CARD" | "UPI" | "CASH";
    status: "PENDING" | "COMPLETED" | "FAILED";
    currency: string;
    createdAt: Date;
    updatedAt: Date;
}