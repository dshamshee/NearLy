'use server'

import WorkerModel from "@/models/worker";
import { Response } from "@/types/response";
import dbConnect from "@/utils/dbConnection"

export const getWorker = async (userId: string): Promise<Response> =>{

    try {
        await dbConnect();
        const worker = await WorkerModel.findOne({userId}).populate("userId", "name avatar").lean();
        if(!worker){
            return {
                success: false,
                message: "Worker not found",
                statusCode: 404,
                data: null,
            };
        }
        return {
            success: true,
            message: "Worker fetched successfully",
            statusCode: 200,
            data: JSON.parse(JSON.stringify(worker)),
        }
    } catch (error: unknown) {
        return {
            success: false,
            message: error instanceof Error ? error.message : "Internal Server Error",
            statusCode: 500,
            data: null,
        };
    }
}