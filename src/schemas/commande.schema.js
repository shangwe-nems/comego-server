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
        commande_id: string({
            required_error: 'commande_id is required'
        })
    }).optional()
}

exports.createCommandeSchema = object({ ...payload })

exports.updateCommandeSchema = object({ ...payloadUpdate, ...params })

exports.cancelCommandeSchema = object({ ...params })


