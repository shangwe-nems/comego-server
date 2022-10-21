const { object, string, number } = require('zod')

const payload = {
    body: object({
        
    }).optional()
}

const payloadUpdate = {
    body: object({
        
    }).optional()
}

const params = {
    params: object({
        finance_id: string({
            required_error: 'finance_id is required'
        })
    }).optional()
}

exports.createFinanceSchema = object({ ...payload })

exports.updateFinanceSchema = object({ ...payloadUpdate, ...params })

exports.deleteFinanceSchema = object({ ...params })


