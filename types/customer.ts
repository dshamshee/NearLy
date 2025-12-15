import mongoose from "mongoose";

export interface Customer {
    role: "CUSTOMER";
    name: string;
    email: string;
    phone: string;
    password?: string;
    googleId?: string;
    avatar?: string;
    longitude?: number;
    latitude?: number;
    currentBookingId?: mongoose.Types.ObjectId;
    walletBalance?: number;
    createdAt?: Date;
    updatedAt?: Date;
}

