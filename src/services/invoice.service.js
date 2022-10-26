const { omit, isEmpty } = require('lodash')
const InvoiceModel = require('../models/invoice.model')

exports.createInvoice = async (input) => {
    try {
        const invoice = await InvoiceModel.create(input)
        return omit(invoice.toJSON(), "author", 'updatedAt')
    } catch (err) {
        throw new Error(err)
    }
}

exports.findInvoice = async (query, options = { lean: true }) => {
    if(isEmpty(query)) {
        const invoices = await InvoiceModel.find(query).populate('client', 'names phone email').populate('products').populate('author', 'first_name last_name')
        return invoices.map(invoice => omit(invoice.toJSON(), "updatedAt"))
    }

    return await InvoiceModel.findById(query, {}, options).populate('client', 'names phone email').populate('products').populate('author', 'first_name last_name')
}

exports.updateInvoice = async (query, update, options = { lean: true }) => {
    return await InvoiceModel.findByIdAndUpdate(query, update, options).populate('client', 'names phone email').populate('author', 'first_name last_name')
}

exports.deleteInvoice = async (query) => {
    return await InvoiceModel.findByIdAndDelete(query)
}

exports.lastInserted = async () => {
    return await InvoiceModel.find().sort({_id:-1}).limit(1).lean()
}