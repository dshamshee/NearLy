import dbConnect from "@/utils/dbConnection";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { Response } from "@/types/response";
import UserModel from "@/models/user";
import VerificationModel from "@/models/verification";

export async function POST(request: NextRequest) {
  await dbConnect();

  try {
    // const {role, name, email, phone, password} = await request.json();
    const { identifier, name, email, password, verificationCode } =
      await request.json();
    console.log(identifier, name, email, password, verificationCode);

    const existingUser = await UserModel.findOne({ email: email, role: identifier });

    if (existingUser) {
      return NextResponse.json<Response>(
        {
          success: false,
          message: "User already exists",
          statusCode: 400,
        },
        { status: 400 }
      );
    }

    const existingVerification = await VerificationModel.findOne({
      userEmail: email,
    });

    if (existingVerification) {
      if (existingVerification.verificationToken !== verificationCode) {
        return NextResponse.json<Response>(
          {
            success: false,
            message: "Invalid verification code",
            statusCode: 400,
          },
          { status: 400 }
        );
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await UserModel.create({
          role: identifier,
          name: name,
          email: email,
          password: hashedPassword,
        });
        newUser.save();

        return NextResponse.json<Response>(
          {
            success: true,
            message: "User created successfully",
            statusCode: 201,
          },
          { status: 201 }
        );
      }
    }
  } catch (error) {
    console.log("Error in signup route", error);
    return NextResponse.json<Response>(
      {
        success: false,
        message: "Internal Server Error on signup route",
        statusCode: 500,
      },
      { status: 500 }
    );
  }
}
