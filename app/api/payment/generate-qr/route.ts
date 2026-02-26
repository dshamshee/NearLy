import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import {Response} from '@/types/response'
export async function POST(req: NextRequest) {

    try {

        const instance = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID as string, key_secret: process.env.RAZORPAY_KEY_SECRET as string })

        const qrCode = await instance.qrCode.create({
            type: "upi_qr",
            name: "NearLy",
            usage: "single_use",
            fixed_amount: true,
            payment_amount: 3*100, // multiple by 100 to convert it into rupees
            description: "Please pay for the service",
            // customer_id: "cust_HKsR5se84c5LTO",

            // customer_id optional - omit or pass a valid customer ID from your Razorpay account
            notes: {
                purpose: "Please pay for the service"
            }
        })

        return NextResponse.json<Response>({
            success: true,
            message: "QR code generated successfully",
            statusCode: 200,
            data: qrCode,
        }, { status: 200 });

    } catch (error: unknown) {
        console.log("Error in generate QR code", error);
        const err = error as { statusCode?: number; error?: { description?: string } };
        const statusCode = err?.statusCode ?? 500;
        const message = err?.error?.description ?? (error instanceof Error ? error.message : "Internal Server Error");
        return NextResponse.json<Response>({
            success: false,
            message,
            statusCode,
            error: message,
        }, { status: statusCode >= 400 ? statusCode : 500 });
    }
}