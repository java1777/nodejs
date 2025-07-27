import { Routes } from "express";
import adminRoutes from './admin.route.js';
import customerRoutes from './customer.route.js';
import {pageError} from '../error/page-not-found.js'
import routes from "./admin.route.js";
const routes = Routes();

routes.use('/admin', adminRoutes);
routes.use('/customer', customerRoutes);

routes.use(pageError)
export default routes