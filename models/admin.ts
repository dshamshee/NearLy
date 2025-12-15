import mongoose from "mongoose";
import {Admin} from '@/types/admin'

const AdminSchema = new mongoose.Schema<Admin>({
    role: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, unique: true },
    password: String,
    googleId: String,
    avatar: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
})

const AdminModel = mongoose.models.Admin as mongoose.Model<Admin> || mongoose.model<Admin>("Admin", AdminSchema);
export default AdminModel;