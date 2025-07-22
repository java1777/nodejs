import express from 'express';
import config from './config/index.js';
import { connectDB } from './db/index.js';
import router from './routes/index.routes.js';

const app = express();
const PORT = config.PORT || 2000;

app.use(express.json());

await connectDB();

app.use('/api', router);

app.listen(PORT, () => console.log('Server running on port', PORT));