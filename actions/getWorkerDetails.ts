import { GetServerSessionHere } from "@/app/api/auth/[...nextauth]/options";
import WorkerModel from "@/models/worker";
import dbConnect from "@/utils/dbConnection";

export async function getWorkerDetails (){

    try {
        await dbConnect();
        const session = await GetServerSessionHere();
        if(!session || !session.user?._id){
            return{
                success: false,
                message: "Unauthorized",
                error: "Unauthorized",
                statusCode: 401,
                data: null,
            };
        }

        const userId = session.user._id;
        const worker = await WorkerModel.findOne({userId: userId}).populate("userId", "name email avatar phone role").lean();
        if(!worker){
            return{
                success: false,
                message: "Worker not found",
                error: "Worker not found",
                statusCode: 404,
                data: null,
            };
        }

        // Convert to plain object to avoid serialization issues with Mongoose documents
        return{
            success: true,
            message: "Worker details fetched successfully",
            statusCode: 200,
            data: JSON.parse(JSON.stringify(worker)),
            error: null,
        };

    } catch (error: unknown) {
        return{
            success: false,
            message: "Internal Server Error",
            error: error instanceof Error ? error.message : "Internal Server Error on getWorkerDetails action",
            statusCode: 500,
        };
    }
}