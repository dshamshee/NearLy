import WorkerModel from "@/models/worker";
import { Response } from "@/types/response";
import dbConnect from "@/utils/dbConnection";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export async function GET(request: NextRequest) {
    try {
        await dbConnect();
        
        const session = await getServerSession(authOptions);
        if (!session || !session.user?._id) {
            return NextResponse.json<Response>({
                success: false,
                message: "Unauthorized",
                statusCode: 401,
            }, { status: 401 });
        }

        const userId = session.user._id;
        const worker = await WorkerModel.findOne({ userId }).lean();

        if (!worker) {
            return NextResponse.json<Response>({
                success: false,
                message: "Worker not found",
                statusCode: 404,
            }, { status: 404 });
        }

        return NextResponse.json<Response>({
            success: true,
            message: "Worker details fetched successfully",
            statusCode: 200,
            data: {
                _id: worker._id,
                isActive: worker.isActive || false,
                totalEarnings: worker.totalEarnings || 0,
                totalBookings: worker.totalBookings || 0,
                profession: worker.profession,
            },
        }, { status: 200 });

    } catch (error: unknown) {
        return NextResponse.json<Response>({
            success: false,
            message: error instanceof Error ? error.message : "Internal Server Error",
            statusCode: 500,
        }, { status: 500 });
    }
}
