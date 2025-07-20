import Video from "../model/video.model.js"
import mongoose from "mongoose"

export class VideoController {
    async create(req, res) {
        try {
            const newVideo = await Video.create(req.body)
            return res.status(201).json({
                statusCode: 201,
                message: "success",
                data: newVideo
            })
        } catch (error) {
            return res.status(500).json({
                statusCode: 500,
                message: error.message || "Internal server error",
            })
        }
    }

    async getAll(req, res) {
        try {
            const videos = await Video.aggregate([
                {
                    $lookup: {
                        from: "users",
                        localField: "uploaderId",
                        foreignField: "_id",
                        as: "userInfo",
                    },
                },
                {
                    $lookup: {
                        from: "comments",
                        localField: "_id",
                        foreignField: "videoId",
                        as: "commentInfo",
                    },
                },

                {
                    $project: {
                        _id: 1,
                        title: 1,
                        category: 1,
                        views: 1,
                        likes: 1,
                        comment: "$commentInfo",
                    },
                },
            ]);
            return res.status(200).json({
                statusCode: 200,
                message: "Success",
                data: videos,
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

            const video = await Video.aggregate([
                {
                    $lookup: {
                        from: "users",
                        localField: "uploaderId",
                        foreignField: "_id",
                        as: "userInfo",
                    },
                },
                {
                    $lookup: {
                        from: "comments",
                        localField: "_id",
                        foreignField: "videoId",
                        as: "commentInfo",
                    },
                },
                {
                    $match: { _id: id }
                },
                {
                    $project: {
                        _id: 1,
                        title: 1,
                        category: 1,
                        views: 1,
                        likes: 1,
                        comment: "$commentInfo",
                    },
                },
            ]);
            if (video.length === 0) {
                return res.status(404).json({
                    statusCode: 404,
                    message: "Video not found",
                });
            }
            return res.status(200).json({
                statusCode: 200,
                message: "Success",
                data: video[0],
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

            const updatingVideo = await Video.findByIdAndUpdate(id, req.body, {
                new: true,
            });
            if (!updatingVideo) {
                return res.status(404).json({
                    statusCode: 404,
                    message: "Video not found",
                });
            }

            return res.status(200).json({
                statusCode: 200,
                message: "Success",
                data: updatingVideo,
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

            const deletedVideo = await Video.findByIdAndDelete(id);
            if (!deletedVideo) {
                return res.status(404).json({
                    statusCode: 404,
                    message: "Video not found",
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

    async avgComment(req, res) {
        try {
            const result = await Video.aggregate([
                {
                    $lookup: {
                        from: "comments",
                        localField: "_id",
                        foreignField: "videoId",
                        as: "commentInfo"
                    }
                },
                {
                    $project: {
                        commentCount: { $size: "$commentInfo" },
                        likes: { $ifNull: ["$likes", 0] }
                    }
                },

                {
                    $group: {
                        _id: "$_id",
                        avgCommentCount: { $avg: "$commentCount" },
                        avgLikes: { $avg: "$likes" }
                    }
                }
            ]);
            return res.status(200).json({
                statusCode: 200,
                message: "success",
                data: result
            })

        } catch (error) {
            return res.status(500).json({
                statusCode: 500,
                message: "interval serever error",
            });
        }
    }

    async popularCategory(req, res) {
    try {
      const category = await Video.aggregate([
        {
          $group: {
            _id: "$category",
            videoCount: { $sum: 1 },
            totalViews: { $sum: "$views" },
          },
        },

        {
          $project: {
            _id: 0,
            category: "$_id",
            videoCount: 1,
            totalViews: 1,
          },
        },

        { $sort: { totalViews: -1 } },
        { $limit: 5 },
      ]);
      return res.status(200).json({
        statusCode:200,
        message:"success",
        data:category
      })
    } catch (error) {
      return res.status(500).json({
        statusCode: 500,
        message: error.message || "Internal server error",
      });
    }
  }

}