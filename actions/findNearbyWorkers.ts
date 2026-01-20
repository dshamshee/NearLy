'use server'

import WorkerModel from "@/models/worker";
import dbConnect from "@/utils/dbConnection"

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
        })

        if(!workers) return null;

        // const workersId = workers.map((worker)=> worker._id);

        return workers;


    } catch (error: unknown) {
        console.log("Error in findNearbyWorkers action", error);
        throw new Error(error instanceof Error ? error.message : "Internal Server Error");
    }
}