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
        travel_id: string({
            required_error: 'travel_id is required'
        })
    }).optional()
}

exports.createTravelSchema = object({ ...payload })

exports.updateTravelSchema = object({ ...payloadUpdate, ...params })

exports.deleteTravelSchema = object({ ...params })


