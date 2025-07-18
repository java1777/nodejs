import Book from '../models/book.model.js';

export class BookController {
    async createBook(req, res) {
        try {
            const book = await Book.create(req.body);
            return res.status(201).json({
                statusCode: 201,
                message: 'success',
                data: book,
            });
        } catch (error) {
            return res.status(500).json({
                statusCode: 500,
                message: error.message || 'Internal server error'
            });
        }
    }

    async getAllBooks(_, res) {
        try {
            const books = await Book.find();
            return res.status(200).json({
                statusCode: 200,
                message: 'success',
                data: books
            });
        } catch (error) {
            return res.status(500).json({
                statusCode: 500,
                message: error.message || 'Internal server error'
            });
        }
    }

    async getMaxSoldBooks(_, res) {
        try {
            const maxSoldBooks = await Book.aggregate([
                {
                    $group: {
                        _id: '$genre',
                        totalSold: { $sum: '$sold' }
                    }
                },
                { $sort: { totalSold: -1 } },
                { $limit: 10 }
            ]);
            return res.status(200).json({
                statusCode: 200,
                message: 'success',
                data: maxSoldBooks
            });
        } catch (error) {
            return res.status(500).json({
                statusCode: 500,
                message: error.message || 'Internal server error'
            });
        }
    }

    async getBooksAvgPriceByGenre(_, res) {
        try {
            const avgPriceByGenre = await Book.aggregate([
                {
                    $group: {
                        _id: "$genre",
                        avgPrice: { $avg: "$price" }
                    }
                },
                {
                    $sort: { avgPrice: -1 }
                }
            ]);
            return res.status(200).json({
                statusCode: 200,
                message: 'success',
                data: avgPriceByGenre
            });
        } catch (error) {
            return res.status(500).json({
                statusCode: 500,
                message: error.message || 'Internal server error'
            });
        }
    }

    async getBookById(req, res) {
        try {
            const book = await Book.findById(req.params.id);
            if (!book) {
                return res.status(404).json({
                    statusCode: 404,
                    message: "not found"
                });
            }
            return res.status(200).json({
                statusCode: 200,
                message: "success",
                data: book
            });
        } catch (error) {
            return res.status(500).json({
                statusCode: 500,
                message: error.message || 'Internal server error'
            });
        }
    }

    async updateBook(req, res) {
        try {
            const book = await Book.findById(req.params.id);
            if (!book) {
                return res.status(404).json({
                    statusCode: 404,
                    message: "not found"
                });
            }
            const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
            return res.status(200).json({
                statusCode: 200,
                message: 'success',
                data: updatedBook
            });
        } catch (error) {
            return res.status(500).json({
                statusCode: 500,
                message: error.message || 'Internal server error'
            });
        }
    }

    async deleteBook(req, res) {
        try {
            const book = await Book.findById(req.params.id);
            if (!book) {
                return res.status(404).json({
                    statusCode: 404,
                    message: "not found"
                });
            }
            await Book.findByIdAndDelete(req.params.id);
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