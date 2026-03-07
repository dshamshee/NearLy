'use server'

import { razorpayInstance } from "./createRazorpayOrder";
import PaymentModel from "@/models/payment";
import mongoose from "mongoose";


export const fetchPayment = async (paymentId: string, orderId: string, bookingId: mongoose.Types.ObjectId)=>{
    try {
        const payment = await razorpayInstance.payments.fetch(paymentId);
        if(!payment){
            return {
                success: false,
                message: "Payment not found in Razorpay",
                statusCode: 404,
                error: "Payment not found in Razorpay",
            }
        }
        
        const razorpayMethodMap: Record<string, "PAYPAL" | "CREDIT_CARD" | "DEBIT_CARD" | "UPI" | "CASH"> = {
            upi: "UPI",
            card: "CREDIT_CARD",
            netbanking: "CASH",
            wallet: "CASH",
            emandate: "DEBIT_CARD",
        };
        const razorpayStatusMap: Record<string, "PENDING" | "COMPLETED" | "FAILED"> = {
            created: "PENDING",
            authorized: "PENDING",
            captured: "COMPLETED",
            refunded: "COMPLETED",
            failed: "FAILED",
        };

        const newPayment = await PaymentModel.create({
            bookingId,
            paymentId: payment.id,
            amount: Number(payment.amount),
            method: razorpayMethodMap[payment.method] ?? "CASH",
            currency: payment.currency,
            orderId: orderId,
            status: razorpayStatusMap[payment.status] ?? "PENDING",
        })

        return {
            success: true, 
            message: "Payment fetched and saved successfully",
            statusCode: 200,
            data: newPayment,
        }
        
    } catch (error: unknown) {
        console.log("Error in fetchPayment", error);
        const err = error as { statusCode?: number; error?: { description?: string } };
        const statusCode = err?.statusCode ?? 500;
        const message = err?.error?.description ?? (error instanceof Error ? error.message : "Internal Server Error");
        return {
            success: false,
            message,
            statusCode: statusCode,
            error: message,
        }
    }
}