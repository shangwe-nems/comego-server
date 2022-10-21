const mongoose = require('mongoose')
const config = require('config')
const bcrypt = require('bcrypt')

const userSchema = mongoose.Schema({
    isActive: {
        trim: true,
        type: mongoose.Schema.Types.Boolean,
        default: false
    },
    isAvailable: {
        trim: true,
        type: mongoose.Schema.Types.Boolean,
        default: true
    },
    first_name: {
        trim:true,
        type: mongoose.Schema.Types.String,
        maxlength: 50
    },
    last_name: {
        trim:true,
        type: mongoose.Schema.Types.String,
        maxlength:50
    },
    user_role: {
        trim:true,
        type: mongoose.Schema.Types.String,
        required: true
    },    
    email: {   
        type: mongoose.Schema.Types.String,
        trim: true,
        index: true,
        required: true,
        unique: 1 
    },
    phone: {
        type: mongoose.Schema.Types.String,
        trim: true,
        index: true,
        required: true,
        unique: 1 
    },
    password: {
        type: mongoose.Schema.Types.String,
        trim: true,
        required: true,
    },
    permissions: {
        // View permissions
        VIEW_DASHBOARD: { type: mongoose.Schema.Types.Boolean, required: true, default: true },
        VIEW_PURCHASE: { type: mongoose.Schema.Types.Boolean, required: true, default: true },
        VIEW_STOCKS: { type: mongoose.Schema.Types.Boolean, required: true, default: true },
        VIEW_SALES: { type: mongoose.Schema.Types.Boolean, required: true, default: true },
        VIEW_FINANCES: { type: mongoose.Schema.Types.Boolean, required: true, default: true },
        VIEW_REPORTS: { type: mongoose.Schema.Types.Boolean, required: true, default: true },
        VIEW_CLIENTS: { type: mongoose.Schema.Types.Boolean, required: true, default: true },
        VIEW_TRIPS: { type: mongoose.Schema.Types.Boolean, required: true, default: true },
        VIEW_PROVIDERS: { type: mongoose.Schema.Types.Boolean, required: true, default: true },
        VIEW_USERS: { type: mongoose.Schema.Types.Boolean, required: true, default: true },


        // User related permissions
        CREATE_USER: { type: mongoose.Schema.Types.Boolean, required: true, default: true },
        READ_USER: { type: mongoose.Schema.Types.Boolean, required: true, default: true },
        UPDATE_USER: { type: mongoose.Schema.Types.Boolean, required: true, default: true },
        DELETE_USER: { type: mongoose.Schema.Types.Boolean, required: true, default: true },
        UPDATE_PERMISSIONS: { type: mongoose.Schema.Types.Boolean, required: true, default: true },
        READ_PERMISSIONS: { type: mongoose.Schema.Types.Boolean, required: true, default: true },


        // Client related permissions
        CREATE_CLIENT: { type: mongoose.Schema.Types.Boolean, required: true, default: true },
        READ_CLIENT: { type: mongoose.Schema.Types.Boolean, required: true, default: true },
        UPDATE_CLIENT: { type: mongoose.Schema.Types.Boolean, required: true, default: true },
        DELETE_CLIENT: { type: mongoose.Schema.Types.Boolean, required: true, default: true },

        // Order related permissions
        CREATE_DESIGNATION: { type: mongoose.Schema.Types.Boolean, required: true, default: true },
        READ_DESIGNATION: { type: mongoose.Schema.Types.Boolean, required: true, default: true },
        UPDATE_DESIGNATION: { type: mongoose.Schema.Types.Boolean, required: true, default: true },
        DELETE_DESIGNATION: { type: mongoose.Schema.Types.Boolean, required: true, default: true },

        // Order related permissions
        CREATE_FINANCE: { type: mongoose.Schema.Types.Boolean, required: true, default: true },
        READ_FINANCE: { type: mongoose.Schema.Types.Boolean, required: true, default: true },
        UPDATE_FINANCE: { type: mongoose.Schema.Types.Boolean, required: true, default: true },
        DELETE_FINANCE: { type: mongoose.Schema.Types.Boolean, required: true, default: true },


        // Agent related permissions
        CREATE_INVOICE: { type: mongoose.Schema.Types.Boolean, required: true, default: true },
        READ_INVOICE: { type: mongoose.Schema.Types.Boolean, required: true, default: true },
        UPDATE_INVOICE: { type: mongoose.Schema.Types.Boolean, required: true, default: true },
        DELETE_INVOICE: { type: mongoose.Schema.Types.Boolean, required: true, default: true },

        // Material related permissions
        CREATE_PROVIDER: { type: mongoose.Schema.Types.Boolean, required: true, default: true },
        READ_PROVIDER: { type: mongoose.Schema.Types.Boolean, required: true, default: true },
        UPDATE_PROVIDER: { type: mongoose.Schema.Types.Boolean, required: true, default: true },
        DELETE_PROVIDER: { type: mongoose.Schema.Types.Boolean, required: true, default: true },

        // PURCHASE related permissions
        CREATE_PURCHASE: { type: mongoose.Schema.Types.Boolean, required: true, default: true },
        READ_PURCHASE: { type: mongoose.Schema.Types.Boolean, required: true, default: true },
        UPDATE_PURCHASE: { type: mongoose.Schema.Types.Boolean, required: true, default: true },
        DELETE_PURCHASE: { type: mongoose.Schema.Types.Boolean, required: true, default: true },

        // Expense related permissions
        CREATE_SALE: { type: mongoose.Schema.Types.Boolean, required: true, default: true },
        READ_SALE: { type: mongoose.Schema.Types.Boolean, required: true, default: true },
        UPDATE_SALE : { type: mongoose.Schema.Types.Boolean, required: true, default: true },
        DELETE_SALE : { type: mongoose.Schema.Types.Boolean, required: true, default: true },

        // Cashout related permissions
        CREATE_STOCK: { type: mongoose.Schema.Types.Boolean, required: true, default: true },
        READ_STOCK: { type: mongoose.Schema.Types.Boolean, required: true, default: true },
        UPDATE_STOCK: { type: mongoose.Schema.Types.Boolean, required: true, default: true },
        DELETE_STOCK: { type: mongoose.Schema.Types.Boolean, required: true, default: true },

        // Cashin related permissions
        CREATE_TRAVEL: { type: mongoose.Schema.Types.Boolean, required: true, default: true },
        READ_TRAVEL: { type: mongoose.Schema.Types.Boolean, required: true, default: true },
        UPDATE_TRAVEL: { type: mongoose.Schema.Types.Boolean, required: true, default: true },
        DELETE_TRAVEL: { type: mongoose.Schema.Types.Boolean, required: true, default: true },

        // Reports related permissions
        READ_FINANCES: { type: mongoose.Schema.Types.Boolean, required: true, default: true },
        READ_REPORTS: { type: mongoose.Schema.Types.Boolean, required: true, default: true },      

    },
    last_session: {
        valid: { type: mongoose.Schema.Types.Boolean, default: false },
        userAgent: { type: mongoose.Schema.Types.String, trim: true },
        createdAt: { type: mongoose.Schema.Types.Date, trim: true }
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
})

userSchema.pre('save', async function(next) {
    let user = this

    if(!user.isModified('password'))
        return next()

    const salt = await bcrypt.genSalt(config.get('saltWorkFactor'))

    const hash = await bcrypt.hashSync(user.password, salt)

    user.password = hash

    return next()
})

userSchema.methods

userSchema.methods.comparePassword = async function(candidatePassword) {
    const user = this
    return bcrypt.compare(candidatePassword, user.password).catch(e => false)
}

module.exports = mongoose.model('User', userSchema)