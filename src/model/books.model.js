import { model, Schema } from 'mongoose'

const BooksSchema = new Schema({
    title: { type: String, required: true, unique: true },
    authorID: { type: Schema.Types.ObjectId, ref: 'Author', required: true },
    genre: { type: String, },
    price: { type: Number,  default: 1 },
    sold: { type: Number, default: 0 },
    stock: { type: Number, default: 0 },
}, { timestamps: true, versionKey: false })

export const Books = model('Books', BooksSchema);