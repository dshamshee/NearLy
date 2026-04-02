import { ForgotPasswordEmailTemplate } from "@/components/ForgotPasswordEmailTemplate";
import {
  FORGOT_PASSWORD_UID_COOKIE,
  forgotPasswordCookieOptions,
} from "@/lib/forgotPasswordCookie";
import UserModel from "@/models/user";
import VerificationModel from "@/models/verification";
import { Response } from "@/types/response";
import dbConnect from "@/utils/dbConnection";
import { render } from "@react-email/render";
import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import React from "react";
import { Resend } from "resend";

function appOrigin(request: NextRequest): string {
  const env = process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL;
  if (env) {
    return env.startsWith("http") ? env : `https://${env}`;
  }
  return request.nextUrl.origin;
}

export async function POST(request: NextRequest) {
  try {
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json<Response>(
        {
          success: false,
          message: "Email service is not configured",
          statusCode: 500,
        },
        { status: 500 }
      );
    }

    const uid = request.cookies.get(FORGOT_PASSWORD_UID_COOKIE)?.value;
    if (!uid) {
      return NextResponse.json<Response>(
        {
          success: false,
          message:
            "Session expired. Please enter your email again and search for your account.",
          statusCode: 401,
        },
        { status: 401 }
      );
    }

    await dbConnect();
    const user = await UserModel.findById(uid);
    if (!user) {
      const res = NextResponse.json<Response>(
        {
          success: false,
          message: "Account not found. Please start over.",
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

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await VerificationModel.findOneAndUpdate(
      { userEmail: user.email },
      {
        $set: {
          resetPasswordToken: token,
          resetPasswordTokenExpiresAt: expiresAt,
          isResetPasswordTokenExpired: false,
        },
      },
      { upsert: true, new: true }
    );

    const origin = appOrigin(request);
    const resetUrl = `${origin}/forgot-password/complete?token=${encodeURIComponent(token)}`;

    const emailHtml = await render(
      React.createElement(ForgotPasswordEmailTemplate, {
        name: user.name,
        resetUrl,
      })
    );

    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: "noreply@nearly.id0.uk",
      to: user.email,
      subject: "Reset your NearLy password",
      html: emailHtml,
    });

    if (error) {
      return NextResponse.json<Response>(
        {
          success: false,
          message: "Failed to send email. Please try again later.",
          statusCode: 500,
          error: String(error),
        },
        { status: 500 }
      );
    }

    return NextResponse.json<Response>(
      {
        success: true,
        message: "Check your inbox for a link to reset your password.",
        statusCode: 200,
      },
      { status: 200 }
    );
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
