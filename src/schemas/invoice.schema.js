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
        invoice_id: string({
            required_error: 'invoice_id is required'
        })
    }).optional()
}

exports.createInvoiceSchema = object({ ...payload })

exports.updateInvoiceSchema = object({ ...payloadUpdate, ...params })

exports.cancelInvoiceSchema = object({ ...params })


