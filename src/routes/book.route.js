import { Router } from "express";
import { BookController } from "../controllers/book.controller.js";

const router = Router();
const controller = new BookController();

router
    .post('/', controller.createBook)
    .get('/', controller.getAllBooks)
    .get('/genre',controller.getMaxSoldBooks)
    .get('/avg', controller.getBooksAvgPriceByGenre)
    .get('/:id', controller.getBookById)
    .patch('/:id', controller.updateBook)
    .delete('/:id', controller.deleteBook)

export default router;