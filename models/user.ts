import mongoose from "mongoose";
import {User} from '@/types/user'

const UserSchema = new mongoose.Schema<User>({
    role: {type: String, required: true},
    name: {type: String, required: true},
    phone: { type: String, unique: true, sparse: true },
    email: {type: String, required: true, unique: true},
    password: String,
    googleId: String,
    avatar: String,
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now},
})

let UserModel: mongoose.Model<User>;
if (mongoose.models.User) {
  UserModel = mongoose.models.User as mongoose.Model<User>;
} else {
  UserModel = mongoose.model<User>("User", UserSchema);
}
export default UserModel;