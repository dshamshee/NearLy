'use server'


import { GetServerSessionHere } from "@/app/api/auth/[...nextauth]/options";
import WorkerModel from "@/models/worker";
import dbConnect from "@/utils/dbConnection"

export const getWorkerProfileStatus = async ()=>{

    try {
        await dbConnect();
        const session = await GetServerSessionHere();
        if(!session || !session.user?._id){
            return {
                success: false,
                message: "unauthorized",
                statusCode: 401
            }
        }

        const isProfileCompleted = await WorkerModel.findOne({userId: session.user?._id}).select("isProfileCompleted");
        if(!isProfileCompleted){
            return {
                success: false,
                message: "Worker profile not completed",
                statusCode: 400,
                data: false
            }
        }

        return {
            success: true,
            message: "Worker profile status fetched successfully",
            statusCode: 200,
            data: isProfileCompleted.isProfileCompleted
        }

    } catch (error: unknown) {
        // throw new Error(error instanceof Error ? error.message : "Internal Server Error on getWorkerProfileStatus");
        return {
            success: false,
            message: error instanceof Error ? error.message : "Internal Server Error on getWorkerProfileStatus",
            statusCode: 500,
            data: false
        }
    }
}