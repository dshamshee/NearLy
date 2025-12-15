import mongoose from "mongoose";
import {Worker, WorkerProfessions} from '@/types/worker'


const WorkerSchema = new mongoose.Schema<Worker>({
    role: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, unique: true },
    aadharNumber: { type: String, unique: true },
    isAadharVerified: { type: Boolean, default: false },
    password: String,
    googleId: String,
    avatar: String,
    longitude: Number,
    latitude: Number,
    currentBookingId: { type: mongoose.Schema.Types.ObjectId, ref: "Booking" },
    isActive: {type: Boolean, default: false},
    isProfileCompleted: {type: Boolean, default: false},
    profession: {type: String, enum: WorkerProfessions},
    otherProfession: String,
    proficienciyLevel: {type: String, enum: ["BEGINNER", "INTERMEDIATE", "EXPERT"]},
    workExperience: String,
    reviews: Array,
    averageRating: {type: Number, default: 0.0},
    totalBookings: {type: Number, default: 0},
    totalEarnings: {type: Number, default: 0},
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
})


const WorkerModel = mongoose.models.Worker as mongoose.Model<Worker> || mongoose.model<Worker>("Worker", WorkerSchema);
export default WorkerModel;