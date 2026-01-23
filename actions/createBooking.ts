import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import BookingModel from "@/models/booking";
import dbConnect from "@/utils/dbConnection"
import { getServerSession } from "next-auth";
import { Decimal128 } from "mongodb";

export const createBooking = async ({workNeededDescription, workNeededProfession, customerLocation}: {workNeededDescription: string, workNeededProfession: string, customerLocation: {longitude: number, latitude: number}})=>{

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
            bookingStatus: "PENDING",
            workNeededDescription: workNeededDescription,
            workNeededProfession: workNeededProfession,
            customerLongitude: new Decimal128(customerLocation.longitude.toString()),
            customerLatitude: new Decimal128(customerLocation.latitude.toString()),
        })
        await newBooking.save();

        return {
            success: true,
            message: "Booking request sent successfully",
            statusCode: 200,
            bookingId: newBooking._id
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