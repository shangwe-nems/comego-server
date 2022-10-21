const mongoose =  require('mongoose')

const saleSchema = new mongoose.Schema({
    designation: {
        type: mongoose.Schema.Types.String,
        trim: true,
        required: true,
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        trim: true,
        ref: 'Stocks',
        required: true,
    },
    category: {
        type: mongoose.Schema.Types.String,
        trim: true,
        required: true,
        enum: ['product', 'service']
    },
    qty: {
        type: mongoose.Schema.Types.Number,
        trim: true,
        required: true,
    },
    pv_unit : {
        type: mongoose.Schema.Types.Number,
        trim: true,
        required: true,
    },
    pv_tot: {
        type: mongoose.Schema.Types.Number,
        trim: true,
        required: true,
    },
    invoice: {
        type: mongoose.Schema.Types.ObjectId,
        trim: true,
        ref: 'Invoices',
        required: false
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
})

const saleModel = mongoose.model('Sale', saleSchema)

module.exports = saleModel