import { Schema, model } from "mongoose";

const adminSchema = new Schema({
    username: { type: String, required: true, unique: true, },
    email: { type: String, required: true, unique: true, },
    hashPassword: { type: String, required: true, min: 7, max: 77 },
    isActive: { type: Boolean, default: false },
    role: { type: String, enum: ['Admin', 'SUPERADMIN'], default: 'Admin' },
    phone: { type: String, unique: true, required: true }
}, { timestamps: true, versionKey: false })

export const Admin = model('Admin', adminSchema)