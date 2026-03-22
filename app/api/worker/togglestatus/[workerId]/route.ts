import WorkerModel from "@/models/worker";
import { Response } from "@/types/response";
import dbConnect from "@/utils/dbConnection";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ workerId: string }> }
) {
    try {
        const { workerId } = await params;
        if (!workerId || typeof workerId !== "string") {
            return NextResponse.json<Response>({
                success: false,
                message: "Worker ID is required",
                statusCode: 400,
                data: null,
            }, { status: 400 });
        }
        await dbConnect();

        const worker = await WorkerModel.findOne({userId: workerId});

        // const worker = await WorkerModel.findOne({_id: workerId});
        if(!worker){
            return NextResponse.json<Response>({
                success: false,
                message: "Worker not found",
                statusCode: 404,
                data: null,
            }, { status: 404 })
        }

        worker.isActive = !worker.isActive;
        await worker.save();

        return NextResponse.json<Response>({
            success: true,
            message: "Worker status updated successfully",
            statusCode: 200,
            data: worker,
        }, {status: 200})


    } catch (error: unknown) {
        return NextResponse.json<Response>({
            success: false,
            message: error instanceof Error ? error.message : "Internal Server Error on worker toggle status route",
            statusCode: 500,
            data: null,
        }, { status: 500 })
    }
}