const { omit, isEmpty } = require('lodash')
const ClientModel = require('../models/client.model')

exports.createClient = async (input) => {
    try {
        const client = await ClientModel.create(input)
        return omit(client.toJSON(), "author", 'updatedAt')
    } catch (err) {
        throw new Error(err)
    }
}

exports.findClient = async (query, options = { lean: true }) => {
    if(isEmpty(query)) {
        const clients = await ClientModel.find(query).populate('author', 'first_name last_name')
        return clients.map(client => omit(client.toJSON(), "updatedAt"))
    }

    return await ClientModel.findById(query, {}, options).populate('author', 'first_name last_name')
}

exports.updateClient = async (query, update, options = { lean: true }) => {
    return await ClientModel.findByIdAndUpdate(query, update, options).populate('author', 'first_name last_name')
}

exports.deleteClient = async (query) => {
    return await ClientModel.findByIdAndDelete(query)
}