import mongoose from "mongoose";
import {Bookings} from '@/types/booking'

const BookingSchema = new mongoose.Schema<Bookings>({
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
    workerId: { type: mongoose.Schema.Types.ObjectId, ref: "Worker", required: true },
    bookingDate: { type: Date, default: Date.now },
    bookingTime: { type: Date, required: true },
    bookingStatus: { type: String, default: "PENDING" },
    cancelledBy: { type: String },
    cancellationFee: { type: Number, default: 0 },
    workNeededDescription: { type: String, required: true },
    workNeededProfession: { type: String, required: true },
    customerLongitude: { type: Number, required: true },
    customerLatitude: { type: Number, required: true },
    workerLatitude: { type: Number, required: true },
    workerLongitude: { type: Number, required: true },
    workerOutForWork: { type: Boolean, default: false },
    isWorkCompleted: { type: Boolean, default: false },
    workerArrivedAtDestination: { type: Boolean, default: false },
})


const BookingModel = mongoose.models.Booking as mongoose.Model<Bookings> || mongoose.model<Bookings>("Booking", BookingSchema);
export default BookingModel;
