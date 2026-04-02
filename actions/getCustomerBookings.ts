"use server";

import BookingModel from "@/models/booking";
import dbConnect from "@/utils/dbConnection";
import { GetServerSessionHere } from "@/app/api/auth/[...nextauth]/options";

export async function getCustomerBookings(customerId: string) {
    try {
        await dbConnect();

        const session = await GetServerSessionHere();
        if (!session?.user?._id) {
            return { success: false, message: "Unauthorized", error: "Unauthorized", statusCode: 401, data: null };
        }

        const isOwnProfile = String(session.user._id) === String(customerId);
        if (!isOwnProfile) {
            return { success: false, message: "Forbidden", error: "Forbidden", statusCode: 403, data: null };
        }

        const bookings = await BookingModel.find({ customerId })
            .populate("workerId", "name email avatar")
            .sort({ bookingDate: -1 })
            .limit(50)
            .lean();

        return {
            success: true,
            message: "Bookings fetched successfully",
            data: JSON.parse(JSON.stringify(bookings)),
            statusCode: 200,
        };
    } catch (error) {
        console.error("getCustomerBookings error:", error);
        return {
            success: false,
            message: "Internal Server Error",
            error: error instanceof Error ? error.message : "Internal Server Error on getCustomerBookings action",
            statusCode: 500,
            data: null,
        };
    }
}
