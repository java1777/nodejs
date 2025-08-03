import { BaseController } from './base.controller.js';
import { Admin } from '../models/admin.model.js';
import  { configServer } from '../config/server.config.js';
import { successRes } from '../utils/success-res.js';
import { AppError } from '../error/AppError.js';
import redis from '../utils/Redis.js';
import token from '../utils/Token.js';
import Crypt from '../utils/Crypt.js';
import { generateOTP } from '../utils/generate-otp.js';
import { sendOTPToMail } from '../utils/send-mail.js';
import joi from 'joi';

export class AdminController extends BaseController {
    constructor() {
        super(Admin)
    }

    // Admin create qilish!!!
    createAdmin = async (req, res, next) => {
        try {
            console.log(req.body);
            
            const {username, email, password, isActive, phone} = req.body;
            const existUsername = await Admin.findOne({username})
            if(existUsername) {
                throw new AppError('Username already exists', 422);
            }
            const existEmail = await Admin.findOne({email})
            if(existEmail) {
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
            
            return successRes(res, data, 201)
            
        } catch (error) {
            next(error)
        }
    }

    // Tizimga email va password orqali kirish va token olish
    signInAdmin = async (req, res, next) => {
        try {
            //requestga kegan usernameni bor ili yoligini tekshirish
            console.log('danggg');
            
            const { email, password } = req.body
            const admin = await Admin.findOne({email})
            if(!admin) {
                throw new AppError('Email or password incorrect', 409)
            }
            // Parolni decrypt qivotti (toriligini tekshirvoti)
            const hashPass = await Crypt.decrypt(password, admin.hashPassword)
            if(!hashPass) {
                throw new AppError('Email or password incorrect', 409)
            }
            //JWT token uchun payload yaratilmoqda
            const payload = {
                id: admin._id, role: admin.role, isActive: admin.isActive
            }

            //Token olinvotti payload orqali
            const accessToken = await token.accessToken(payload)
            const refreshToken = await token.refreshToken(payload)

            // refreshToken cookiega yozilvotti
            await token.writeCookie(res, 'refreshTokenAdmin', refreshToken, 30);

            // JSON fayl qilib token bilan user ma'lumotlarini qaytarish
            successRes(res, accessToken)
        } catch (error) {
            next(error)
        }
    }

    // Yengi token olish cookie refresh tokeni tekshirib
    newToken = async (req, res, next) => {
        try {
            // refreshToken muddati tugagan bo'lsa va yangi olmoqchi bo'lsa
            // refresh Token borligini tekshiryapti 
            const refresh = req.cookies?.refreshTokenAdmin
            if (!refresh) {
                throw new AppError('Authorization error', 401)
            }
            // refresh Token verify qivotti
            const verifiedToken = await token.verifyToken(refresh, configServer.TOKEN.REFRESH_TOKEN_KEY);
            if (!verifiedToken) {
                throw new AppError('Refresh token expire', 401)
            }
            // tokendigi user borligini tekshirish
            const admin = await Admin.findById(verifiedToken.id);
            if(!admin) {
                throw new AppError('Forbidden user', 403)
            }
            // yengi tokenga payload berilvotti

            const payload = {
                id: admin.id, role: admin.role, isActive: admin.isActive
            }

            const accessToken = await token.accessToken(payload)
            successRes(res, accessToken)
        } catch (error) {
            next(error)
        }
    }

        // Tizimdan chiqib ketish token tekshirgan holda
        signOut = async (req, res, next) => {
            try {
                // log out cookie tozalash
                // refresh Token borligini tekshirvotti
                const refresh = req.cookies?.refreshTokenAdmin;
                if (!refresh) {
                    throw new AppError('Refresh token is not found', 404)
                }
                // refresh Token verify qivotti
                const verifiedToken = await token.verifyToken(refresh, configServer.TOKEN.REFRESH_TOKEN_KEY);
                if(!verifiedToken) {
                    throw new AppError('Refresh token expire', 401)
                }
                // Tokendigi useri borligini tekshirvotti
                const admin = await Admin.findById(verifiedToken.id);
                if(!admin) {
                    throw new AppError('Forbidden user', 403)
                }
                // Token tozalab tashash
                res.clearCookie('refreshTokenAdmin')
                successRes(res, {})
            } catch (error) {
                next(error)
            }
        }

        //admin malumotlarini update qilish
        updateAdmin = async (req, res, next) => {
            try {
                // id tekshirish
                const id = req.params?.id
                const admin = await BaseController.checkByID(id, Admin)
                const { email, username, password } = req.body;
                //username kebqosa
                if (username) {
                    //username bor yo'ligi tekshiriladi
                    const exists = await Admin.findOne({ username });
                    if (exists && exists.username !== username) {
                        throw new AppError('Username is already exists', 409)
                    }
                }
                //email kebqosa
                if(email) {
                    //email bor yoki yoligini tekshiriladi
                    const exists = await Admin.findOne({ email });
                    if (exists && exists.email !== email) {
                        throw new AppError('email is already exists', 409)
                    }
                }
                // Parol keb qosa
                if (password) {
                    // Paroli faqat SUPERADMIN update qilolidi
                    if (req.user?.role != admin.role) {
                        throw new AppError('Not access to change password for admin', 403);
                    }
                    req.body.hashPassword = await Crypt.encrypt(password)
                    // eski password ochirib tashaldi
                    delete req.body.password
                }
            //id topiladi va req.body kelgan data update qilinadi
            const updateAdmin = await Admin.findByIdAndUpdate(id, req.body, {new:true});
            return successRes(res, updateAdmin)
            } catch (error) {
                next(error)
            }
        }
        //admin parolini update qilish eski parolni kirtgan holda
        updatePasswordForAdmin = async (req, res, next) => {
            try {
                // id boyicha admin topiladi
                const id = req.params?.id;
                const admin = await BaseController.checkById(id, Admin);
                const { oldPassword, newPassword } = req.body;
                // eski parol tekshiraladi hash langan parolgan tengi yoki yo'q
                const isMatchPassword = await Crypt.decrypt(oldPassword, admin.hashPassword);
                if (isMatchPassword) {
                    throw new AppError('Incorrect old Password', 409)
                }
                //yangi parol hash lab yuboriladi
                const hashPass = await Crypt.encrypt(newPassword);
                // DBga ham update qilinadi
                const updateAdmin = await Admin.findByIdAndUpdate(id, { hashPassword: hashPass}, { new: true});
                return successRes(res, updateAdmin)
            } catch (error) {
                next(error)
            }
        };

        // paroli update qilish eski paroli eslay olmasa
        forgetPassword = async (req, res, next) => {
            try {
                // email borligini tekshiriladi
                const { email } = req.body;
                const admin = await Admin.findOne({ email });
                if (!admin) {
                    throw new AppError('Email address is not found', 404)
                }
                // 6 xonali son olinadi random tarzida
                const otp = generateOTP();
                // emailga xabar tarzida otp yuboriladi(6-xonali son)
                sendOTPToMail(email, otp);
                // redisga vaqtinchalik malumot yuboriladi saqlab turish uchun
                await redis.setData(email, otp)
                // frontga email , otp va vaqt yuboriladi
                return successRes(res, {
                    email,
                    otp,
                    expireOTP: '5 minutes'
                });
            } catch (error) {
                next(error)
            }
        }

        // emaildan kegan malumoti olib tasdiqlash uchun OTP ishlatadi
        confirmOTP = async (req, res, next) => {
            try {
                const {email , otp} = req.body;
                // email orqali redisdan 6 xonali sonni olinadi
                const checkOPT = await redis.getData(email);
                if (checkOPT != String(otp)) {
                    throw new AppError('OTP incorrect or expired', 400);
                };
                // email orqali redisdan 6 xonali soni ochiriladi
                await redis.delete(email);
                return successRes(res, {
                    confirmURL: configServer.CONFIRM_URL,
                    requestMethod: 'PATCH',
                    email
                })
            } catch (error) {
                next(error)
            }
        };

        // yangi paroli tasdiqlanadi email orqali
        confirmPassword = async (req, res, next) => {
            try {
                const { email, newPassword } =req.body
                // email orqali admin malumotlarini olib kelinadi
                const admin = await Admin.findOne({ email });
                // topilmasa error qaytaradi
                if (!admin) {
                    throw new AppError('Email address is not found', 404)
                };
                // yangi paroli hashlab qaytarib yuboriladi
                const hashPassword = await Crypt.encrypt(newPassword);
                // id boyicha topiladi va update qilinadi
                const updateAdmin = await Admin.findByIdAndUpdate(admin._id, {hashPassword}, {new: true});
                successRes(res, {
                    id: updateAdmin._id,
                    email: updateAdmin.email,
                    password: updateAdmin.hashPassword,
                    isActive: updateAdmin.isActive,
                    role: updateAdmin.role
                })
            } catch (error) {
                next(error)
            }
        }
}

export default new AdminController();