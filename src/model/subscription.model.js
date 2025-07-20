import { Schema, model } from "mongoose";

const SubscriptionSchema = new Schema(
    {
        followerId: { type: Schema.Types.ObjectId, ref: "User" },
        followeeId: { type: Schema.Types.ObjectId, ref: "User" },
    },
    { timestamps: true, versionKey: false }
);

export default model("Subscription", SubscriptionSchema);