import { Router } from "express";
import { AuthorController } from "../controllers/author.controller.js";

const router = Router();
const controller = new AuthorController();

router
    .post('/', controller.createAuthor)
    .get('/', controller.getAllAuthors)
    .get('/books', controller.getBooksOfAuthors)
    .get('/popular', controller.getPopularAuthors)
    .get('/:id', controller.getAuthorById)
    .patch('/:id', controller.updateAuthor)
    .delete('/:id', controller.deleteAuthor)

export default router;