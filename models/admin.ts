import mongoose from "mongoose";
import {Admin} from '@/types/admin'

const AdminSchema = new mongoose.Schema<Admin>({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true, required: true },
    phone: String,
})

let AdminModel: mongoose.Model<Admin>;
if (mongoose.models.Admin) {
  AdminModel = mongoose.models.Admin as mongoose.Model<Admin>;
} else {
  AdminModel = mongoose.model<Admin>("Admin", AdminSchema);
}
export default AdminModel;