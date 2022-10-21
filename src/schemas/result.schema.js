const { object, string, number } = require('zod')

const payload = {
    body: object({
        
    }).optional()
}


exports.getResultSchema = object({ ...payload })




