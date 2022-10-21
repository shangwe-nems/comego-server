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
        stock_id: string({
            required_error: 'stock_id is required'
        })
    }).optional()
}

exports.createStockSchema = object({ ...payload })

exports.updateStockSchema = object({ ...payloadUpdate, ...params })

exports.deleteStockSchema = object({ ...params })


