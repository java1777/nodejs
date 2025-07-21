import { Router } from "express";
import { OrderController } from "../controllers/order.controller.js";

const router = Router();
const controller = new OrderController();

router
    .post('/', controller.createOrder)
    .get('/', controller.getAllOrders)
    .get('/:id', controller.getOrderById)
    .patch('/:id', controller.updateOrder)
    .delete('/:id', controller.deleteOrder)

export default router;