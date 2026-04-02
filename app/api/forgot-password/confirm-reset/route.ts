import {
  FORGOT_PASSWORD_UID_COOKIE,
  forgotPasswordCookieOptions,
} from "@/lib/forgotPasswordCookie";
import UserModel from "@/models/user";
import VerificationModel from "@/models/verification";
import { Response } from "@/types/response";
import dbConnect from "@/utils/dbConnection";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { zodForgotNewPasswordOnly } from "@/zod/zodForgotPassword";

export async function POST(request: NextRequest) {
  try {
    const raw = await request.json();
    const parsed = zodForgotNewPasswordOnly.safeParse(raw);
    if (!parsed.success) {
      const first = parsed.error.flatten().fieldErrors;
      const msg =
        Object.values(first).flat()[0] ?? "Invalid password";
      return NextResponse.json<Response>(
        {
          success: false,
          message: msg,
          statusCode: 400,
        },
        { status: 400 }
      );
    }

    const { newPassword, confirmPassword } = parsed.data;
    const tokenFromBody =
      typeof raw.token === "string" ? raw.token.trim() : undefined;

    await dbConnect();

    let userId = request.cookies.get(FORGOT_PASSWORD_UID_COOKIE)?.value;

    if (!userId && tokenFromBody) {
      const record = await VerificationModel.findOne({
        resetPasswordToken: tokenFromBody,
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
      userId = String(user._id);
    }

    if (!userId) {
      return NextResponse.json<Response>(
        {
          success: false,
          message:
            "Your reset session expired. Open the link from your email again or start over.",
          statusCode: 401,
        },
        { status: 401 }
      );
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      const res = NextResponse.json<Response>(
        {
          success: false,
          message: "User not found",
          statusCode: 404,
        },
        { status: 404 }
      );
      res.cookies.set(FORGOT_PASSWORD_UID_COOKIE, "", {
        ...forgotPasswordCookieOptions,
        maxAge: 0,
      });
      return res;
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();

    await VerificationModel.updateMany(
      { userEmail: user.email },
      {
        $set: {
          isResetPasswordTokenExpired: true,
          resetPasswordToken: null,
          resetPasswordTokenExpiresAt: null,
        },
      }
    );

    const res = NextResponse.json<Response>(
      {
        success: true,
        message: "Password updated successfully. You can sign in now.",
        statusCode: 200,
      },
      { status: 200 }
    );

    res.cookies.set(FORGOT_PASSWORD_UID_COOKIE, "", {
      ...forgotPasswordCookieOptions,
      maxAge: 0,
    });

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
