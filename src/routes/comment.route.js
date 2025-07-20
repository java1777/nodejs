import { Router } from "express";
import { CommentController } from "../controllers/comments.controller.js";

const controller  =new CommentController()
const router = Router()

router
    .post('/',controller.create)
    .get('/', controller.getAll)
    .get('/:id', controller.getById)
    .patch('/:id', controller.update)
    .delete('/:id', controller.delete)

export default router;