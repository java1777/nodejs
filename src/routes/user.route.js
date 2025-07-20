import { Router } from "express";
import { UserControlller } from "../controllers/users.controller.js";

const controller  =new UserControlller()
const router = Router()

router
    .post('/',controller.create)
    .get('/', controller.getAll)
    .get('/top', controller.topBloggersFollowers)
    .get('/:id', controller.getById)
    .patch('/:id', controller.update)
    .delete('/:id', controller.delete)

export default router;