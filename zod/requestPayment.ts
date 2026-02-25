import { z } from "zod";

export const requestPayment = z.object({
    bookingId: z.string().min(1, {message: "Booking ID is required"}),
    amount: z.number().min(100, {message: "Amount must be greater than or equal to 100"}).max(1000, {message: "Amount must be less than or equal to 1000"}),
    otp: z.string().min(6, {message: "OTP must be 6 characters"}).max(6, {message: "OTP must be 6 characters"}),
}).refine((data) => data.amount >= 100 && data.amount <= 1000, {
    message: "Amount must be between 100 and 1000",
    path: ["amount"],
})

export type RequestPaymentType = z.infer<typeof requestPayment>;