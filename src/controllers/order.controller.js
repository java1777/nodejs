import Order from '../models/order.model.js';
import Book from '../models/book.model.js';

export class OrderController {
    async createOrder(req, res) {
        try {
            const book = await Book.findById(req.body.book_id);
            if (!book) {
                return res.status(400).json({
                    statusCode: 400,
                    message: 'invalid book id'
                });
            }
            const order = await Order.create({
                ...req.body,
                totalPrice: req.body.quantity * book.price
            });
            return res.status(201).json({
                statusCode: 201,
                message: 'success',
                data: order
            });
        } catch (error) {
            return res.status(500).json({
                statusCode: 500,
                message: error.message || 'Internal server error'
            });
        }
    }

    async getAllOrders(_, res) {
        try {
            const orders = await Order.find().populate({
                path: 'book_id',
                populate: {
                    path: 'author'
                }
            });
            return res.status(200).json({
                statusCode: 200,
                message: 'success',
                data: orders
            });
        } catch (error) {
            return res.status(500).json({
                statusCode: 500,
                message: error.message || 'Internal server error'
            });
        }
    }

    async getOrderById(req, res) {
        try {
            const order = await Order.findById(req.params.id);
            if (!order) {
                return res.status(404).json({
                    statusCode: 404,
                    message: "not found"
                });
            }
            return res.status(200).json({
                statusCode: 200,
                message: "success",
                data: Order
            });
        } catch (error) {
            return res.status(500).json({
                statusCode: 500,
                message: error.message || 'Internal server error'
            });
        }
    }

    async updateOrder(req, res) {
        try {
            const order = await Order.findById(req.params.id);
            if (!order) {
                return res.status(404).json({
                    statusCode: 404,
                    message: "not found"
                });
            }
            const updatedOrder = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
            return res.status(200).json({
                statusCode: 200,
                message: 'success',
                data: updatedOrder
            });
        } catch (error) {
            return res.status(500).json({
                statusCode: 500,
                message: error.message || 'Internal server error'
            });
        }
    }

    async deleteOrder(req, res) {
        try {
            const order = await Order.findById(req.params.id);
            if (!order) {
                return res.status(404).json({
                    statusCode: 404,
                    message: "not found"
                });
            }
            await Order.findByIdAndDelete(req.params.id);
            return res.status(200).json({
                statusCode: 200,
                message: 'success',
                data: {}
            });
        } catch (error) {
            return res.status(500).json({
                statusCode: 500,
                message: error.message || 'Internal server error'
            });
        }
    }
}