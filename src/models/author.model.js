import { Schema, model } from "mongoose";

const AuthorSchema = new Schema({
    name: { type: String, required: true },
    country: { type: String },
    age: { type: Number }
}, { timestamps: true });

const Author = model('Author', AuthorSchema);
export default Author;