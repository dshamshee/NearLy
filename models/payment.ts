import mongoose from "mongoose";
import {Payment} from '@/types/payment'


const PaymentSchema = new mongoose.Schema<Payment>({
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", required: true },
    paymentId: { type: String, required: true },
    orderId: { type: String, required: true },
    amount: { type: Number, required: true },
    method: { type: String, required: true },
    status: { type: String, default: "PENDING" },
    currency: { type: String, default: "INR" },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
})

const PaymentModel = mongoose.models.Payment as mongoose.Model<Payment> || mongoose.model<Payment>("Payment", PaymentSchema);
export default PaymentModel;