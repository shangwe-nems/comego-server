const { omit, isEmpty } = require('lodash')
const stockModel = require('../models/stock.model')

exports.createStock = async (input) => {
    try {
        const stock = await stockModel.create(input)
        return omit(stock.toJSON(), "author", 'updatedAt')
    } catch (err) {
        throw new Error(err)
    }
}

exports.findStock = async (query, options = { lean: true }) => {
    if(isEmpty(query)) {
        const stocks = await stockModel.find(query).populate('author', 'first_name last_name')
        return stocks.map(stock => omit(stock.toJSON(), "updatedAt"))
    }

    return await stockModel.findById(query, {}, options).populate('author', 'first_name last_name')
}

exports.updateStock = async (query, update, options = { lean: true }) => {
    return await stockModel.findByIdAndUpdate(query, update, options).populate('author', 'first_name last_name')
}

exports.deleteStock = async (query) => {
    return await stockModel.findByIdAndDelete(query)
}