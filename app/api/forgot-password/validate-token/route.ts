import {
  FORGOT_PASSWORD_UID_COOKIE,
  forgotPasswordCookieOptions,
} from "@/lib/forgotPasswordCookie";
import UserModel from "@/models/user";
import VerificationModel from "@/models/verification";
import { Response } from "@/types/response";
import dbConnect from "@/utils/dbConnection";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get("token")?.trim();
    if (!token) {
      return NextResponse.json<Response>(
        {
          success: false,
          message: "Invalid or missing reset link",
          statusCode: 400,
        },
        { status: 400 }
      );
    }

    await dbConnect();
    const record = await VerificationModel.findOne({
      resetPasswordToken: token,
      resetPasswordTokenExpiresAt: { $gt: new Date() },
    });

    if (!record) {
      return NextResponse.json<Response>(
        {
          success: false,
          message: "This reset link is invalid or has expired",
          statusCode: 400,
        },
        { status: 400 }
      );
    }

    const user = await UserModel.findOne({ email: record.userEmail });
    if (!user) {
      return NextResponse.json<Response>(
        {
          success: false,
          message: "User not found",
          statusCode: 404,
        },
        { status: 404 }
      );
    }

    const uid = String(user._id);
    const res = NextResponse.json<Response>(
      {
        success: true,
        message: "Reset session ready",
        statusCode: 200,
      },
      { status: 200 }
    );

    res.cookies.set(FORGOT_PASSWORD_UID_COOKIE, uid, forgotPasswordCookieOptions);

    return res;
  } catch (error) {
    return NextResponse.json<Response>(
      {
        success: false,
        message: "Something went wrong",
        statusCode: 500,
        error: error instanceof Error ? error.message : "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
