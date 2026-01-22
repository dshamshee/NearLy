import BookingModel from "@/models/booking";
import { Response } from "@/types/response";
import dbConnect from "@/utils/dbConnection";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import WorkerModel from "@/models/worker";

export async function GET(request: NextRequest) {
    try {
        await dbConnect();
        
        const session = await getServerSession(authOptions);
        if (!session || !session.user?._id) {
            return NextResponse.json<Response>({
                success: false,
                message: "Unauthorized",
                statusCode: 401,
            }, { status: 401 });
        }

        const userId = session.user._id;
        const worker = await WorkerModel.findOne({ userId }).lean();

        if (!worker) {
            return NextResponse.json<Response>({
                success: false,
                message: "Worker not found",
                statusCode: 404,
            }, { status: 404 });
        }

        const limit = parseInt(request.nextUrl.searchParams.get("limit") || "10");

        // workerId in Booking model references User ID, not Worker document ID
        const bookings = await BookingModel.find({ workerId: userId })
            .populate("customerId", "name email avatar")
            .sort({ bookingDate: -1 })
            .limit(limit)
            .lean();

        const formattedBookings = bookings.map(booking => ({
            _id: booking._id,
            bookingDate: booking.bookingDate,
            bookingTime: booking.bookingTime,
            bookingStatus: booking.bookingStatus,
            workNeededDescription: booking.workNeededDescription,
            workNeededProfession: booking.workNeededProfession,
            customer: booking.customerId,
            isWorkCompleted: booking.isWorkCompleted,
        }));

        return NextResponse.json<Response>({
            success: true,
            message: "Bookings fetched successfully",
            statusCode: 200,
            data: formattedBookings,
        }, { status: 200 });

    } catch (error: unknown) {
        return NextResponse.json<Response>({
            success: false,
            message: error instanceof Error ? error.message : "Internal Server Error",
            statusCode: 500,
        }, { status: 500 });
    }
}
