'use server'

import PaymentModel from "@/models/payment";
import { Payment } from "@/types/payment";
import dbConnect from "@/utils/dbConnection"
import { Response } from '@/types/response'
import { razorpayInstance } from "@/lib/razorpay";



export const setPaymentDetails = async (data: Payment): Promise<Response> => {

    try {
        await dbConnect();

        // Fetch the payment details from razorpay
        const payment = await razorpayInstance.payments.fetch(data.paymentId);

        if (!payment) {
            return {
                success: false,
                message: "Payment not found in Razorpay",
                statusCode: 404,
            }
        }

        const razorpayMethodMap: Record<string, "PAYPAL" | "CREDIT_CARD" | "DEBIT_CARD" | "UPI" | "CASH"> = {
            upi: "UPI",
            card: "CREDIT_CARD",
            netbanking: "CASH",
            wallet: "CASH",
            emandate: "DEBIT_CARD",
        };
        const razorpayStatusMap: Record<string, "created" | "authorized" | "captured" | "refunded" | "failed"> = {
            created: "created",
            authorized: "authorized",
            captured: "captured",
            refunded: "refunded",
            failed: "failed",
        };

        const newPayment = await PaymentModel.create({
            bookingId: data.bookingId,
            paymentId: data.paymentId,
            orderId: data.orderId,
            amount: Number(payment.amount),
            method: razorpayMethodMap[payment.method] ?? "CASH",
            status: razorpayStatusMap[payment.status] ?? "created",
            currency: payment.currency ?? "INR",
        })

        if (!newPayment) {
            return {
                success: false,
                message: "Failed to set payment details",
                statusCode: 400,
                error: "Failed to set payment details",
                data: null,
            }
        }

        return {
            success: true,
            message: "Payment details saved successfully",
            statusCode: 200,
            data: newPayment,
            error: null,
        }

    } catch (error: unknown) {
        console.log("Error in setPaymentDetails Action")
        const err = error as { statusCode?: number; error?: { description?: string } };
        const statusCode = err?.statusCode ?? 500;
        const message = err?.error?.description ?? (error instanceof Error ? error.message : "Internal Server Error");
        return {
            success: false,
            message: message,
            statusCode: statusCode,
            error: message,
        }
    }
}