import { Schema, model } from "mongoose";

const customerSchema = new Schema({
    username: { type: String, unique: true, },
    phone: { type: String, required: true, unique: true, minlength: 10, maxlength: 13 },
    email: { type: String, required: true, unique: true, },
    hashPassword: { type: String, required: true, min: 7, max: 77 },
    isActive: { type: Boolean, default: false },
    role: { type: String, enum: ['Customer'], default: 'Customer' },
})

export const Customer = model('customer', customerSchema);