'use server'
import WorkerModel from "@/models/worker";
import { Response } from "@/types/response";
import dbConnect from "@/utils/dbConnection";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export async function updateWorkerStatus(status: boolean, latitude: number, longitude: number): Promise<Response> {
    console.log("status", status);
    try {
        await dbConnect();
        
        // Get session to verify user is authenticated
        const session = await getServerSession(authOptions);
        if (!session || !session.user?._id) {
            return {
                success: false,
                message: "Unauthorized",
                statusCode: 401,
            };
        }

        const userId = session.user._id;
        
        if(status === undefined) {
            return {
                success: false,
                message: "Status is required",
                statusCode: 400,
            };
        }

        // Find worker by userId (not worker document _id)
        const worker = await WorkerModel.findOne({userId: userId});
        if(!worker){
            return {
                success: false,
                message: "Worker not found",
                statusCode: 404,
            };
        }

        worker.isActive = status;
        if (latitude !== undefined && longitude !== undefined) {
            // Store coordinates with full precision (no truncation)
            // Decimal128 can handle full double precision
            worker.latitude = latitude.toString();
            worker.longitude = longitude.toString();
        }
        await worker.save();

        return {
            success: true,
            message: "Worker status updated successfully",
            statusCode: 200,
        };

    } catch (error: unknown) {
        console.log("Error in updateWorkerStatus action", error);
        return {
            success: false,
            message: error instanceof Error ? error.message : "Internal Server Error",
            statusCode: 500,
        };
    }
}