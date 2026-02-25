'use server'
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import BookingModel from "@/models/booking";
import dbConnect from "@/utils/dbConnection"
import { getServerSession } from "next-auth";

export const createBooking = async (booking: {workerId: string, bookingDetails: {workNeededDescription: string, workNeededProfession: string, custLocation: {longitude: number, latitude: number}}})=>{

    try {
        await dbConnect();

        const session = await getServerSession(authOptions)
        if(!session || !session?.user?._id){
            return {
                success: false,
                message: "Unauthorized",
                statusCode: 401
            }
        }

        const newBooking = new BookingModel({
            customerId: session.user._id,
            workerId: booking.workerId,
            bookingDate: new Date(),
            bookingTime: new Date(),
            bookingStatus: "PENDING",
            workNeededDescription: booking.bookingDetails.workNeededDescription,
            workNeededProfession: booking.bookingDetails.workNeededProfession,
            customerLongitude: booking.bookingDetails.custLocation.longitude.toString(),
            customerLatitude: booking.bookingDetails.custLocation.latitude.toString(),
            isWorkCompleted: false,
        })
        await newBooking.save();

        return {
            success: true,
            message: "Booking request sent successfully",
            statusCode: 200,
            bookingId: newBooking._id.toString()
        }
    } catch (error: unknown) {
        console.log("Error in createBooking", error)
        return {
            success: false,
            message: error instanceof Error ? error.message : "Something went wrong at createBooking action",
            statusCode: 500
        }
    }
}