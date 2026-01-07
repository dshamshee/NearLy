import dbConnect from "@/utils/dbConnection";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { Response } from "@/types/response";
import UserModel from "@/models/user";
import VerificationModel from "@/models/verification";
import WorkerModel from "@/models/worker";
import CustomerModel from "@/models/customer";
import AdminModel from "@/models/admin";

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

    if (!existingVerification) {
      return NextResponse.json<Response>(
        {
          success: false,
          message: "Verification code not found. Please request a new verification code.",
          statusCode: 400,
        },
        { status: 400 }
      );
    }

    if (existingVerification.verificationToken !== verificationCode) {
      return NextResponse.json<Response>(
        {
          success: false,
          message: "Invalid verification code",
          statusCode: 400,
        },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await UserModel.create({
      role: identifier,
      name: name,
      email: email,
      password: hashedPassword,
    });
    await newUser.save();

    // set DB according to the role
    if(identifier === "WORKER"){
      await WorkerModel.create({
        userId: newUser._id,
        isProfileCompleted: false,
      })
    } else if (identifier === "CUSTOMER"){
      await CustomerModel.create({
        userId: newUser._id,
      })
    } else if(identifier === "ADMIN") {
      await AdminModel.create({
        userId: newUser._id,
      })
    } else {
      return NextResponse.json<Response>(
        {
          success: false,
          message: "Invalid identifier",
          statusCode: 400,
        },
        { status: 400 }
      );
    }

    return NextResponse.json<Response>(
      {
        success: true,
        message: "User created successfully",
        statusCode: 201,
      },
      { status: 201 }
    );
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
