import mongoose from "mongoose";
import { Decimal128 } from "mongodb";

export interface Customer {
    userId: mongoose.Types.ObjectId;
    // phone: string;
    longitude?: Decimal128;
    latitude?: Decimal128;
    currentBookingId?: mongoose.Types.ObjectId;
    walletBalance?: number;
}

