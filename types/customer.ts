import mongoose from "mongoose";

export interface Customer {
    userId: mongoose.Types.ObjectId;
    phone: string;
    longitude?: number;
    latitude?: number;
    currentBookingId?: mongoose.Types.ObjectId;
    walletBalance?: number;
}

