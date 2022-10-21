const mongoose =  require('mongoose')

const clientSchema = new mongoose.Schema({
    names : {
        type: mongoose.Schema.Types.String,
        trim: true,
        required: true,
        maxlength: 50
    },
    dette: {
        type: mongoose.Schema.Types.Number,
        trim: true, 
        default: 0
    },
    reference : {
        type: mongoose.Schema.Types.String,
        trim: true,
        maxlength: 50
    },
    phone: {
        type: mongoose.Schema.Types.String,
        trim: true,
        required: true,
    },
    email : {
        type: mongoose.Schema.Types.String,
        trim: true,
        required: false,
    },
    invoices: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Invoice'
    }],
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
})

const clientModel = mongoose.model('Client', clientSchema)

module.exports = clientModel