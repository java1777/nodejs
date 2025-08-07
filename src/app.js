import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import helmet from "helmet"
import {join} from "path"

import router from './routers/index.route.js'
import { connectDB } from './db/index.js'
import { globalErrorHandle } from './error/global-error-handle.js';

export const application = async(server) => {
    server.use(cors({origin: '*' }))
    server.use(helmet())
    server.use(express.json())
    server.use(cookieParser())
    server.use('/api/uploads', express.static(join(process.cwd(), '../uploads')))

    await connectDB()
    
    server.use('/api', router)

    server.use(globalErrorHandle)
}