import WorkerModel from "@/models/worker";
import { Response } from "@/types/response";
import dbConnect from "@/utils/dbConnection";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest): Promise<NextResponse<Response>> {

    try {

        await dbConnect();

        const { userId, rating, comment } = await request.json();
        if (!userId || !rating || !comment) {
            return NextResponse.json<Response>({
                success: false,
                message: "userId, rating, and comment are required",
                statusCode: 400,
                data: null,
            }, { status: 400 });
        }

        const worker = await WorkerModel.findOne({ userId });
        if (!worker) {
            return NextResponse.json<Response>({
                success: false,
                message: "Worker not found",
                statusCode: 404,
                data: null,
            }, { status: 404 });
        }

        const reviews = worker.reviews ?? [];
        reviews.push({
            rating,
            comment,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        worker.reviews = reviews;

        worker.averageRating =
            reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;

        await worker.save();

        return NextResponse.json<Response>(
            {
                success: true,
                message: "Thank you for your feedback, it will help us improve our services.",
                statusCode: 200,
                data: null,
            },
            { status: 200 });


    } catch (error: unknown) {
        return NextResponse.json<Response>({
            success: false,
            message: "Internal Server Error",
            statusCode: 500,
            error: error instanceof Error ? error.message : "Internal Server Error",
            data: null,
        }, { status: 500 });
    }
}