const mongoose =  require('mongoose')

const stockSchema = new mongoose.Schema({
    designation : {
        type: mongoose.Schema.Types.String,
        required: true,
        trim: true,
    },
    pv_min : {
        type: mongoose.Schema.Types.Number,
        required: false,
        trim: true
    },
    category: {
        type: mongoose.Schema.Types.String,
        required: true,
        trim: true,
        enum: ['product', 'service']
    },
    unit: {
        type: mongoose.Schema.Types.String,
        required: true,
        trim: true
    },
    pv_medium : {
        type: mongoose.Schema.Types.Number,
        required: false,
        trim: true
    },
    pv_gen : {
        type: mongoose.Schema.Types.Number,
        required: false,
        trim: true
    },
    qty: {
        type: mongoose.Schema.Types.Number,
        required: true,
        trim: true
    },
    revient_price: {
        type: mongoose.Schema.Types.Number,
        trim: true,
    },
    qty_min: {
        type: mongoose.Schema.Types.Number,
        required: true,
        trim: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
})

const stockModel = mongoose.model('Stock', stockSchema)

module.exports = stockModel