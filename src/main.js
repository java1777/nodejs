import express from 'express';
import { config } from 'dotenv';
import { join } from 'path'

import routerAuthor from './routers/author.route.js';
import routerBooks from './routers/books.route.js';
import routerOrders from './routers/orders.route.js'
import { connectDB } from './database/connect.databasa.js';
config()

await connectDB()
const app = express();
app.use(express.json());

app.use('/author', routerAuthor);
app.use('/books', routerBooks);
app.use('/orders', routerOrders);

app.use((_, res) => {
    res.status(404).sendFile(join(process.cwd(), 'public', 'image', '404error.png'));
})
const PORT = +process.env.PORT || 3000
app.listen(PORT, () => console.log('Server is runing PORT:', PORT))