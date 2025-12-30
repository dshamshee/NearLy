import { WorkerProfessions } from "@/types/worker";
import { z } from "zod";


export const zodSearching = z.object({
    workNeededProfession: z.enum(WorkerProfessions, {message: "Profession is required"}),
    workNeededDescription: z.string().min(1, {message: "Please describe the work needed."}),
    custLocation: z.object({
        longitude: z.number().min(1, {message: "Longitude is required"}),
        latitude: z.number().min(1, {message: "Latitude is required"}),
    }),
}).refine((data) => data.custLocation.longitude && data.custLocation.latitude, {
    message: "Please choose your location",
    path: ["custLocation"],
})

export type zodSearchingType = z.infer<typeof zodSearching>;