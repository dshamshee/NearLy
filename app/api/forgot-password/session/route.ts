import { FORGOT_PASSWORD_UID_COOKIE } from "@/lib/forgotPasswordCookie";
import UserModel from "@/models/user";
import { Response } from "@/types/response";
import dbConnect from "@/utils/dbConnection";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const uid = request.cookies.get(FORGOT_PASSWORD_UID_COOKIE)?.value;
    if (!uid) {
      return NextResponse.json<Response>(
        {
          success: false,
          message: "No active reset session",
          statusCode: 401,
        },
        { status: 401 }
      );
    }

    await dbConnect();
    const user = await UserModel.findById(uid).select("_id");
    if (!user) {
      return NextResponse.json<Response>(
        {
          success: false,
          message: "Invalid session",
          statusCode: 401,
        },
        { status: 401 }
      );
    }

    return NextResponse.json<Response>(
      {
        success: true,
        message: "Session valid",
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
