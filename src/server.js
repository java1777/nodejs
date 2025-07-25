import express from 'express'

import { configServer } from './config/index.js'
import { connectDB } from './db/index.js'
import router from './routes/index.route.js'
import cookieParse from 'cookie-parser'

await connectDB()
const server = express();
server.use(express.json())
server.use(cookieParse())
server.use('/api', router)

const PORT = +configServer.PORT || 2000

server.listen(PORT, () => console.log('Server is running PORT:', PORT))