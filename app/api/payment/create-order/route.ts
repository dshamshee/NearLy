import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import ActiveBookingsModel from "@/models/activeBookings";
import dbConnect from "@/utils/dbConnection";
import { razorpayInstance } from "@/lib/razorpay";
import type { Response } from "@/types/response";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?._id) {
      return NextResponse.json<Response>(
        {
          success: false,
          message: "Unauthorized. Please sign in to make a payment.",
          statusCode: 401,
        },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { bookingId } = body as { bookingId?: string };

    if (!bookingId || typeof bookingId !== "string") {
      return NextResponse.json<Response>(
        {
          success: false,
          message: "Invalid request. Please try again.",
          error: "bookingId is required",
          statusCode: 400,
        },
        { status: 400 }
      );
    }

    await dbConnect();

    const booking = await ActiveBookingsModel.findOne({ bookingId: bookingId.trim() });

    if (!booking) {
      return NextResponse.json<Response>(
        {
          success: false,
          message: "Booking not found",
          statusCode: 404,
        },
        { status: 404 }
      );
    }

    const amount = booking.requestedPaymentAmount;
    if (amount == null || amount <= 0) {
      return NextResponse.json<Response>(
        {
          success: false,
          message: "Please wait for the worker to request payment.",
          error: "Payment amount has not been set for this booking. Please wait for the worker to request payment.",
          statusCode: 400,
        },
        { status: 400 }
      );
    }

    const amountInPaise = Math.round(amount * 100);

    const order = await razorpayInstance.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `bookingID_${Date.now()}`,
      payment_capture: true,
    });

    if (!order || !order.id) {
      return NextResponse.json<Response>(
        {
          success: false,
          message: "Failed to make payment. Please try again later.",
          error: "Failed to create Razorpay order",
          statusCode: 500,
        },
        { status: 500 }
      );
    }

    return NextResponse.json<Response>({
      success: true,
      message: "Payment order created successfully",
      statusCode: 200,
      data: {
        id: order.id,
        amount: Number(order.amount),
      },
    });
  } catch (error: unknown) {
    console.error("create-order error:", error);
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
