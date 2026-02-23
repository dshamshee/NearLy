import mongoose from "mongoose";

export interface Customer {
    userId: mongoose.Types.ObjectId;
    // phone: string;
    longitude?: string;
    latitude?: string;
    currentBookingId?: mongoose.Types.ObjectId;
    walletBalance?: number;
}

