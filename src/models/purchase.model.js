const mongoose =  require('mongoose')

const purchaseSchema = new mongoose.Schema({
    category : {
        type: mongoose.Schema.Types.String,
        required: true,
        trim: true,
        enum: ['local', 'foreign']
    },
    designation : {
        type: mongoose.Schema.Types.String,
        required: true,
        trim: true,
    },
    unit : {
        type: mongoose.Schema.Types.String,
        required: true,
        trim: true,
    },
    stock_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Stock',
        trim: true
    },
    foreign_pa_unit: {
        type: mongoose.Schema.Types.Number,
        trim: true,
    },
    local_pa_unit: {
        type: mongoose.Schema.Types.Number,
        trim: true,
    },
    exchange_rate: {
        type: mongoose.Schema.Types.Number,
        trim: true,
    },
    currency: {
        type: mongoose.Schema.Types.String,
        trim: true,
        default: 'usd'
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
    provider: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Provider',
        required: true
    }, 
    travel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Travel'
    }, 
    invoice_no: {
        type: mongoose.Schema.Types.String,
        trim: true
    },
    isCredit: {
        type: mongoose.Schema.Types.Boolean,
        trim: true,
        default: false
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    strict: true,
    timestamps: true
})

const purchaseModel = mongoose.model('Purchase', purchaseSchema)

module.exports = purchaseModel