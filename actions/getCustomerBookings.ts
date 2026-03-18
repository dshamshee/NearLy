"use server";

import BookingModel from "@/models/booking";
import dbConnect from "@/utils/dbConnection";
import { GetServerSessionHere } from "@/app/api/auth/[...nextauth]/options";

export async function getCustomerBookings(customerId: string) {
    try {
        await dbConnect();

        const session = await GetServerSessionHere();
        if (!session?.user?._id) {
            return { success: false, message: "Unauthorized", data: null };
        }

        const isOwnProfile = String(session.user._id) === String(customerId);
        if (!isOwnProfile) {
            return { success: false, message: "Forbidden", data: null };
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
        };
    } catch (error) {
        console.error("getCustomerBookings error:", error);
        return {
            success: false,
            message: error instanceof Error ? error.message : "Failed to fetch bookings",
            data: null,
        };
    }
}
