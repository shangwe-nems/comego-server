const mongoose =  require('mongoose')

const designationSchema = new mongoose.Schema({
    libelle : {
        type: mongoose.Schema.Types.String,
        trim: true,
        required: true,
        maxlength: 240
    },
    code : {
        type: mongoose.Schema.Types.String,
        trim: true,
        maxlength: 10
    },
    move : {
        type: mongoose.Schema.Types.String,
        required: true,
        trim: true,
        enum: ['in', 'out']
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
})

const designationModel = mongoose.model('Designation', designationSchema)

module.exports = designationModel