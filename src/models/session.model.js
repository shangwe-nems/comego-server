const mongoose = require('mongoose')

const sessionSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    valid: {
        type: mongoose.Schema.Types.Boolean,
        default: true
    },
    userAgent: {
        type: mongoose.Schema.Types.String
    }
}, {
    timestamps: true
})

const SessionModel = mongoose.model("Session", sessionSchema)

module.exports = SessionModel