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
        designation_id: string({
            required_error: 'designation_id is required'
        })
    }).optional()
}

exports.createDesignationSchema = object({ ...payload })

exports.updateDesignationSchema = object({ ...payloadUpdate, ...params })

exports.deleteDesignationSchema = object({ ...params })


