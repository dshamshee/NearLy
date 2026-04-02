'use server'


import { GetServerSessionHere } from "@/app/api/auth/[...nextauth]/options";
import WorkerModel from "@/models/worker";
import dbConnect from "@/utils/dbConnection"
import { Response } from "@/types/response";

export const getWorkerProfileStatus = async (): Promise<Response> =>{

    try {
        await dbConnect();
        const session = await GetServerSessionHere();
        if(!session || !session.user?._id){
            return {
                success: false,
                message: "unauthorized",
                statusCode: 401,
                error: "Unauthorized",
                data: null
            }
        }

        const isProfileCompleted = await WorkerModel.findOne({userId: session.user?._id}).select("isProfileCompleted");
        if(!isProfileCompleted){
            return {
                success: false,
                message: "Worker profile not completed",
                statusCode: 400,
                error: "Worker profile not completed",
                data: false
            }
        }

        return {
            success: true,
            message: "Profile status fetched successfully",
            statusCode: 200,
            data: isProfileCompleted.isProfileCompleted,
            error: null
        };

    } catch (error: unknown) {
        return {
            success: false,
            message: "Internal Server Error",
            error: error instanceof Error ? error.message : "Internal Server Error on getWorkerProfileStatus action",
            statusCode: 500,
            data: null,
        }
    }
}