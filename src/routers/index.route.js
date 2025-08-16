import { Router } from "express";

import Admin from './admin.route.js'
import Customer from './customer.route.js'
import Saller from './saller.route.js'


const router = Router()

router.use('/admin', Admin)
router.use('/customer', Customer)
router.use('/saller', Saller)


export default router