'use server'


import UserModel from "@/models/user";
import dbConnect from "@/utils/dbConnection";
import { Response } from "@/types/response";

export async function getUserDetails(userId: string): Promise<Response> {
    try {
        await dbConnect();
        const user = await UserModel.findOne({_id: userId}).select("-password");
        if(!user) {
            return {
                success: false,
                message: "User not found",
                error: "User not found",
                statusCode: 404,
                data: null,
            };
        }
        return {
            success: true,
            message: "User details fetched successfully",
            statusCode: 200,
            error: null,
            data: user,
        };
    } catch (error: unknown) {
        return {
            success: false,
            message: "Internal Server Error",
            error: error instanceof Error ? error.message : "Internal Server Error on getUserDetails action",
            statusCode: 500,
            data: null,
        };
    }
}

export async function updateUser(userId: string, data: { name?: string; phone?: string; avatar?: string }): Promise<Response> {
    try {
        await dbConnect();
        const user = await UserModel.findByIdAndUpdate(
            userId,
            { 
                ...data,
                updatedAt: new Date()
            },
            { new: true, runValidators: true }
        );
        if(!user) {
            return {
                success: false,
                message: "User not found",
                error: "User not found",
                statusCode: 404,
                data: null,
            };
        }
        return {
            success: true,
            message: "User updated successfully",
            statusCode: 200,
            error: null,
            data: user,
        };
    } catch (error: unknown) {
        return {
            success: false,
            message: "Internal Server Error",
            error: error instanceof Error ? error.message : "Internal Server Error on updateUser action",
            statusCode: 500,
            data: null,
        };
    }
}