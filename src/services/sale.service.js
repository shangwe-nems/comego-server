const { omit, isEmpty } = require('lodash')
const saleModel = require('../models/sale.model')

exports.createSale = async (input) => {
    try {
        const sale = await saleModel.create(input)
        return omit(sale.toJSON(), "author", 'updatedAt')
    } catch (err) {
        throw new Error(err)
    }
}

exports.createManySales = async (input) => {
    try {
        const sale = await saleModel.insertMany(input)
        return sale
    } catch (err) {
        throw new Error(err)
    }
}


exports.findSale = async (query, options = { lean: true }) => {
    if(isEmpty(query)) {
        const sales = await saleModel.find(query).populate('invoice', 'invoice_no').populate('author', 'first_name last_name')
        return sales.map(sale => omit(sale.toJSON(), "updatedAt"))
    }

    return await saleModel.findById(query, {}, options).populate('author', 'first_name last_name')
}

exports.updateSale = async (query, update, options = { lean: true }) => {
    return await saleModel.findByIdAndUpdate(query, update, options).populate('author', 'first_name last_name')
}

exports.deleteSale = async (query) => {
    return await saleModel.findByIdAndDelete(query)
}