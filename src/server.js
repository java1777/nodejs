import express from 'express'

import { connectDB } from './db/index.js'
import router from './routes/index.route.js'
import cookieParse from 'cookie-parser'
import { configServer } from './config/server.config.js'
await connectDB()

const server = express();
server.use(express.json())
server.use(cookieParse())
server.use('/api', router)

const PORT = configServer.PORT

server.listen(PORT, () => console.log('Server is running PORT:', PORT))