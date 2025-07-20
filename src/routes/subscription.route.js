import { Router } from "express";
import { SubscriptionController } from "../controllers/subscription.controller.js";

const controller = new SubscriptionController()
const router = Router()

router
    .post('/', controller.create)
    .patch('/:id', controller.update)
    .delete('/:id', controller.delete)
    
export default router;