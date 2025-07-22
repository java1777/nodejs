import { Schema, model } from "mongoose";

const AdminSchema = new Schema({
    username: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    hashedPassword: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    role: { type: String, enum: ['SUPERADMIN', 'ADMIN'], default: 'ADMIN' }
}, { timestamps: true, versionKey: false });

const Admin =  model('Admin', AdminSchema);
export default Admin;