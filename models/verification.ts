import mongoose from "mongoose";
import {Verification} from '@/types/verification'

const VerificationSchema = new mongoose.Schema<Verification>({
    userId: {type: String, required: true},
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String },
    isVerificationTokenExpired: { type: Boolean, default: false },
    verificationTokenExpiresAt: { type: Date },
    resetPasswordToken: { type: String },
    isResetPasswordTokenExpired: { type: Boolean, default: false },
    resetPasswordTokenExpiresAt: { type: Date },
    isSuspended: { type: Boolean, default: false },
    suspendReason: { type: String },
    suspendStartDate: { type: Date },
    suspendEndDate: { type: Date },
    isPermanentlySuspended: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
})


const VerificationModel = mongoose.models.Verification as mongoose.Model<Verification> || mongoose.model<Verification>("Verification", VerificationSchema);
export default VerificationModel;