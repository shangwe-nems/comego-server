const {object, string, array, boolean} = require('zod')
const config = require('config')

exports.createUserSchema = object({
    body: object({
        first_name: string({
            required_error: "first_name is required"
        }).min(2).max(120),
        last_name: string({
            required_error: "last_name is required"
        }).min(2).max(120),
        user_role: string({
            required_error: "user_role is required"
        }).max(44),
        email: string({
            required_error:'email is required'
        }).email('not a valid email').max(50),
        password: string({
            required_error: 'password is required'
        }).min(6, 'password too short - should be at 6 chars minimum').max(50),
        passwordConfirmation: string({
            required_error: 'passwordConfirmation is required'
        }).min(6).max(50),
        phone: string({
            required_error: 'phone is required'
        }).min(10).max(18),
        isActive: boolean().optional(),
        isAvailable: boolean().optional()
    }).refine(data => data.password === data.passwordConfirmation, {
        message: 'passwords do not match',
        path: ['passwordConfirmation']
    }).optional()
})

const payloadUpdate = {
    body: object({
        first_name: string().min(2).max(120).optional(),
        last_name: string().min(2).max(120).optional(),
        user_role: string().max(44).optional(),
        email: string().email('not a valid email').max(50).optional(),
        password: string().min(6, 'password too short - should be at 6 chars minimum').max(50).optional(),
        passwordConfirmation: string().min(6).max(50).optional(),
        phone: string().min(10).max(18).optional(),
        isActive: boolean().optional(),
        isAvailable: boolean().optional(),
        permissions: object().optional()
    }).optional()
}

const params = {
    params: object({
        user_id: string({
            required_error: "user_id is required"
        })
    }).optional()
}

exports.updateUserSchema = object({
    ...payloadUpdate, ...params
})




