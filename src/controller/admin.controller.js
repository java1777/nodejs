import { BaseController } from './base.controller.js';
import { Admin } from '../models/admin.model.js';
import { configServer } from '../config/server.config.js';
import { successRes } from '../utils/success-res.js'
import { AppError } from '../error/AppError.js';

import token from '../utils/Token.js'
import Crypt from '../utils/Crypt.js'


class AdminController extends BaseController {
    constructor() {
        super(Admin)
    }
    createAdmin = async (req, res, next) => {
        try {
            const { username, email, password, isActive, phone } = req.body
            const existUsername = await Admin.findOne({ username })
            if (existUsername) {
                throw new AppError('Username already exists', 422);
            }
            const existEmail = await Admin.findOne({ email })
            if (existEmail) {
                throw new AppError('Email already exists', 422);
            }
            const hashPassword = await Crypt.encrypt(password);
            const resultAdmin = {
                username,
                email,
                hashPassword,
                isActive,
                phone
            }
            const data = await Admin.create(resultAdmin)
            successRes(res, data, 201)
        } catch (error) {
            next(error)
        }
    }

    signInAdmin = async (req, res, next) => {
        try {
            const { email, password } = req.body
            const admin = await Admin.findOne({ email })

            await Crypt.decrypt(password, admin.hashPassword)
            if (!admin) {
                throw new AppError('Email or password incorrect', 409)
            }

            const payload = {
                id: admin._id, role: admin.role, isActive: admin.isActive
            }

            const accessToken = await token.accessToken(payload)
            const refreshToken = await token.refreshToken(payload)

            await token.writeCookie(res, 'refreshTokenAdmin', refreshToken, 30);
            successRes(res, accessToken)
        } catch (error) {
            next(error)
        }
    }

    newToken = async (req, res, next) => {
        try {
            const refresh = req.cookies?.refreshTokenAdmin
            if (!refresh) {
                throw new AppError('Authorization error', 401)
            }
            const verifiedToken = await token.varifyToken(refresh, configServer.TOKEN.REFRESH_TOKEN_KEY);
            if (!verifiedToken) {
                throw new AppError('Refresh token expire', 401)
            }
            const admin = await Admin.findById(verifiedToken.id);
            if (!admin) {
                throw new AppError('Forbiden user', 403)
            }
            const payload = {
                id: admin.id, role: admin.role, isActive: admin.isActive
            }

            const accessToken = await token.accessToken(payload)
            successRes(res, accessToken)

        } catch (error) {
            next(error)
        }
    }
    signOut = async (req, res, next) => {
        try {
            const refresh = req.cookies?.refreshTokenAdmin;
            if (!refresh) {
                throw new AppError('Refresh token not found', 401);
            }
            const verifiedToken = await token.varifyToken(refresh, configServer.TOKEN.REFRESH_TOKEN_KEY);
            if (!verifiedToken) {
                throw new AppError('Refresh token expire', 401)
            }
            const admin = await Admin.findById(verifiedToken.id);
            if (!admin) {
                throw new AppError('Forbiden user', 403)
            }
            res.clearCookie('refreshTokenAdmin')
            successRes(res, {})
        } catch (error) {
            next(error)
        }
    }
}

export default new AdminController();