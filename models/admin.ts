import mongoose from "mongoose";
import {Admin} from '@/types/admin'

const AdminSchema = new mongoose.Schema<Admin>({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true, required: true },
    phone: String,
})

const AdminModel = mongoose.models.Admin as mongoose.Model<Admin> || mongoose.model<Admin>("Admin", AdminSchema);
export default AdminModel;