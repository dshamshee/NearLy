import {
  assertResendSendingDomainVerified,
  DEFAULT_RESEND_FROM,
  parseSenderDomain,
} from "@/utils/resendContactEmail";
import { Response } from "@/types/response";
import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const DEFAULT_RECIPIENT = "danishshamshee@gmail.com";

function buildAssessmentEmailHtml(token: string): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="font-family: Georgia, 'Times New Roman', serif; line-height: 1.6; color: #333; max-width: 640px;">
  <p>Dear Candidate,</p>
  <p>Thank you for showing your interest in Ethics Infotech.</p>
  <p>We are pleased to invite you for the fresher's assessment for Software Development/Software Support. Please find the details below:</p>
  <P>
  <strong>Instruction to candidates</strong>
  <ol>
    <li>Please make sure you are on the call 10 minutes before the assessment time.</li>
    <li>Please make sure you have a stable internet connection.</li>
    <li>Please make sure you have a quiet environment to take the assessment.</li>
    <li>Please make sure you have a laptop or desktop with a camera and microphone.</li>
  </ol>
  </P>
  <p>
    <strong>Interview Date:</strong> 14th April 2026, Tuesday<br />
    <strong>Assessment Time:</strong> 4:00 PM<br />
    <strong>POC Name:</strong> Anamika &amp; Nurpreet<br />
    <strong>POC Contact:</strong> +91 9227997224
  </p>
  <p><strong>Assessment Link:</strong> <a href="https://superset.com/u/${token}">https://superset.com/u/${token}</a></p>
</body>
</html>`;
}

export async function POST(request: NextRequest) {
  try {
    let to = DEFAULT_RECIPIENT;
    try {
      const body = await request.json();
      if (body?.to && typeof body.to === "string") {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailRegex.test(body.to)) {
          to = body.to;
        }
      }
    } catch {
      // empty body is fine; use default recipient
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error("RESEND_API_KEY is not configured");
      return NextResponse.json<Response>(
        {
          success: false,
          message: "Failed to send email. Please try again later.",
          error: "Email service is not configured",
          statusCode: 500,
        },
        { status: 500 }
      );
    }

    const resend = new Resend(apiKey);
    const fromAddress = process.env.RESEND_FROM?.trim() || DEFAULT_RESEND_FROM;
    const senderDomain = parseSenderDomain(fromAddress);
    if (!senderDomain) {
      return NextResponse.json<Response>(
        {
          success: false,
          message: "Failed to send email. Please try again later.",
          statusCode: 500,
          error: "Could not parse domain from RESEND_FROM",
        },
        { status: 500 }
      );
    }

    const domainCheck = await assertResendSendingDomainVerified(
      resend,
      senderDomain
    );
    if (!domainCheck.ok) {
      return NextResponse.json<Response>(
        {
          success: false,
          message: domainCheck.message,
          statusCode: 503,
          error: domainCheck.message,
        },
        { status: 503 }
      );
    }

    const token = crypto.randomBytes(32).toString("hex");

    const { data, error } = await resend.emails.send({
      from: fromAddress,
      to,
      subject: "Assessment round invitation — Ethics Infotech",
      html: buildAssessmentEmailHtml(token),
    });

    if (error) {
      const errDetail =
        error instanceof Error
          ? error.message
          : typeof error === "object" &&
              error !== null &&
              "message" in error &&
              typeof (error as { message: unknown }).message === "string"
            ? (error as { message: string }).message
            : JSON.stringify(error);
      console.error("Resend send-assesment error:", errDetail);
      return NextResponse.json<Response>(
        {
          success: false,
          message: "Failed to send email. Please try again later.",
          statusCode: 500,
          error: errDetail,
        },
        { status: 500 }
      );
    }

    return NextResponse.json<Response>(
      {
        success: true,
        message: "Assessment invitation email sent",
        statusCode: 200,
        data,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("send-assesment route error:", error);
    return NextResponse.json<Response>(
      {
        success: false,
        message: "Something went wrong",
        statusCode: 500,
        error:
          error instanceof Error
            ? error.message
            : "Internal Server Error on send-assesment route",
      },
      { status: 500 }
    );
  }
}
