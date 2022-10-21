const {object, string} = require('zod')

exports.createSessionSchema = object({
    body: object({
        email: string({
            required_error: 'Email is required'
        }),
        password: string({
            required_error: "Password is required"
        })
    })
})

exports.checkPwdSchema = object({
    body: object({
        password: string({
            required_error: 'password required'
        })
    })
})

exports.changePwdSchema = object({
    body: object({
        password: string({
            required_error: 'password is required'
        }).min(6, 'password too short - should be at 6 chars minimum').max(50),
        passwordConfirmation: string({
            required_error: 'passwordConfirmation is required'
        }).min(6).max(50)
    }).refine(data => data.password === data.passwordConfirmation, {
        message: 'passwords do not match',
        path: ['passwordConfirmation']
    }).optional()
})

