import Admin from '../models/admin.model.js';
import { BaseController } from './base.controller.js';
import crypto from '../utils/Crypto.js';

class AdminController extends BaseController {
    constructor() {
        super(Admin);
    }

    async createAdmin(req, res) {
        try {
            const { username, email, password } = req.body;
            const existsUsername = await Admin.findOne({ username });
            if (existsUsername) {
                return res.status(409).json({
                    statusCode: 409,
                    message: 'Username already exists'
                });
            }
            const existsEmail = await Admin.findOne({ email });
            if (existsEmail) {
                return res.status(409).json({
                    statusCode: 409,
                    message: 'Email address already exists'
                });
            }
            const hashedPassword = await crypto.encrypt(password);
            const admin = await Admin.create({
                username,
                email,
                hashedPassword
            });
            return res.status(201).json({
                statusCode: 201,
                message: 'success',
                data: admin
            });
        } catch (error) {
            return res.status(500).json({
                statusCode: 500,
                message: error.message || 'Internal server error'
            });
        }
    }

    async signIn(req, res) {
        try {
            const { username, password } = req.body;
            const admin = await Admin.findOne({ username });
            const isMatchPassword = await crypto.decrypt(password, admin?.hashedPassword ?? '');
            if (!isMatchPassword) {
                return res.status(400).json({
                    statusCode: 400,
                    message: 'Username or password incorrect'
                });
            }
            return res.status(200).json({
                statusCode: 200,
                message: 'success',
                data: admin
            });
        } catch (error) {
            return res.status(500).json({
                statusCode: 500,
                message: error.message || 'Internal server error'
            });
        }
    }
}

export default new AdminController();