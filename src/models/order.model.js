import { model, Schema } from "mongoose";

const OrderSchema = new Schema({
    user_id: { type: Number },
    book_id: { type: Schema.Types.ObjectId, ref: 'Book' },
    quantity: { type: Number },
    totalPrice: { type: Number },
    data: { type: Date, default: new Date() }
}, { timestamps: true });

const Order = model('Order', OrderSchema);
export default Order;