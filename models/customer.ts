import mongoose from "mongoose";
import { Customer } from "@/types/customer";


const CustomerSchema = new mongoose.Schema<Customer>({
    role: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, unique: true },
    password: String,
    googleId: String,
    avatar: String,
    longitude: Number,
    latitude: Number,
    currentBookingId: { type: mongoose.Schema.Types.ObjectId, ref: "Booking" },
    walletBalance: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    
})



const CustomerModel = mongoose.models.Customer as mongoose.Model<Customer> || mongoose.model<Customer>("Customer", CustomerSchema);
export default CustomerModel;