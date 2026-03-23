import mongoose from "mongoose";

export interface ActiveBookings {
  bookingId: string;
  customerSocketId: string;
  workerId: string;
  status: "pending" | "accepted" | "rejected" | "in-transit" | "completed" | "cancelled";
  requestedPaymentAmount?: number;
  createdAt: Date;
}

const ActiveBookingsSchema = new mongoose.Schema<ActiveBookings>({
  bookingId: { type: String, required: true },
  customerSocketId: { type: String, required: true },
  workerId: { type: String, required: true },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected", "in-transit", "completed", "cancelled"],
    default: "pending",
  },
  requestedPaymentAmount: { type: Number },
  createdAt: { type: Date, default: Date.now },
});

const ActiveBookingsModel =
  (mongoose.models.ActiveBookings as mongoose.Model<ActiveBookings>) ||
  mongoose.model<ActiveBookings>("ActiveBookings", ActiveBookingsSchema);

export default ActiveBookingsModel;
