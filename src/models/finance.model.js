const mongoose =  require('mongoose')

const financeSchema = new mongoose.Schema({
    source: {
        type: mongoose.Schema.Types.String,
        trim: true,
        maxlength: 50,
        enum: ['bank', 'treasury']
    },
    category: {
        type: mongoose.Schema.Types.String,
        trim: true,
        maxlength: 50,
        enum: ['income', 'expense', 'withdraw', 'deposit']
    },
    designation_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Designation',
        trim: true,
        required: true,
    },
    designation: {
        type: mongoose.Schema.Types.String,
        trim: true,
        required: true,
        maxlength: 144
    },
    receipt_no: {
        type: mongoose.Schema.Types.Number,
        trim: true, 
        required: true,
        default: 0
    },
    move: {
        type: mongoose.Schema.Types.String,
        trim: true,
        required: true, 
        enum: ['in', 'out']
    },
    motive : {
        type: mongoose.Schema.Types.String,
        trim: true,
        required: true,
        maxlength: 144
    },
    code : {
        type: mongoose.Schema.Types.String,
        trim: true,
        maxlength: 50
    },
    reference : {
        type: mongoose.Schema.Types.String,
        trim: true,
        maxlength: 50
    },
    amount : {
        type: mongoose.Schema.Types.Number,
        trim: true,
        required: true,
    },
    balance : {
        type: mongoose.Schema.Types.Number,
        trim: true,
        required: true,
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    strict: true,
    timestamps: true
})

const financeModel = mongoose.model('Finances', financeSchema)

module.exports = financeModel