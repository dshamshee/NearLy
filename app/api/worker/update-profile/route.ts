import UserModel from "@/models/user";
import WorkerModel from "@/models/worker";
import { Response } from "@/types/response";
import dbConnect from "@/utils/dbConnection";
import { NextRequest, NextResponse } from "next/server";
import { GetServerSessionHere } from "../../auth/[...nextauth]/options";

export async function POST(request: NextRequest) {

    try {
        const session = await GetServerSessionHere();
        if (!session || !session.user?._id) {
            return NextResponse.json<Response>({
                success: false,
                message: "Unauthorized",
                statusCode: 401,
            }, { status: 401 });
        }
        await dbConnect();
        const data = await request.json();
        if (!data) {
            return NextResponse.json<Response>({
                success: false,
                message: "Invalid data. Please try again.",
                error: "Data are required",
                statusCode: 400,
            }, { status: 400 });
        }

        const worker = await WorkerModel.findOne({ userId: session.user?._id });
        const user = await UserModel.findOne({ _id: session.user?._id });
        if (!worker || !user) {
            return NextResponse.json<Response>({
                success: false,
                message: "Worker not found",
                error: "Worker not found",
                statusCode: 404
            }, { status: 404 });
        }

        // Object.assign(worker, data);
        worker.profession = data.profession;
        worker.proficienciyLevel = data.proficienciyLevel;
        worker.otherProfession = data.otherProfession;
        worker.workExperience = data.workExperience;
        worker.serviceCharge = data.serviceCharge;
        worker.aadharNumber = data.aadharNumber;
        worker.isProfileCompleted = true;
        worker.isAadharVerified = true;

        user.name = data.name;
        user.phone = data.phone;
        await worker.save();
        await user.save();

        return NextResponse.json<Response>({
            success: true,
            message: "Your profile updated successfully",
            statusCode: 200,
        }, { status: 200 });



    } catch (error: unknown) {
        console.log("Error in worker update profile route", error);

        return NextResponse.json<Response>({
            success: false,
            message: "Internal Server Error",
            error: error instanceof Error ? error.message : "Internal Server Error on worker update profile route",
            statusCode: 500,
        }, { status: 500 });

    }
}