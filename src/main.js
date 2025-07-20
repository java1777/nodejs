import { config } from "dotenv";
import express from "express";
import { connectDb } from "./db/index.js";
import UserRouter from "./routes/user.route.js";
import VideoRouter from "./routes/video.route.js";
import CommentRouter from "./routes/comment.route.js";
import SubscriptionRouter from "./routes/subscription.route.js"
import { connect } from "mongoose";

config();
await connectDb();
const PORT = Number(process.env.PORT);
const app = express();

app.use(express.json())

app.use('/user', UserRouter)
app.use('/video', VideoRouter)
app.use('/comment', CommentRouter)
app.use('/subscription', SubscriptionRouter)

app.listen(PORT, () => console.log('server running on port', PORT))