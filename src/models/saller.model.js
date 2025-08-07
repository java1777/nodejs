import { Schema, model } from "mongoose";
import { Roles } from "../const/Role.js";


const sallerSchema = new Schema({           // Schema yaratish
    phoneNumber: { type: String, unique: true, required: true },
    fullName: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    hashedPassword: { type: String, required: true },
    isActive: { type: Boolean, default: false },
    wallet: { type: Number, default: 0 },
    image: { type: String },
    address: { type: String },
    role: { type: String, enum: [Roles.SALLER], default: Roles.SALLER },
}, {
    timestamps: true, virtuals: false, virtuals: true,      // Schema sozlamalari
    toObject: { virtuals: true }, toJSON: { virtuals: true }
});

// Virtual maydon
sallerSchema.virtual('Products', {      // Haqiqiy maydon emas, faqat bog'lanish 
    ref: 'Product',                     // Product madeliga havola
    localField: "_id",                  // Ushbu modelga maydon
    foreignField: 'sallerID'            // Product modelidagi maydon
})

// Model eksporti
export const Saller = model('Saller', sallerSchema);