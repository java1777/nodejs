import express from 'express'

import { configServer } from './config/server.config.js'
import { connectDB } from './db/index.js'
import router from './routers/index.route.js'
import cookieParse from 'cookie-parser'
import { globalErrorHandle } from "./error/global-error-handle.js";
import cors from 'cors'
import helmet from 'helmet'
import { join } from 'path'

const server = express();

server.use(cors({ origin: '*' }))
server.use(helmet())
server.use(express.json())
server.use(cookieParse())
server.use('/api/uploads', express.static(join(process.cwd(), '../uploads')))

await connectDB()

server.use('/api', router)

server.use(globalErrorHandle)
const PORT = +configServer.PORT || 7777

server.listen(PORT, () => console.log('Server is running PORT:', PORT))