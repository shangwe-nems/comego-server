const mongoose =  require('mongoose')

const invoiceSchema = new mongoose.Schema({
    sale_date: {
        type: mongoose.Schema.Types.Date,
        required: true,
        trim: true,
    },
    buyer_category: {
        type: mongoose.Schema.Types.String,
        required: true,
        trim: true,
        enum: ['regular', 'casual']
    },
    invoice_no: {
        type: mongoose.Schema.Types.Number,
        required: true,
        trim: true,
        default: 0
    },
    client: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
        trim: true,
    },
    isCredit: {
        type: mongoose.Schema.Types.Boolean,
        required: true,
        default: false,
        trim: true,
    },
    echeance: {
        type: mongoose.Schema.Types.Date,
        trim: true
    },
    buyer_name: {
        type: mongoose.Schema.Types.String,
        required: false,
        trim: true,
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Sale',
        required: true,
        trim: true,
    }],
    isValid: {
        type: mongoose.Schema.Types.Boolean,
        default: true,
        trim: true,
    },
    total_amount: {
        type: mongoose.Schema.Types.Number,
        required: true,
        trim: true,
    },
    observation: {
        type: mongoose.Schema.Types.String,
        required: false,
        trim: true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
})

const invoiceModel = mongoose.model('Invoice', invoiceSchema)

module.exports = invoiceModel