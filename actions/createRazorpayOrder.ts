'use server'
import Razorpay from "razorpay"

export const createRazorpayOrder = async ()=>{

    try {
        const razorpayInstance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID as string,
            key_secret: process.env.RAZORPAY_KEY_SECRET as string,
        })

        const options = {
            amount: 100,
            currency: "INR",
            receipt: `bookingID_${Date.now()}`,
            payment_capture: 1,
        }


        const order = await razorpayInstance.orders.create(options);
        if(!order){
            return {
                success: false,
                message: "Failed to create Razorpay order",
                statusCode: 500,
            };
        }

        return {
            sucess: true,
            message: "Razorpay order created successfully",
            statusCode: 200,
            data: order,
        };
    } catch (error: unknown) {
        console.log("Error in createRazorpayOrder", error);
        const err = error as { statusCode?: number; error?: { description?: string } };
        const statusCode = err?.statusCode ?? 500;
        const message = err?.error?.description ?? (error instanceof Error ? error.message : "Internal Server Error");
        return {
            success: false,
            message,
            statusCode,
            error: message,
        };
    }
};