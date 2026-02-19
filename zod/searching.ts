import { WorkerProfessions } from "@/types/worker";
import { z } from "zod";


export const zodSearching = z.object({
    // bookingId: z.string().min(1, {message: "Booking ID is required"}),
    workNeededProfession: z.enum(WorkerProfessions, {message: "Profession is required"}),
    workNeededDescription: z.string().min(1, {message: "Please describe the work needed."}),
    priceRange: z.number().min(100, {message: "Price range must be greater than or equal to 100"}).max(1000, {message: "Price range must be less than or equal to 1000"}),   
    custLocation: z.object({
        longitude: z.number().min(-180).max(180, {message: "Longitude is required"}),
        latitude: z.number().min(-90).max(90, {message: "Latitude is required"}),
    }),
}).refine((data) => data.custLocation.longitude !== undefined && data.custLocation.latitude !== undefined, {
    message: "Please allow location access or choose your location",
    path: ["custLocation"],
})

export type zodSearchingType = z.infer<typeof zodSearching>;