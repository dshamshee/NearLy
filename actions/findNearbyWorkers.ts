'use server'

import WorkerModel from "@/models/worker";
import dbConnect from "@/utils/dbConnection"
import { Decimal128 } from "mongodb";
import mongoose from "mongoose";

export async function findNearbyWorkers(latitude: number, longitude: number){

    try {
        await dbConnect();
        
        // Find workers within 5KM radius of the given latitude and longitude
        const workers = await WorkerModel.find({
            latitude: {
                $gte: latitude - 0.05,
                $lte: latitude + 0.05,
            },
            longitude: {
                $gte: longitude - 0.05,
                $lte: longitude + 0.05,
            },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any).lean();

        if(!workers || workers.length === 0) return null;

        // Convert Mongoose documents to plain objects and handle special types
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const plainWorkers = workers.map((worker: any) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const plainWorker: any = {};
            
            // Copy all properties and convert special types
            for (const key in worker) {
                const value = worker[key];
                
                // Convert ObjectId to string
                if (value instanceof mongoose.Types.ObjectId) {
                    plainWorker[key] = value.toString();
                }
                // Convert Decimal128 to number
                else if (value instanceof Decimal128 || (value && value.constructor && value.constructor.name === 'Decimal128')) {
                    plainWorker[key] = parseFloat(value.toString());
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