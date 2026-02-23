import mongoose from "mongoose";
import { WorkerProfessions } from "./worker";

export interface Bookings {
    customerId: mongoose.Types.ObjectId;
    workerId: mongoose.Types.ObjectId;
    bookingDate: Date;
    bookingTime: Date;
    bookingStatus: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
    cancelledBy?: "CUSTOMER" | "WORKER";
    cancellationFee?: number;
    workNeededDescription?: string;
    workNeededProfession?: WorkerProfessions;
    customerLongitude?: string;
    customerLatitude?: string;
    workerLongitude?: string;
    workerLatitude?: string;
    workerOutForWork?: boolean;
    workerArrivedAtDestination?: boolean;
    isWorkCompleted?: boolean;
}