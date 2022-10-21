const { omit, isEmpty } = require('lodash')
const ProviderModel = require('../models/provider.model')

exports.createProvider = async (input) => {
    try {
        const provider = await ProviderModel.create(input)
        return omit(provider.toJSON(), "author", 'updatedAt')
    } catch (err) {
        throw new Error(err)
    }
}

exports.findProvider = async (query, options = { lean: true }) => {
    if(isEmpty(query)) {
        const providers = await ProviderModel.find(query).populate('author', 'first_name last_name')
        return providers.map(provider => omit(provider.toJSON(), "updatedAt"))
    }

    return await ProviderModel.findById(query, {}, options).populate('author', 'first_name last_name')
}

exports.updateProvider = async (query, update, options = { lean: true }) => {
    return await ProviderModel.findByIdAndUpdate(query, update, options).populate('author', 'first_name last_name')
}

exports.deleteProvider = async (query) => {
    return await ProviderModel.findByIdAndDelete(query)
}