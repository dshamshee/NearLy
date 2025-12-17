import dbConnect from "@/utils/dbConnection";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { Response } from "@/types/response";
import UserModel from "@/models/user";

export async function POST(request: NextRequest){
    await dbConnect();

    try {
        // const {role, name, email, phone, password} = await request.json();
        const {role, name, email, password} = await request.json();
        console.log(role, name, email, password);
        
        const existingUser = await UserModel.findOne({email: email, role: role});

        if(existingUser){
            return NextResponse.json<Response>({
                success: false,
                message: "User already exists",
                statusCode: 400
            }, {status: 400})
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await UserModel.create({
            role: role,
            name: name,
            email: email,
            password: hashedPassword,
        })
        newUser.save();

        return NextResponse.json<Response>({
            success: true,
            message: "User created successfully",
            statusCode: 201
        }, {status: 201})


    } catch (error) {
        console.log("Error in signup route", error);
        return NextResponse.json<Response>({
            success: false,
            message: "Internal Server Error on signup route",
            statusCode: 500
        }, { status: 500 })
    }
}