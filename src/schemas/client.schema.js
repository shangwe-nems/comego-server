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
        client_id: string({
            required_error: 'client_id is required'
        })
    }).optional()
}

exports.createClientSchema = object({ ...payload })

exports.updateClientSchema = object({ ...payloadUpdate, ...params })

exports.deleteClientSchema = object({ ...params })


