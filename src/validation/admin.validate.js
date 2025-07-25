import Joi from "joi";
const emailReg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const phoneReg = /^\+?998(9[01345789]|33|88)[0-9]{7}$/

class AdminValidation {
    create = () => {
        return Joi.object({
            username: Joi.string().required(),
            email: Joi.string().pattern(emailReg).required(),
            password: Joi.string().required(),
            isActive: Joi.boolean(),
            role: Joi.string().valid('Admin'),
            phone: Joi.string().pattern(phoneReg)
        })

    }

    update = () => {
        return Joi.object({
            username: Joi.string().required(),
            email: Joi.string().pattern(emailReg).optional(),
            password: Joi.string().optional(),
            isActive: Joi.boolean(),
            role: Joi.string().valid('Admin'),
            phone: Joi.string().pattern(phoneReg)
        })

    }

    signIn = () => {
        return Joi.object({
            email: Joi.string().required(),
            password: Joi.string().required(),
        })

    }
}

export default new AdminValidation();