import mongoose from "mongoose";
import User from "../model/user.model.js";

export class UserControlller {
    async create(req, res) {
        try {
            const newUser = await User.create(req.body);
            return res.status(201).json({
                statusCode: 201,
                message: "success",
                data: newUser,
            });
        } catch (error) {
            return res.status(500).json({
                statusCode: 500,
                message: "interval server error",
            });
        }
    }

    async getAll(req, res) {
        try {
            const users = await User.aggregate([
                {
                    $lookup: {
                        from: "videos",
                        localField: "_id",
                        foreignField: "uploaderId",
                        as: "videoInfo",
                    },
                },
                {
                    $lookup: {
                        from: "comments",
                        localField: "_id",
                        foreignField: "userId",
                        as: "commentInfo",
                    },
                },
                {
                    $lookup: {
                        from: "subscriptions",
                        localField: "_id",
                        foreignField: "followerId",
                        as: "subscriptionInfo",
                    },
                },
                {
                    $project: {
                        _id: 1,
                        name: 1,
                        comment: "$commentInfo",
                        subscription: "$subscriptionInfo",
                    },
                },
            ]);
            return res.status(200).json({
                statusCode: 200,
                message: "Success",
                data: users,
            });
        } catch (error) {
            return res.status(500).json({
                statusCode: 500,
                message: "interval server error",
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

            const user = await User.aggregate([
                {
                    $lookup: {
                        from: "videos",
                        localField: "_id",
                        foreignField: "uploaderId",
                        as: "videoInfo",
                    },
                },
                {
                    $lookup: {
                        from: "comments",
                        localField: "_id",
                        foreignField: "userId",
                        as: "commentInfo",
                    },
                },
                {
                    $lookup: {
                        from: "subscriptions",
                        localField: "_id",
                        foreignField: "followerId",
                        as: "subscriptionInfo",
                    },
                },
                { $match: { _id: id } },
                {
                    $project: {
                        _id: 1,
                        name: 1,
                        comment: "$commentInfo",
                        subscription: "$subscriptionInfo",
                    },
                },
            ]);
            if (user.length === 0) {
                return res.status(404).json({
                    statusCode: 404,
                    message: "user not found",
                });
            }
            return res.status(200).json({
                statusCode: 200,
                message: "Success",
                data: user[0],
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

            const updatingUser = await User.findByIdAndUpdate(id, req.body, {
                new: true,
            });
            if (!updatingUser) {
                return res.status(404).json({
                    statusCode: 404,
                    message: "user not found",
                });
            }

            return res.status(200).json({
                statusCode: 200,
                message: "Success",
                data: updatingUser,
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

            const deletedUser = await User.findByIdAndDelete(id);
            if (!deletedUser) {
                return res.status(404).json({
                    statusCode: 404,
                    message: "user not found",
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

    async topBloggersFollowers(req, res) {
        try {
            const blogger = await User.aggregate([
                {
                    $lookup: {
                        from: "subscriptions",
                        localField: "_id",
                        foreignField: "followerId",
                        as: "followers",
                    },
                },

                {
                    $addFields: {
                        followersCount: { $size: "$followers" },
                    },
                },

                { $sort: { followersCount: -1 } },
                { $limit: 5 },

                {
                    $project: {
                        name: 1,
                        followersCount: 1,
                    },
                },
            ]);

            return res.status(200).json({
                statusCode: 200,
                message: "success",
                data: blogger
            })
        } catch (error) {
            return res.status(500).json({
                statusCode: 500,
                message: error || "Internal server error",
            });
        }
    }

}