import { Schema, model } from "mongoose";

const BookSchema = new Schema({
    title: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'Author' },
    genre: { type: String },
    price: { type: Number },
    sold: { type: Number },
    stock: { type: Number }
}, { timestamps: true });

const Book = model('Book', BookSchema);
export default Book;