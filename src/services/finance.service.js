const { omit, isEmpty } = require('lodash')
const FinanceModel = require('../models/finance.model')

exports.createFinance = async (input) => {
    try {
        const finance = await FinanceModel.create(input)
        return omit(finance.toJSON(), "author", 'updatedAt')
    } catch (err) {
        throw new Error(err)
    }
}

exports.findFinance = async (query, options = { lean: true }) => {
    const finances = await FinanceModel.find(query).populate('author', 'first_name last_name')
    return finances.map(finance => omit(finance.toJSON(), "updatedAt"))
}

exports.updateFinance = async (query, update, options = { lean: true }) => {
    return await FinanceModel.findByIdAndUpdate(query, update, options).populate('author', 'first_name last_name')
}

exports.deleteFinance = async (query) => {
    return await FinanceModel.findByIdAndDelete(query)
}

exports.lastTransaction = async (query) => {
    return await FinanceModel.find(query).sort({_id:-1}).limit(1).lean()
}