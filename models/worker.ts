import mongoose from "mongoose";
import {Worker, WorkerProfessions} from '@/types/worker'


const WorkerSchema = new mongoose.Schema<Worker>({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true, required: true },
    aadharNumber: { type: String, unique: true, sparse: true },
    isAadharVerified: { type: Boolean, default: false },
    longitude: {type: String, default: "0"},
    latitude: {type: String, default: "0"},
    currentBookingId: { type: mongoose.Schema.Types.ObjectId, ref: "Booking" },
    isActive: {type: Boolean, default: false},
    serviceCharge: {type: Number, default: 0},
    isProfileCompleted: {type: Boolean, default: false},
    profession: {type: String, enum: WorkerProfessions, default: WorkerProfessions.OTHER},
    otherProfession: String,
    proficienciyLevel: {type: String, enum: ["BEGINNER", "INTERMEDIATE", "EXPERT"]},
    workExperience: {type: String, default: "0 YEARS"},
    reviews: {type: Array, default: []},
    averageRating: {type: Number, default: 0.0},
    totalBookings: {type: Number, default: 0},
    totalEarnings: {type: Number, default: 0},
})

let WorkerModel: mongoose.Model<Worker>;
if (mongoose.models.Worker) {
  WorkerModel = mongoose.models.Worker as mongoose.Model<Worker>;
} else {
  WorkerModel = mongoose.model<Worker>("Worker", WorkerSchema);
}
export default WorkerModel;