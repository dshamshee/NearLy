import WorkerModel from "@/models/worker";
import { Response } from "@/types/response";
import dbConnect from "@/utils/dbConnection";
import { NextRequest, NextResponse } from "next/server";


export async function POST(request: NextRequest){

    try {
        await dbConnect();
        const {workerId, status} = await request.json();
        if(!workerId || !status) {
            return NextResponse.json<Response>({
                success: false,
                message: "Worker ID and status are required",
                statusCode: 400,
            }, { status: 400 });
        }

        const worker = await WorkerModel.findOne({_id: workerId});
        if(!worker){
            return NextResponse.json<Response>({
                success: false,
                message: "Worker not found",
                statusCode: 404,
            }, { status: 404 });
        }

        worker.isActive = status === "ACTIVE" ? true : false;
        await worker.save();

        return NextResponse.json<Response>({
            success: true,
            message: "Worker status updated successfully",
            statusCode: 200,
        }, {status: 200});



    } catch (error: unknown) {
        return NextResponse.json<Response>({
            success: false,
            message: error instanceof Error ? error.message : "Internal Server Error on worker status route",
            statusCode: 500,
        }, { status: 500 });
    }
}