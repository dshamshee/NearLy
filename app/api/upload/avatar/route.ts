import { v2 as cloudinary } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";
import { GetServerSessionHere } from "@/app/api/auth/[...nextauth]/options";
import UserModel from "@/models/user";
import dbConnect from "@/utils/dbConnection";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
    try {
        const session = await GetServerSessionHere();
        if (!session?.user?._id) {
            return NextResponse.json(
                { success: false, message: "Unauthorized", statusCode: 401 },
                { status: 401 }
            );
        }

        const formData = await request.formData();
        const file = formData.get("file") as File | null;

        if (!file) {
            return NextResponse.json(
                { success: false, message: "No file provided", statusCode: 400 },
                { status: 400 }
            );
        }

        if (!ALLOWED_TYPES.includes(file.type)) {
            return NextResponse.json(
                { success: false, message: "Invalid file type. Use JPEG, PNG, WebP or GIF.", statusCode: 400 },
                { status: 400 }
            );
        }

        if (file.size > MAX_SIZE) {
            return NextResponse.json(
                { success: false, message: "File too large. Max 5MB.", statusCode: 400 },
                { status: 400 }
            );
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64 = buffer.toString("base64");
        const dataUri = `data:${file.type};base64,${base64}`;

        const result = await cloudinary.uploader.upload(dataUri, {
            folder: "nearly/avatars",
            resource_type: "image",
            transformation: [{ width: 400, height: 400, crop: "fill", gravity: "face" }],
        });

        const avatarUrl = result.secure_url;

        await dbConnect();
        await UserModel.findByIdAndUpdate(session.user._id, {
            avatar: avatarUrl,
            updatedAt: new Date(),
        });

        return NextResponse.json({
            success: true,
            message: "Avatar updated successfully",
            avatar: avatarUrl,
            statusCode: 200,
        });
    } catch (error) {
        console.error("Avatar upload error:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Internal Server Error",
                error: error instanceof Error ? error.message : "Internal Server Error on avatar upload route",
                statusCode: 500,
            },
            { status: 500 }
        );
    }
}
