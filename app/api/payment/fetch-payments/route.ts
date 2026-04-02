import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { Response } from "@/types/response";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { qrCodeId } = body as { qrCodeId?: string };

        if (!qrCodeId) {
            return NextResponse.json<Response>(
                {
                    success: false,
                    message: "Invalid request. Please try again.",
                    error: "qrCodeId is required",
                    statusCode: 400,
                },
                { status: 400 }
            );
        }

        const instance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID as string,
            key_secret: process.env.RAZORPAY_KEY_SECRET as string,
        });

        const payments = await instance.qrCode.fetchAllPayments(qrCodeId, {
            count: 10,
            skip: 0,
        });

        return NextResponse.json<Response>({
            success: true,
            message: "Payments fetched successfully",
            statusCode: 200,
            data: payments,
        });
    } catch (error: unknown) {
        console.log("Error in fetch payment status", error);
        const err = error as { statusCode?: number; error?: { description?: string } };
        const statusCode = err?.statusCode ?? 500;
        const message =
            err?.error?.description ??
            (error instanceof Error ? error.message : "Internal Server Error");
        return NextResponse.json<Response>(
            {
                success: false,
                message: "Internal Server Error",
                statusCode,
                error: message,
            },
            { status: statusCode >= 400 ? statusCode : 500 }
        );
    }
}
