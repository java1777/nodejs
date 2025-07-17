import { model, Schema } from 'mongoose'

const AuthorSchema = new Schema({
    name: { type: String, required: true, },
    country: { type: String, },
    age: { type: Number, default: 17 }
}, { timestamps: true, versionKey: false })

export const Author = model('Author', AuthorSchema);