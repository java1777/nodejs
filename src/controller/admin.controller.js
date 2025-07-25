import { BaseController } from './base.controller.js';
import { Admin } from '../models/admin.model.js';
import { configServer } from '../config/server.config.js';

import token from '../utils/Token.js'
import Crypt from '../utils/Crypto.js'
import validat from '../validation/admin.validat.js'


class AdminController extends BaseController {
    constructor() {
        super(Admin)
    }
    createAdmin = async (req, res) => {
        try {
            const { error } = await validat.create(req.body)
            if (error) {
                return res.status(422).json({
                    statusCode: 422,
                    message: `Error validate ${error.details[0]?.message}` ?? 'Error input Validate'
                })
            }
            const { username, email, password, isActive, phone } = req.body
            const existUsername = await Admin.findOne({ username })
            const existEmail = await Admin.findOne({ email })
            if (existUsername || existEmail) {
                return res.status(422).json({
                    statusCode: 422,
                    message: 'Username already exists'
                })
            }
            const hashPassword = await Crypt.encrypt(password);
            const resultAdmin = {
                username,
                email,
                hashPassword,
                isActive,
                phone
            }
            await Admin.create(resultAdmin)
            return res.status(201).json({
                statusCode: 201,
                message: 'success',
                data: resultAdmin
            })

        } catch (error) {
            return res.status(500).json({
                statusCode: 500,
                message: error.message || 'Invalid server error'
            })
        }
    }

    signInAdmin = async (req, res) => {
        try {
            const { error } = validat.signIn(req.body);
            if (error) {
                return res.status(422).json({
                    statusCode: 422,
                    message: error.details[0]?.message ?? 'Error input Validate'
                })
            }

            const { email, password } = req.body
            const admin = await Admin.findOne({ email })
            if (!admin) {
                return res.status(409).json({
                    statusCode: 409,
                    message: 'Email or password incorrect'
                })
            }

            const decodePassword = await Crypt.decrypt(password, admin.hashPassword)
            if (!decodePassword) {
                return res.status(409).json({
                    statusCode: 409,
                    message: 'Email or password incorrect'
                })
            }

            const payload = {
                id: admin._id, role: admin.role, isActive: admin.isActive
            }

            const accessToken = await token.accessToken(payload)
            const refreshToken = await token.refreshToken(payload)

            await token.writeCookie(res, 'refreshTokenAdmin', refreshToken, 30);

            return res.status(200).json({
                statusCode: 200,
                message: 'success',
                data: {
                    token: accessToken,
                    admin
                }
            })
        } catch (error) {
            return res.status(500).json({
                statusCode: 500,
                message: error.message || 'Invalid server error'
            })
        }
    }

    newToken = async (req, res) => {
        try {
            const refresh = req.cookies?.refreshTokenAdmin
            if (!refresh) {
                return res.status(401).json({
                    statusCode: 401,
                    message: 'Refresh token expire'
                })
            }
            const verifiedToken = await token.varifyToken(refresh, configServer.TOKEN.REFRESH_TOKEN_KEY);
            if (!verifiedToken) {
                return res.status(401).json({
                    statusCode: 401,
                    message: 'Refresh token expire'
                })
            }
            const admin = await Admin.findById(verifiedToken.id);
            if (!admin) {
                return res.status(403).json({
                    statusCode: 403,
                    message: 'Forbiden user'
                })
            }
            const payload = {
                id: admin.id, role: admin.role, isActive: admin.isActive
            }

            const accessToken = await token.accessToken(payload)
            return res.status(200).json({
                statusCode: 200,
                message: 'success',
                date: {
                    token: accessToken
                }
            })

        } catch (error) {
            return res.status(500).json({
                statusCode: 500,
                message: error.message || 'Invalid server error'
            })
        }
    }
    signOut = async (req, res) => {
        try {
            const refresh = req.cookies?.refreshTokenAdmin;
            if (!refresh) {
                return res.status(401).json({
                    statusCode: 401,
                    message: 'Refresh token expire'
                })
            }
            const verifiedToken = await token.varifyToken(refresh, configServer.TOKEN.REFRESH_TOKEN_KEY);
            if (!verifiedToken) {
                return res.status(401).json({
                    statusCode: 401,
                    message: 'Refresh token expire'
                })
            }
            const admin = await Admin.findById(verifiedToken.id);
            if (!admin) {
                return res.status(403).json({
                    statusCode: 403,
                    message: 'Forbiden user'
                })
            }
            res.clearCookie('refreshTokenAdmin')
            return res.status(200).json({
                statusCode: 200,
                message: 'success',
                date: {}
            })
        } catch (error) {
            return res.status(500).json({
                statusCode: 500,
                message: error.message || 'Invalid server error'
            })
        }
    }
}

export default new AdminController();