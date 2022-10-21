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
        provider_id: string({
            required_error: 'provider_id is required'
        })
    }).optional()
}

exports.createProviderSchema = object({ ...payload })

exports.updateProviderSchema = object({ ...payloadUpdate, ...params })

exports.deleteProviderSchema = object({ ...params })


