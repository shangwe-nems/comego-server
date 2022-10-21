const { omit, isEmpty } = require('lodash')
const purchaseModel = require('../models/purchase.model')

exports.createPurchase = async (input) => {
    try {
        console.log('Form Purchase Service: ', input)
        const purchase = await purchaseModel.create(input)
        return omit(purchase.toJSON(), "author", 'updatedAt')
    } catch (err) {
        throw new Error(err)
    }
}

exports.findPurchase = async (query, options = { lean: true }) => {
    if(isEmpty(query)) {
        const purchases = await purchaseModel.find(query).populate('travel', 'exchange_rate currency coefficient margin').populate('provider', 'shop_name').populate('author', 'first_name last_name')
        return purchases.map(purchase => omit(purchase.toJSON(), "updatedAt"))
    }

    return await purchaseModel.findById(query, {}, options).populate('travel', 'exchange_rate currency coefficient margin').populate('provider', 'shop_name').populate('author', 'first_name last_name')
}

exports.updatePurchase = async (query, update, options = { lean: true }) => {
    return await purchaseModel.findByIdAndUpdate(query, update, options).populate('author', 'first_name last_name')
}

exports.deletePurchase = async (query) => {
    return await purchaseModel.findByIdAndDelete(query)
}