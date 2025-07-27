import express from 'express'

import { configServer } from './config/server.config.js'
import { connectDB } from './db/server.js'
import routes from './routes/index.route.js'
import cookieParse from 'cookie-parser'
import { globalErrorHandle } from "./error/global-error-handle.js";
import routes from './routes/admin.route.js'


await connectDB()
const server = express();
server.use(express.json())
server.use(cookieParse())

server.use('/api', routes)

server.use(globalErrorHandle)

const PORT = +configServer.PORT || 3000

server.listen(PORT, () => console.log('Server is running PORT:', PORT))