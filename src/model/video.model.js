import { Schema, model } from "mongoose";

const VideoSchema = new Schema(
    {
        title: { type: String, required: true },
        uploaderId: { type: Schema.Types.ObjectId, ref: "User" },
        category: { type: String, required: true },
        views: { type: Number, min: 0 },
        likes: { type: Number, min: 0 },
    },
    { timestamps: true, versionKey: false }
);

export default model("Video", VideoSchema);