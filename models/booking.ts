import mongoose from "mongoose";
import {Bookings} from '@/types/booking'

const BookingSchema = new mongoose.Schema<Bookings>({
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    workerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    bookingDate: { type: Date, required: true },
    bookingTime: { type: Date, required: true },
    bookingStatus: { type: String, enum: ["PENDING", "ACCEPTED", "REJECTED", "CANCELLED", "COMPLETED"], default: "PENDING" },
    cancelledBy: { type: String, enum: ["CUSTOMER", "WORKER"] },
    cancellationFee: { type: Number, default: 0 },
    workNeededDescription: { type: String, required: true },
    workNeededProfession: { type: String, required: true },
    customerLongitude: { type: String, required: true },
    customerLatitude: { type: String, required: true },
    workerLatitude: { type: String },
    workerLongitude: { type: String },
    workerOutForWork: { type: Boolean, default: false },
    isWorkCompleted: { type: Boolean, default: false },
    workerArrivedAtDestination: { type: Boolean, default: false },
    workerOTP: {type: String, default: ""},
    customerOTP: {type: String, default: ""},
})


const BookingModel = mongoose.models.Booking as mongoose.Model<Bookings> || mongoose.model<Bookings>("Booking", BookingSchema);
export default BookingModel;
