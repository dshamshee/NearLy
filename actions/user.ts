'use server'


import UserModel from "@/models/user";
import dbConnect from "@/utils/dbConnection";

export async function getUserDetails(userId: string){
    try {
        await dbConnect();
        const user = await UserModel.findOne({_id: userId});
        if(!user) throw new Error("User not found");
        return user;
    } catch (error) {
        throw new Error(error as string);
    }
}

export async function updateUser(userId: string, data: { name?: string; phone?: string; avatar?: string }){
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
        if(!user) throw new Error("User not found");
        return user;
    } catch (error) {
        throw new Error(error as string);
    }
}