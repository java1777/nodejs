import mongoose from "mongoose";
import Comment from "../model/comments.model.js"
import { text } from "express";

export class CommentController {
    async create(req, res) {
        try {
            const newComment = await Comment.create(req.body)
            return res.status(201).json({
                statusCode: 201,
                message: 'success',
                data: newComment
            })
        } catch (error) {
            return res.status(500).json({
                statusCode: 500,
                message: error.message ||'Internal server error'
            });
        }
    }

    async getAll(req, res) {
        try {
            const comments = await Comment.aggregate([
                {
                    $lookup: {
                        from: 'users',
                        localField: 'userId',
                        foreignField: '_id',
                        as: 'userInfo',
                    },
                },
                {
                    $lookup: {
                        from: 'videos',
                        localField: 'videoId',
                        foreignField: '_id',
                        as: 'videoInfo',
                    },
                },

                {
                    $project: {
                        _id: 1,
                        text: 1,
                        likes: 1,
                        vodeo: '$videoInfo',
                        user: '$userInfo'
                    },
                },
            ]);
            return res.status(200).json({
                statusCode: 200,
                message: 'success',
                data: comments,
            });
        } catch (error) {
            return res.status(500).json({
                statusCode: 500,
                message: 'Interval error server',
            });
        }
    }

    async getById(req, res) {
        try {
            if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
                return res.status(400).json({
                    statusCode: 400,
                    message: "invalid object id",
                });
            }
            const id = new mongoose.Types.ObjectId(req.params.id);

            const comment = await Comment.aggregate([
                 {
                    $lookup: {
                        from: "users",
                        localField: "userId",
                        foreignField: "_id",
                        as: "userInfo",
                    },
                },
                {
                    $lookup: {
                        from: "videos",
                        localField: "videId",
                        foreignField: "_id",
                        as: "videoInfo",
                    },
                },

                {
                    $match:{_id:id}
                },

                {
                    $project: {
                        _id: 1,
                        text: 1,
                        likes: 1,
                        vide: "$videoInfo",
                        user:"$userInfo"
                    },
                },
            ]);
            if (comment.length === 0) {
                return res.status(404).json({
                    statusCode: 404,
                    message: "Comment not found",
                });
            }
            return res.status(200).json({
                statusCode: 200,
                message: "Success",
                data: comment[0],
            });
        } catch (error) {
            return res.status(500).json({
                statusCode: 500,
                message: "interval server error",
            });
        }
    }
    async update(req, res) {
        try {
            const id = req.params.id;
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({
                    statusCode: 400,
                    message: "invalid object id",
                });
            }

            const updatingComment = await Comment.findByIdAndUpdate(id, req.body, {
                new: true,
            });
            if (!updatingComment) {
                return res.status(404).json({
                    statusCode: 404,
                    message: "Comment not found",
                });
            }

            return res.status(200).json({
                statusCode: 200,
                message: "Success",
                data: updatingComment,
            });
        } catch (error) {
            return res.status(500).json({
                statusCode: 500,
                message: error.message || "interval server error",
            });
        }
    }

    async delete(req, res) {
        try {
            const id = req.params.id;
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({
                    statusCode: 400,
                    message: "invalid object id",
                });
            }

            const deletedComment = await Comment.findByIdAndDelete(id);
            if (!deletedComment) {
                return res.status(404).json({
                    statusCode: 404,
                    message: "Comment not found",
                });
            }

            return res.status(200).json({
                statusCode: 200,
                message: "Success",
                data: {},
            });
        } catch (error) {
            return res.status(500).json({
                statusCode: 500,
                message: "interval serever error",
            });
        }
    }
}
 