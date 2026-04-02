'use server'

import { GetServerSessionHere } from "@/app/api/auth/[...nextauth]/options"
import BookingModel from "@/models/booking"
import WorkerModel from "@/models/worker"
import { Response } from "@/types/response"
import mongoose from "mongoose"
import dbConnect from "@/utils/dbConnection"

/** Parse workExperience string (e.g. "2 YEARS") to number for display */
function parseWorkExperienceYears(workExperience?: string): number {
    if (!workExperience) return 0
    const match = workExperience.match(/(\d+)/)
    return match ? parseInt(match[1], 10) : workExperience.includes("MORE") ? 5 : 0
}


export const getCustomerRecentProfessionals = async (): Promise<Response> =>{

    try {
        await dbConnect();
        const session = await GetServerSessionHere();
        if(!session || !session?.user?._id){
            return <Response>{
                success: false,
                message: "Unauthorized",
                statusCode: 401,
                data: null,
            };
        }

        // find last 10 Bookings of customer
        const lastBookings = await BookingModel.find({customerId: session?.user?._id}).populate("workerId", "_id name email avatar").sort({bookingDate: -1}).limit(10).lean();


        if(!lastBookings){
            return <Response>{
                success: false,
                message: "No recent professionals found",
                statusCode: 404,
                data: null,
            };
        }

        // Worker model uses userId (ref User); booking.workerId is User._id
        const userIds = lastBookings.map((b) => (b.workerId as { _id: mongoose.Types.ObjectId })._id)
        const workerDetails = await WorkerModel.find({
            userId: { $in: userIds }
        })
            .select("userId profession workExperience averageRating")
            .lean();

        const workerMap = new Map(
            workerDetails.map((w) => [String(w.userId), w])
        );

        const responseData = lastBookings.map((booking) => {
            const user = booking.workerId as { _id: unknown; name?: string; email?: string; avatar?: string };
            const worker = workerMap.get(String(user._id));
            return {
                ...booking,
                workerId: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    avatar: user.avatar,
                },
                professional: worker
                    ? {
                        profession: worker.profession,
                        workExperience: worker.workExperience,
                        averageRating: worker.averageRating ?? 0,
                        experienceYears: parseWorkExperienceYears(worker.workExperience),
                    }
                    : null,
            };
        });

        return <Response>{
            success: true,
            message: "Recent Professionals fetched successfully",
            statusCode: 200,
            data: JSON.parse(JSON.stringify(responseData)),
            error: null,
        };

    } catch (error: unknown) {
        return <Response>{
            success: false,
            message: "Internal Server Error",
            error: error instanceof Error ? error.message : "Internal Server Error on getCustomerRecentProfessional action",
            statusCode: 500,
            data: null,
        };
    }
}