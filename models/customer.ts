import mongoose from "mongoose";
import { Customer } from "@/types/customer";


const CustomerSchema = new mongoose.Schema<Customer>({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true, required: true },
    phone: { type: String, unique: true },
    longitude: Number,
    latitude: Number,
    currentBookingId: { type: mongoose.Schema.Types.ObjectId, ref: "Booking" },
    walletBalance: { type: Number, default: 0 },
})



const CustomerModel = mongoose.models.Customer as mongoose.Model<Customer> || mongoose.model<Customer>("Customer", CustomerSchema);
export default CustomerModel;