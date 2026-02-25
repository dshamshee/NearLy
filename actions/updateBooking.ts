'use server'
import dbConnect from "@/utils/dbConnection"
import BookingModel from "@/models/booking"
import { GetServerSessionHere } from "@/app/api/auth/[...nextauth]/options"
import { Response } from "@/types/response"

export const updateBookingStatus = async (bookingId: string, status: "ACCEPTED" | "REJECTED" | "CANCELLED" | "COMPLETED")=>{
    try {
        await dbConnect();
        const session = await GetServerSessionHere();
        if(!session || !session?.user?._id){
            return <Response> {
                success: false,
                message: "Unauthorized",
                statusCode: 401
            }
        }

        const updatedBooking = await BookingModel.findOneAndUpdate({_id: bookingId}, {$set: {bookingStatus: status}})
        if(!updatedBooking){
            return <Response> {
                success: false,
                message: "Booking not found",
                statusCode: 404
            }
        }

        return <Response>{
            success: true,
            message: "Booking status updated successfully",
            statusCode: 200
        }


    } catch (error: unknown) {
        console.log("Error in updateBookingStatus", error)
        return {
            success: false,
            message: error instanceof Error ? error.message : "Something went wrong at updateBookingStatus action",
            statusCode: 500
        }
    }
}

export const isWorkerOutForService = async (bookingId: string, status: boolean)=>{
    try {
        await dbConnect();
        const session = await GetServerSessionHere();
        if(!session || !session?.user?._id){
            return <Response> {
                success: false,
                message: "Unauthorized",
                statusCode: 401
            }
        }

        const updatedBooking = await BookingModel.findOneAndUpdate({_id: bookingId}, {$set: {workerOutForWork: status}})
        if(!updatedBooking){
            return <Response> {
                success: false,
                message: "Booking not found",
                statusCode: 404
            }
        }

        return <Response>{
            success: true,
            message: "Worker out for service status updated successfully",
            statusCode: 200
        }
    } catch (error: unknown) {
        console.log("Error in isWorkerOutForService", error)
        return <Response> {
            success: false,
            message: error instanceof Error ? error.message : "Something went wrong at isWorkerOutForService action",
            statusCode: 500
        }
    }
}

export const isWorkCompleted = async (bookingId: string, status: boolean)=>{

    try {
        await dbConnect();
        const session = await GetServerSessionHere();
        if(!session || !session?.user?._id){
            return <Response> {
                success: false,
                message: "Unauthorized",
                statusCode: 401
            }
        }
        const updatedBooking = await BookingModel.findOneAndUpdate({_id: bookingId}, {$set: {isWorkCompleted: status}})
        if(!updatedBooking){
            return <Response> {
                success: false,
                message: "Booking not found",
                statusCode: 404
            }
        }
        return <Response>{
            success: true,
            message: "Work completed status updated successfully",
            statusCode: 200
        }
    } catch (error) {
        console.log("Error in isWorkCompleted", error)
        return <Response> {
            success: false,
            message: error instanceof Error ? error.message : "Something went wrong at isWorkCompleted action",
            statusCode: 500
        }
    }
}

export const isWorkerArrived = async (bookingId: string, status: boolean)=>{
    try {
        await dbConnect();
        const session = await GetServerSessionHere();
        if(!session || !session?.user?._id){
            return <Response> {
                success: false,
                message: "Unauthorized",
                statusCode: 401
            }
        }
        const updatedBooking = await BookingModel.findOneAndUpdate({_id: bookingId}, {$set: {workerArrivedAtDestination: status}})
        if(!updatedBooking){
            return <Response> {
                success: false,
                message: "Booking not found",
                statusCode: 404
            }
        }
        return <Response>{
            success: true,
            message: "Worker arrived at destination status updated successfully",
            statusCode: 200
        }
    } catch (error: unknown) {
        console.log("Error in isWorkerArrived", error)
        return {
            success: false,
            message: error instanceof Error ? error.message : "Something went wrong at isWorkerArrived action",
            statusCode: 500
        }
        }
}