import mongoose from "mongoose";
import {User} from '@/types/user'

const UserSchema = new mongoose.Schema<User>({
    role: {type: String, required: true},
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: String,
    googleId: String,
    avatar: String,
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now},
})

const UserModel = mongoose.models.User as mongoose.Model<User> || mongoose.model<User>("User", UserSchema);
export default UserModel;