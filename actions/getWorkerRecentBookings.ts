'use server'

import { GetServerSessionHere } from "@/app/api/auth/[...nextauth]/options"
import BookingModel from "@/models/booking"
import { Response } from "@/types/response"
import dbConnect from "@/utils/dbConnection"

export const getWorkerRecentBookings = async (): Promise<Response> =>{

    try {
        await dbConnect();
        const session = await GetServerSessionHere();
        if(!session || !session?.user?._id){
            return <Response> {
                success: false,
                message: "Unauthorized",
                error: "Unauthorized",
                statusCode: 401,
                data: null,
            }
        }

        // Find Recent 10 bookings
        const bookings = await BookingModel.find({workerId: session?.user?._id}).sort({bookingDate: -1}).limit(10).lean();
        if(!bookings){
            return <Response>{
                success: false,
                message: "No bookings found",
                error: "No bookings found",
                statusCode: 404,
                data: null,
            }
        }

        return <Response>{
            success: true,
            message: "Recent Bookings fetched successfully",
            statusCode: 200,
            data: JSON.parse(JSON.stringify(bookings)),
            error: null,
        }

    } catch (error: unknown) {
        return {
            success: false,
            message: "Internal Server Error",
            error: error instanceof Error ? error.message : "Internal Server Error on getWorkerRecentBookings action",
            statusCode: 500,
            data: null,
        }
    }
}