import mongoose from "mongoose";
import { Decimal128 } from "mongodb";
import { WorkerProfessions } from "./worker";

export interface Bookings {
    customerId: mongoose.Types.ObjectId;
    workerId: mongoose.Types.ObjectId;
    bookingDate: Date;
    bookingTime: Date;
    bookingStatus: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
    cancelledBy: "CUSTOMER" | "WORKER";
    cancellationFee: number;
    workNeededDescription: string;
    workNeededProfession: WorkerProfessions;
    customerLongitude: Decimal128;
    customerLatitude: Decimal128;
    workerLongitude: Decimal128;
    workerLatitude: Decimal128;
    workerOutForWork: boolean;
    workerArrivedAtDestination: boolean;
    isWorkCompleted: boolean;
}