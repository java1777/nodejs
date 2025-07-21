import Joi from "joi";

export class AuthorValidator {
    constructor() {
        this.phoneRegex = /^(\+?998|8)?[\s]?(\(?(33|50|55|71|77|88|90|91|93|94|95|97|98|99)\)?[\s]?)?(\d{3})[\s]?(\d{2})[\s]?(\d{2})$/;
        this.passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    }

    createAuthorValidator(data) {
        const author = Joi.object({
            name: Joi.string().trim().min(3).required().messages({
                'string.base': 'Name must be string',
                'string.min': 'Name is too short',
                'string.empty': 'Name is required'
            }),
            country: Joi.string().trim().optional().pattern(/^[A-Z].*$/).messages({
                'string.base': 'Country must be string',
                'string.pattern.base': `Country's first letter should be capital`
            }),
            age: Joi.number().min(18).optional().messages({
                'number.base': 'Age must be number',
                'number.min': 'Age must be at least 18'
            }),
            phoneNumber: Joi.string().trim().pattern(this.phoneRegex).required().messages({
                'string.base': 'Phone number must be string',
                'string.pattern.base': 'Invalid format of phone number',
                'string.empty': 'Phone number required'
            }),
            email: Joi.string().trim().email().required().messages({
                'string.base': 'Email address must be string',
                'string.email': 'Invalid email address format',
                'string.empty': 'Email address required'
            }),
            password: Joi.string().trim().pattern(this.passRegex).required().messages({
                'string.base': 'Password must be string',
                'string.pattern.base': 'Password is not strong',
                'string.empty': 'Password is required'
            }),
            gender: Joi.string().trim().valid('male', 'female').required().messages({
                'any.only': 'Choose only male or female'
            })
        });
        return author.validate(data);
    }

    updateAuthorValidator(data) {
        const author = Joi.object({
            name: Joi.string().trim().min(3).optional().messages({
                'string.base': 'Name must be string',
                'string.min': 'Name is too short'
            }),
            country: Joi.string().trim().optional().pattern(/^[A-Z].*$/).messages({
                'string.base': 'Country must be string',
                'string.pattern.base': `Country's first letter should be capital`
            }),
            age: Joi.number().min(18).optional().messages({
                'number.base': 'Age must be number',
                'number.min': 'Age must be at least 18'
            }),
            phoneNumber: Joi.string().trim().pattern(this.phoneRegex).optional().messages({
                'string.base': 'Phone number must be string',
                'string.pattern.base': 'Invalid format of phone number'
            }),
            email: Joi.string().trim().email().optional().messages({
                'string.base': 'Email address must be string',
                'string.email': 'Invalid email address format'
            }),
            password: Joi.string().trim().pattern(this.passRegex).optional().messages({
                'string.base': 'Password must be string',
                'string.pattern.base': 'Password is not strong'
            }),
            gender: Joi.string().trim().valid('male', 'female').optional().messages({
                'any.only': 'Choose only male or female'
            })
        });
        return author.validate(data);
    }
}