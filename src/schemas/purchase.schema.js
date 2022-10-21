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
        purchase_id: string({
            required_error: 'purchase_id is required'
        })
    }).optional()
}

exports.createPurchaseSchema = object({ ...payload })

exports.updatePurchaseSchema = object({ ...payloadUpdate, ...params })

exports.deletePurchaseSchema = object({ ...params })


