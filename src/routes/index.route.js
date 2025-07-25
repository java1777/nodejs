import { Router } from "express";
import adminRouter from './admin.route.js';

const router = Router();

router
    .use('/admin', adminRouter)

export default router;