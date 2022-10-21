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
        sale_id: string({
            required_error: 'sale_id is required'
        })
    }).optional()
}

exports.createSaleSchema = object({ ...payload })

exports.updateSaleSchema = object({ ...payloadUpdate, ...params })

exports.deleteSaleSchema = object({ ...params })


