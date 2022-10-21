const mongoose =  require('mongoose')

const providerSchema = new mongoose.Schema({
    shop_name : {
        type: mongoose.Schema.Types.String,
        trim: true,
        required: true,
        maxlength: 50
    },
    category : {
        type: mongoose.Schema.Types.String,
        trim: true,
        required: true,
        maxlength: 50
    },
    city : {
        type: mongoose.Schema.Types.String,
        trim: true,
        required: true,
    },
    address : {
        type: mongoose.Schema.Types.String,
        trim: true,
    },
    contact : {
        type: mongoose.Schema.Types.String,
        trim: true
    },
    ref_name : {
        type: mongoose.Schema.Types.String,
        trim: true
    },
    ref_phone : {
        type: mongoose.Schema.Types.String,
        trim: true
    },
    dette: {
        type: mongoose.Schema.Types.Number,
        trim: true, default: 0
    },
    author : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    strict: true,
    timestamps: true
})

const providerModel = mongoose.model('Provider', providerSchema)

module.exports = providerModel