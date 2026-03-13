'use server';

import BookingModel from "@/models/booking";
import { Response } from "@/types/response";
import dbConnect from "@/utils/dbConnection";

export const generatePaymentOTP = async (type: "CUSTOMER" | "WORKER", bookingId: string): Promise<Response> => {
    try {
        await dbConnect();

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const updatedBooking = await BookingModel.findOne({ _id: bookingId });

        if (!updatedBooking) {
            return {
                success: false,
                message: "Booking not found",
                statusCode: 404,
                error: "Booking not found",
                data: null,
            };
        }

        if (type === "CUSTOMER") {
            updatedBooking.customerOTP = otp;
        } else if (type === "WORKER") {
            updatedBooking.workerOTP = otp;
        }

        await updatedBooking.save();

        return {
            success: true,
            message: "Payment OTP generated successfully",
            statusCode: 200,
            data: otp,
            error: null,
        };


    } catch (error) {
        console.error("Error in generatePaymentOTP:", error);
        return {
            success: false,
            message: error instanceof Error ? error.message : "Something went wrong",
            statusCode: 500,
            error: error instanceof Error ? error.message : "Unknown error",
            data: null
        };
    }
};