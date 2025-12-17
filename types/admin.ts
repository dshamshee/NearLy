import mongoose from "mongoose";

export interface Admin {
    userId: mongoose.Types.ObjectId;
    phone?: string;
}