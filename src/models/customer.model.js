import { Schema, model } from "mongoose";

const customerSchema = new Schema({
    phone: { type: String, required: true, unique: true, },
    email: { type: String, required: true, unique: true, },
    hashPassword: { type: String, required: true, min: 10, max: 100 },
    username: { type: String, unique: true },
    isActive: { type: Boolean, default: false },
    role: { type: String, enum: ['Customer'], default: 'Customer' },
})

export const Customer = model('customer', customerSchema);