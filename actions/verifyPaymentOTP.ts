'use server'

import { GetServerSessionHere } from "@/app/api/auth/[...nextauth]/options";
import BookingModel from "@/models/booking";
import { Response } from "@/types/response";
import dbConnect from "@/utils/dbConnection"

export const verifyPaymentOTP = async (type: "CUSTOMER" | "WORKER", bookingId: string, otp: string): Promise<Response> => {

    try {
        await dbConnect();
        const session = await GetServerSessionHere();
        if (!session || !session.user?._id) {
            return {
                success: false,
                message: "Unauthorized access",
                statusCode: 401,
                error: "Unauthorized access on verifyPaymentOTP action",
                data: null
            }
        }

        const booking = await BookingModel.findOne({ _id: bookingId });
        if (!booking) {
            return {
                success: false,
                message: "Booking not found",
                statusCode: 404,
                error: "Booking not found on verifyPaymentOTP action",
                data: null
            }
        }

        if (type === "CUSTOMER") {
            if (booking.customerOTP !== otp) {
                return {
                    success: false,
                    message: "Invalid OTP",
                    statusCode: 400,
                    error: "Invalid OTP on verifyPaymentOTP action",
                    data: null
                }
            }
        } else if (type === "WORKER") {
            if (booking.workerOTP !== otp) {
                return {
                    success: false,
                    message: "Invalid OTP",
                    statusCode: 400,
                    error: "Invalid OTP on verifyPaymentOTP action",
                    data: null
                }
            }
        }

        await booking.save();

        return {
            success: true,
            message: "Payment OTP verified successfully",
            statusCode: 200,
            error: null,
            data: null
        }




    } catch (error) {
        console.log("Error in verifyPaymentOTP", error)
        return {
            success: false,
            message: error instanceof Error ? error.message : "Something went wrong",
            statusCode: 500,
            error: error instanceof Error ? error.message : "Something went wrong at verifyPaymentOTP action",
            data: null
        }
    }
}