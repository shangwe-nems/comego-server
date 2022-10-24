const mongoose =  require('mongoose')

const commandeSchema = new mongoose.Schema({
    order_date: {
        type: mongoose.Schema.Types.Date,
        required: true,
        trim: true,
    },
    commande_no: {
        type: mongoose.Schema.Types.Number,
        required: true,
        trim: true,
        default: 0
    },
    provider: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Provider',
        trim: true,
    },
    provider_name: {
        type: mongoose.Schema.Types.String,
        required: false,
        trim: true,
    },
    products: [],
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

const commandeModel = mongoose.model('Commande', commandeSchema)

module.exports = commandeModel