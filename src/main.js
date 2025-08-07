import express from "express";
import { application } from "./app.js";
import { configServer } from "./config/server.js";
import { log } from "winston";

const server = express();

const PORT = +configServer.PORT || 3007

await application(server)

server.listen(PORT, () => console.log('Server is running PORT:', PORT))