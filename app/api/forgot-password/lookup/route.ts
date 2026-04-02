import UserModel from "@/models/user";
import { Response } from "@/types/response";
import dbConnect from "@/utils/dbConnection";
import {
  FORGOT_PASSWORD_UID_COOKIE,
  forgotPasswordCookieOptions,
} from "@/lib/forgotPasswordCookie";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = typeof body.email === "string" ? body.email.trim() : "";

    if (!email) {
      return NextResponse.json<Response>(
        {
          success: false,
          message: "Email is required",
          statusCode: 400,
        },
        { status: 400 }
      );
    }

    await dbConnect();
    const user = await UserModel.findOne({ email: email.trim() });
    if (!user) {
      return NextResponse.json<Response>(
        {
          success: false,
          message: "No account found with this email",
          statusCode: 404,
        },
        { status: 404 }
      );
    }

    if (!user.password) {
      return NextResponse.json<Response>(
        {
          success: false,
          message:
            "This account uses Google sign-in. Sign in with Google to access your account.",
          statusCode: 400,
        },
        { status: 400 }
      );
    }

    const uid = String(user._id);
    const res = NextResponse.json<Response>(
      {
        success: true,
        message: "Account found. You can send the reset email when ready.",
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
