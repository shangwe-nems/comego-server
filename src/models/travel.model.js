const mongoose =  require('mongoose')

const travelSchema = new mongoose.Schema({
    departure : {
        type: mongoose.Schema.Types.Date,
        trim: true,
        required: true,
    },
    arrival : {
        type: mongoose.Schema.Types.Date,
        trim: true,
        required: true,
    },
    city : {
        type: mongoose.Schema.Types.String,
        trim: true,
        maxlength: 50,
        required: true,
    },
    reference : {
        type: mongoose.Schema.Types.String,
        trim: true,
        required: true,
    },
    total_fees : {
        type: mongoose.Schema.Types.Number,
        trim: true,
        required: true,
    },
    purchase_global_fees : {
        type: mongoose.Schema.Types.Number,
        trim: true,
        required: true,
    },
    currency : {
        type: mongoose.Schema.Types.String,
        trim: true,
        required: true,
    },
    exchange_rate : {
        type: mongoose.Schema.Types.Number,
        trim: true,
        required: true,
    },
    coefficient : {
        type: mongoose.Schema.Types.Number,
        trim: true,
        required: true,
    },
    margin : {
        type: mongoose.Schema.Types.Number,
        trim: true,
        required: true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
})

const travelModel = mongoose.model('Travel', travelSchema)

module.exports = travelModel