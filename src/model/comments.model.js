import { model, Schema } from "mongoose";

const CommentSchema = new Schema(
    {
        videoId: { type: Schema.Types.ObjectId, ref: "User" },
        userId: { type: Schema.ObjectId, ref: "User" },
        text: { type: String, required: true },
        likes: { type: String },
    },
    { timestamps: true, versionKey: false }
);

export default model("Comment", CommentSchema);