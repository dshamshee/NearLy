import UserModel from "@/models/user";
import { Response } from "@/types/response";
import dbConnect from "@/utils/dbConnection";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";



export async function POST (request: NextRequest): Promise<NextResponse<Response>> {

    try {
        await dbConnect();
        const {email, oldPassword, newPassword} = await request.json();
        if(!email || !oldPassword || !newPassword) {
            return NextResponse.json<Response>({
                success: false,
                message: "Email, old password and new password are required",
                statusCode: 400,
            }, { status: 400 });
        }

        const user = await UserModel.findOne({email: email});
        if(!user){
            return NextResponse.json<Response>({
                success: false,
                message: "User not found",
                statusCode: 404,
            }, { status: 404 });
        }

        const isPasswordCorrect = await bcrypt.compare(oldPassword, user?.password as string);
        if(!isPasswordCorrect){
            return NextResponse.json<Response>({
                success: false,
                message: "Invalid old password",
                statusCode: 400,
            }, { status: 400 });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedNewPassword as string;
        await user.save();

        return NextResponse.json<Response>({
            success: true,
            message: "Password updated successfully",
            statusCode: 200,
        }, { status: 200 });


    } catch (error) {
        return NextResponse.json<Response>({
            success: false,
            message: "Internal Server Error on forgot password route",
            statusCode: 500,
            error: error instanceof Error ? error.message : "Internal Server Error",
        }, { status: 500 });
    }
}