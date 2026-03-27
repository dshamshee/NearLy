import { QueryEmailTemplate } from "@/components/QueryEmailTemplate";
import {
  assertResendSendingDomainVerified,
  formatReplyTo,
  parseSenderDomain,
} from "@/utils/resendContactEmail";
import React from "react";
import { Response } from "@/types/response";
import { render, toPlainText } from "@react-email/render";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

/** Verified sender: display name + address (set RESEND_FROM in .env). Example: NearLy <query@nearly.id0.uk> */
const DEFAULT_RESEND_FROM = "NearLy <query@nearly.id0.uk>";
const DEFAULT_CONTACT_INBOX = "d2405112070016@gmail.com";


export async function POST(request: NextRequest): Promise<NextResponse<Response>> {

    try {
        const apiKey = process.env.RESEND_API_KEY;
        if (!apiKey) {
            return NextResponse.json<Response>({
                success: false,
                message: "Resend API key is not configured",
                statusCode: 500,
                error: "Resend API key is not configured",
            }, { status: 500 });
        }

        const resend = new Resend(apiKey);
        const { name, email, subject, message } = await request.json();

        if (!name || !email || !subject || !message) {
            return NextResponse.json<Response>({
                success: false,
                message: "All fields are required",
                statusCode: 400,
                error: "All fields are required"
            }, { status: 400 });
        }

        const fromAddress = process.env.RESEND_FROM?.trim() || DEFAULT_RESEND_FROM;
        const senderDomain = parseSenderDomain(fromAddress);
        if (!senderDomain) {
            return NextResponse.json<Response>(
                {
                    success: false,
                    message: "Invalid RESEND_FROM address",
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

        const emailHtml = await render(
            React.createElement(QueryEmailTemplate, {
                name: name,
                query: message,
            })
        );

        const emailText = toPlainText(emailHtml);

        const inbox =
            process.env.CONTACT_INBOX_EMAIL?.trim() || DEFAULT_CONTACT_INBOX;
        const subjectLine = subject.trim().toLowerCase().startsWith("[nearly]")
            ? subject.trim()
            : `[NearLy] ${subject.trim()}`;

        const { data, error } = await resend.emails.send({
            from: fromAddress,
            to: inbox,
            replyTo: formatReplyTo(String(name), String(email)),
            subject: subjectLine,
            html: emailHtml,
            text: emailText,
            tags: [{ name: "category", value: "contact-form" }],
            headers: {
                "Auto-Submitted": "auto-generated",
                "X-Auto-Response-Suppress": "All",
            },
        });

        if(error){
            return NextResponse.json<Response>({
                success: false,
                message: "Failed to send email",
                statusCode: 500,
                error: error instanceof Error ? error.message : String(error),
            }, { status: 500 });
        }

        return NextResponse.json<Response>({
            success: true,
            message: "Email sent successfully",
            statusCode: 200,
            data: data,
        }, { status: 200 });


    } catch (error) {
        return NextResponse.json<Response>({
            success: false,
            message: "Internal Server Error",
            statusCode: 500,
            error: error instanceof Error ? error.message : String(error),
        }, { status: 500 });
    }
}