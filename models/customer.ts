import mongoose from "mongoose";
import { Customer } from "@/types/customer";
import { Decimal128 } from "mongodb";


const CustomerSchema = new mongoose.Schema<Customer>({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true, required: true },
    longitude: {type: Decimal128, default: new Decimal128("0")},
    latitude: {type: Decimal128, default: new Decimal128("0")},
    currentBookingId: { type: mongoose.Schema.Types.ObjectId, ref: "Booking" },
    walletBalance: { type: Number, default: 0 },
})

let CustomerModel: mongoose.Model<Customer>;
if (mongoose.models.Customer) {
  CustomerModel = mongoose.models.Customer as mongoose.Model<Customer>;
} else {
  CustomerModel = mongoose.model<Customer>("Customer", CustomerSchema);
}
export default CustomerModel;