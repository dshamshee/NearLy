'use server'

import WorkerModel from "@/models/worker";
import { WorkerProfessions } from "@/types/worker";
import dbConnect from "@/utils/dbConnection"
import { Decimal128 } from "mongodb";
import mongoose from "mongoose";

export async function findNearbyWorkers(latitude: number, longitude: number, profession: WorkerProfessions){

    try {
        await dbConnect();

        // Use $near with 2dsphere index for high-performance geospatial search
        // $maxDistance is in meters (5000 = 5km)
        const workers = await WorkerModel.find({
            location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [longitude, latitude] // GeoJSON: [lng, lat]
                    },
                    $maxDistance: 5000 // 5km in meters
                }
            },
            profession: profession,
            isActive: true,
            isProfileCompleted: true,
        })
        .populate('userId',  '_id name email phone avatar')
        .lean();

        if(!workers || workers.length === 0) return null;

        // Convert Mongoose documents to plain objects and handle special types
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const plainWorkers = workers.map((worker: any) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const plainWorker: any = {};
            
            // Copy all properties and convert special types
            for (const key in worker) {
                const value = worker[key];
                
                // Handle populated user object
                if (key === 'userId' && value && typeof value === 'object') {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const user: any = {};
                    for (const userKey in value) {
                        const userValue = value[userKey];
                        // Convert ObjectId to string
                        if (userValue instanceof mongoose.Types.ObjectId) {
                            user[userKey] = userValue.toString();
                        }
                        // Convert Date to ISO string
                        else if (userValue instanceof Date) {
                            user[userKey] = userValue.toISOString();
                        }
                        // Keep other values as-is
                        else {
                            user[userKey] = userValue;
                        }
                    }
                    plainWorker[key] = user;
                }
                // Convert ObjectId to string
                else if (value instanceof mongoose.Types.ObjectId) {
                    plainWorker[key] = value.toString();
                }
                // Convert Decimal128 to number
                else if (value instanceof Decimal128 || (value && value.constructor && value.constructor.name === 'Decimal128')) {
                    plainWorker[key] = parseFloat(value.toString());
                }
                // Convert Date to ISO string
                else if (value instanceof Date) {
                    plainWorker[key] = value.toISOString();
                }
                // Keep other values as-is
                else {
                    plainWorker[key] = value;
                }
            }
            
            return plainWorker;
        });

        return plainWorkers;


    } catch (error: unknown) {
        console.log("Error in findNearbyWorkers action", error);
        throw new Error(error instanceof Error ? error.message : "Internal Server Error");
    }
}