import { Schema, model } from "mongoose";

const UserSchema = new Schema(
    {
        name: { type: String, required: true, unique: true },
    },
    { timestamps: true, versionKey: false }
);

export default model("User", UserSchema);