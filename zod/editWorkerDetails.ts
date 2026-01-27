import { WorkerProfessions } from "@/types/worker";
import z from "zod";

export const editWorkerDetails = z.object({
    name: z.string().min(3, {message: "Name must be at least 3 characters"}),
    phone: z.string()
        .min(10, {message: "Phone number must be at least 10 digits"})
        .max(10, {message: "Phone number must be at most 10 digits"})
        .regex(/^[\d\s\+\-()]+$/, {message: "Phone number contains invalid characters"}),
    profession: z.enum(Object.values(WorkerProfessions) as [string, ...string[]], {message: "Invalid profession"}),
    otherProfession: z.string().optional(),
    proficienciyLevel: z.enum(["BEGINNER", "INTERMEDIATE", "EXPERT"], {message: "Invalid proficiency level"}),
    workExperience: z.enum(["1 YEAR", "2 YEARS", "3 YEARS", "4 YEARS", "5 YEARS", "MORE THAN 5 YEARS"], {message: "Invalid work experience"}),
    serviceCharge: z.number().min(0, {message: "Service charge must be at least 0"}),
    aadharNumber: z.string()
        .min(12, {message: "Aadhar number must be 12 digits"})
        .max(12, {message: "Aadhar number must be at most 12 digits"})
        .regex(/^[\d\s]+$/, {message: "Aadhar number must contain only digits and spaces"})
        .optional(),
}).refine((data) => {
    // If profession is OTHER, otherProfession is required
    if (data.profession === WorkerProfessions.OTHER) {
        return data.otherProfession && data.otherProfession.trim().length > 0;
    }
    return true;
}, {
    message: "Please specify your profession",
    path: ["otherProfession"],
});

export type EditWorkerDetailsType = z.infer<typeof editWorkerDetails>;