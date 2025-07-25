import Joi from "joi";

class CustomerValidation {
    static emailReg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    static phoneReg = /^\+?998(9[01345789]|33|88)[0-9]{7}$/

    create = async () => {
        return Joi.object({
            username: Joi.string().required(),
            email: Joi.string().pattern(this.emailReg).required(),
            password: Joi.string().required(),
            isActive: Joi.boolean(),
            role: Joi.string().valid('Customer'),
            phone: Joi.string().pattern(this.phoneReg)
        })

    }

    update = async () => {
        return Joi.object({
            username: Joi.string().required(),
            email: Joi.string().pattern(this.emailReg).optional(),
            password: Joi.string().optional(),
            isActive: Joi.boolean(),
            role: Joi.string().valid('Customer'),
            phone: Joi.string().pattern(this.phoneReg)
        })

    }

    signIn = async () => {
        return Joi.object({
            email: Joi.string().required(),
            password: Joi.string().required(),
        })

    }
}

export default new CustomerValidation();