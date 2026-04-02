'use server'

import UserModel from "@/models/user"
import { Response } from "@/types/response"
import dbConnect from "@/utils/dbConnection"

export async function verifyEmail(email: string): Promise<Response>{

    try {
        await dbConnect()
        const user = await UserModel.findOne({email: email}).select("-password");
        if(!user){
            return{
                success: false,
                message: "No account found with this email",
                statusCode: 404,
                error: "No account found with this email at verifyEmail action",
                data: null
            }
        }
        return{
            success: true,
            message: "Account found with this email",
            statusCode: 200,
            error: null,
            data: JSON.stringify(user)
        }



    } catch (error: unknown) {
        return{
            success: false,
            message: "Internal Server Error",
            error: error instanceof Error ? error.message : "Internal Server Error on verifyEmail action",
            statusCode: 500,
            data: null,
        }
    }
}