'use server'
import { razorpayInstance } from "@/lib/razorpay"

type CreateOrderSuccess = { success: true; data: { id: string; amount: number }; message: string; statusCode: number }
type CreateOrderError = { success: false; message: string; statusCode: number; error?: string }
type CreateOrderResult = CreateOrderSuccess | CreateOrderError

/**
 * @deprecated Use POST /api/payment/create-order instead. This action accepts a client-supplied
 * amount which is insecure (tamperable). The create-order API fetches the amount server-side from
 * the booking record.
 */
export const createRazorpayOrder = async (amount: number): Promise<CreateOrderResult> =>{

    try {
        const options = {
            amount: amount * 100,
            currency: "INR",
            receipt: `bookingID_${Date.now()}`,
            payment_capture: 1,
        }


        const order = await razorpayInstance.orders.create(options);
        if(!order){
            return {
                success: false,
                message: "Something went wrong, please try again later.",
                error: "Failed to create Razorpay order",
                statusCode: 500,
            };
        }

        return {
            success: true,
            message: "Razorpay order created successfully",
            statusCode: 200,
            data: {
                id: order.id,
                amount: Number(order.amount),
            },
        };
    } catch (error: unknown) {
        console.log("Error in createRazorpayOrder", error);
        const err = error as { statusCode?: number; error?: { description?: string } };
        const statusCode = err?.statusCode ?? 500;
        const message = err?.error?.description ?? (error instanceof Error ? error.message : "Internal Server Error");
        return {
            success: false,
            message: "Internal Server Error",
            statusCode,
            error: message,
        };
    }
};