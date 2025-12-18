import { EmailTemplate } from "@/components/emailTemplate";
import { Resend } from "resend";
import { render } from "@react-email/render";
import React from "react";
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnection";
import crypto from "crypto";
import VerificationModel from "@/models/verification";
import { Response } from "@/types/response";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    // Validate request body
    const body = await request.json();
    const { email, name } = body;

    if (!email || !name) {
      return NextResponse.json<Response>(
        {
          success: false,
          message: "Email and name are required",
          statusCode: 400,
        },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json<Response>(
        {
          success: false,
          message: "Invalid email format",
          statusCode: 400,
        },
        { status: 400 }
      );
    }

    // Check if Resend API key is configured
    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not configured");
      return NextResponse.json<Response>(
        {
          success: false,
          message: "Email service is not configured",
          statusCode: 500,
        },
        { status: 500 }
      );
    }

    await dbConnect();
    const verificationToken = crypto
      .randomInt(0, 1000000)
      .toString()
      .padStart(6, "0");
    const verificationTokenExpiresAt = new Date(Date.now() + 1000 * 60 * 10); // 10 minutes

    let existingVerification = await VerificationModel.findOne({
      userEmail: email,
    });
    if (existingVerification) {
      existingVerification.verificationToken = verificationToken;
      existingVerification.verificationTokenExpiresAt =
        verificationTokenExpiresAt;
      existingVerification.isVerificationTokenExpired = false;
      await existingVerification.save();
      // console.log("Verification token updated");
    } else {
      existingVerification = await VerificationModel.create({
        userEmail: email,
        verificationToken: verificationToken,
        verificationTokenExpiresAt: verificationTokenExpiresAt,
        isVerificationTokenExpired: false,
      });
      // console.log("Verification token created");
      await existingVerification.save();
    }

    // console.log("Email Sending to:", email);

    // Render React component to HTML
    const emailHtml = await render(
      React.createElement(EmailTemplate, {
        name: name,
        verificationCode: verificationToken,
      })
    );

    const { data, error } = await resend.emails.send({
      from: "nearly@ak-diagnostic.in",
      to: email,
      subject: "Email Verification Code from NearLy",
      html: emailHtml,
    });

    if (error) {
      // console.error("Resend API Error:", error);
      return NextResponse.json<Response>(
        {
          success: false,
          message: "Failed to send email. Please try again later.",
          statusCode: 500,
          error: error instanceof Error ? error.message : String(error),
        },
        { status: 500 }
      );
    }

    // console.log("Email sent successfully:", data?.id);

    return NextResponse.json<Response>(
      {
        success: true,
        message: "Verification code sent to email",
        statusCode: 200,
        data: data,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Email verification route error:", error);
    return NextResponse.json<Response>(
      {
        success: false,
        message: "Internal Server Error on email verification route",
        statusCode: 500,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
