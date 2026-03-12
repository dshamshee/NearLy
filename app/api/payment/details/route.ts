import { NextRequest, NextResponse } from "next/server";
import PaymentModel from "@/models/payment";
import dbConnect from "@/utils/dbConnection";
import { Response } from "@/types/response";
import { razorpayInstance } from "@/lib/razorpay";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { bookingId, paymentId, orderId } = body as {
      bookingId: string;
      paymentId: string;
      orderId: string;
    };

    if (!bookingId || !paymentId || !orderId) {
      return NextResponse.json<Response>(
        {
          success: false,
          message: "bookingId, paymentId, and orderId are required",
          statusCode: 400,
        },
        { status: 400 }
      );
    }

    await dbConnect();

    const payment = await razorpayInstance.payments.fetch(paymentId);

    if (!payment) {
      return NextResponse.json<Response>(
        {
          success: false,
          message: "Payment not found in Razorpay",
          statusCode: 404,
        },
        { status: 404 }
      );
    }

    const razorpayMethodMap: Record<
      string,
      "PAYPAL" | "CREDIT_CARD" | "DEBIT_CARD" | "UPI" | "CASH"
    > = {
      upi: "UPI",
      card: "CREDIT_CARD",
      netbanking: "CASH",
      wallet: "CASH",
      emandate: "DEBIT_CARD",
    };
    const razorpayStatusMap: Record<
      string,
      "created" | "authorized" | "captured" | "refunded" | "failed"
    > = {
      created: "created",
      authorized: "authorized",
      captured: "captured",
      refunded: "refunded",
      failed: "failed",
    };

    const newPayment = await PaymentModel.create({
      bookingId,
      paymentId,
      orderId,
      amount: Number(payment.amount),
      method: razorpayMethodMap[payment.method] ?? "CASH",
      status: razorpayStatusMap[payment.status] ?? "created",
      currency: payment.currency ?? "INR",
    });

    if (!newPayment) {
      return NextResponse.json<Response>(
        {
          success: false,
          message: "Failed to set payment details",
          statusCode: 400,
          error: "Failed to set payment details",
          data: null,
        },
        { status: 400 }
      );
    }

    // Notify dashboard via tracking server (reliable - doesn't depend on payment tab socket)
    const trackingUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000";
    try {
      await fetch(`${trackingUrl.replace(/\/$/, "")}/notify-payment-result`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, success: true }),
      });
    } catch (notifyErr) {
      console.warn("Failed to notify tracking server:", notifyErr);
    }

    return NextResponse.json<Response>({
      success: true,
      message: "Payment details saved successfully",
      statusCode: 200,
      data: newPayment,
      error: null,
    });
  } catch (error: unknown) {
    console.log("Error in setPaymentDetails API", error);
    const err = error as { statusCode?: number; error?: { description?: string } };
    const statusCode = err?.statusCode ?? 500;
    const message =
      err?.error?.description ??
      (error instanceof Error ? error.message : "Internal Server Error");
    return NextResponse.json<Response>(
      {
        success: false,
        message,
        statusCode,
        error: message,
      },
      { status: statusCode >= 400 ? statusCode : 500 }
    );
  }
}
