import { Router } from "express";
import { VideoController } from "../controllers/video.controller.js";

const controller  =new VideoController()
const router = Router()

router
    .post('/',controller.create)
    .get('/', controller.getAll)
    .get('/avg', controller.avgComment)
    .get('/category', controller.popularCategory)
    .get('/:id', controller.getAll)
    .patch('/:id', controller.update)
    .delete('/:id', controller.delete)

export default router;