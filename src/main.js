import express from "express";
import { connectDB } from './db/index.js';
import { config } from "dotenv";
config();
import authorRouter from './routes/author.route.js';
import bookRouter from './routes/book.route.js';
import orderRouter from './routes/order.route.js';

const PORT = +process.env.PORT;
const app = express();

app.use(express.json());

await connectDB();

app.use('/author', authorRouter);
app.use('/book', bookRouter);
app.use('/order', orderRouter);

app.listen(PORT, () => console.log('server running on port', PORT));