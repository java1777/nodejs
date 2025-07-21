import { isValidObjectId } from 'mongoose';
import Author from '../models/author.model.js';
import { AuthorValidator } from '../validation/author.vaidation.js';

const validator = new AuthorValidator();

export class AuthorController {
    async createAuthor(req, res) {
        try {
            const { error, value } = validator.createAuthorValidator(req.body);
            if (error) {
                return res.status(422).json({
                    statusCode: 422,
                    message: error.details[0]?.message
                });
            }
            const author = await Author.create(value);
            return res.status(201).json({
                statusCode: 201,
                message: 'success',
                data: author
            });
        } catch (error) {
            return res.status(500).json({
                statusCode: 500,
                message: error.message || 'Internal server error'
            });
        }
    }

    async getAllAuthors(_, res) {
        try {
            const authors = await Author.find();
            return res.status(200).json({
                statusCode: 200,
                message: 'success',
                data: authors
            });
        } catch (error) {
            return res.status(500).json({
                statusCode: 500,
                message: error.message || 'Internal server error'
            });
        }
    }

    async getBooksOfAuthors(_, res) {
        try {
            const booksOfAuthors = await Author.aggregate([
                {
                    $lookup: {
                        from: 'books',
                        localField: '_id',
                        foreignField: 'author',
                        as: 'booksOfAuthors'
                    }
                },
                {
                    $project: {
                        _id: '$name',
                        totalBooks: { $size: '$booksOfAuthors' }
                    }
                }
            ]);
            return res.status(200).json({
                statusCode: 200,
                message: 'success',
                data: booksOfAuthors
            });
        } catch (error) {
            return res.status(500).json({
                statusCode: 500,
                message: error.message || 'Internal server error'
            });
        }
    }

    async getPopularAuthors(_, res) {
        try {
            const popularAuthors = await Author.aggregate([
                {
                    $lookup: {
                        from: 'books',
                        localField: '_id',
                        foreignField: 'author',
                        as: 'books'
                    },
                },
                {
                    $unwind: '$books'
                },
                {
                    $lookup: {
                        from: 'orders',
                        localField: 'books._id',
                        foreignField: 'book_id',
                        as: 'orders'
                    }
                },
                {
                    $unwind: '$orders'
                },
                {
                    $group: {
                        _id: '$name',
                        income: { $sum: '$orders.totalPrice' }
                    }
                },
                {
                    $sort: { income: -1 }
                }
            ]);
            return res.status(200).json({
                statusCode: 200,
                message: 'success',
                data: popularAuthors
            });
        } catch (error) {
            return res.status(500).json({
                statusCode: 500,
                message: error.message || 'Internal server error'
            });
        }
    }

    async getAuthorById(req, res) {
        try {
            const author = await AuthorController.findAuthorById(req.params?.id, res);
            return res.status(200).json({
                statusCode: 200,
                message: "success",
                data: author
            });
        } catch (error) {
            return res.status(500).json({
                statusCode: 500,
                message: error.message || 'Internal server error'
            });
        }
    }

    async updateAuthor(req, res) {
        try {
            const id = req.params?.id;
            await AuthorController.findAuthorById(id, res);
            const { error, value } = validator.updateAuthorValidator(req.body);
            if (error) {
                return res.status(422).json({
                    statusCode: 422,
                    message: error.details[0]?.message
                });
            }
            const updatedAuthor = await Author.findByIdAndUpdate(id, value, { new: true });
            return res.status(200).json({
                statusCode: 200,
                message: 'success',
                data: updatedAuthor
            });
        } catch (error) {
            return res.status(500).json({
                statusCode: 500,
                message: error.message || 'Internal server error'
            });
        }
    }

    async deleteAuthor(req, res) {
        try {
            const id = req.params?.id;
            await AuthorController.findAuthorById(id, res);
            const author = await Author.findByIdAndDelete(id);
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

    static async findAuthorById(id, res) {
        try {
            if (!isValidObjectId(id)) {
                return res.status(400).json({
                    statusCode: 400,
                    message: 'Invalid Object id'
                })
            }
            const author = await Author.findById(id);
            if (!author) {
                return res.status(404).json({
                    statusCode: 404,
                    message: "Author not found"
                });
            }
            return author;
        } catch (error) {
            return res.status(500).json({
                statusCode: 500,
                message: error.message || 'Internal server error'
            });
        }
    }
}