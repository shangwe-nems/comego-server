const { omit, isEmpty } = require('lodash')
const CommandeModel = require('../models/commande.model')

exports.createCommande = async (input) => {
    try {
        const commande = await CommandeModel.create(input)
        return omit(commande.toJSON(), "author", 'updatedAt')
    } catch (err) {
        throw new Error(err)
    }
}

exports.findCommande = async (query, options = { lean: true }) => {
    if(isEmpty(query)) {
        const commandes = await CommandeModel.find(query).populate('provider', 'shop_name address contact').populate('author', 'first_name last_name')
        return commandes.map(commande => omit(commande.toJSON(), "updatedAt"))
    }

    return await CommandeModel.findById(query, {}, options).populate('provider', 'shop_name address contact').populate('author', 'first_name last_name')
}

exports.updateCommande = async (query, update, options = { lean: true }) => {
    return await CommandeModel.findByIdAndUpdate(query, update, options).populate('provider', 'shop_name address contact').populate('author', 'first_name last_name')
}

exports.deleteCommande = async (query) => {
    return await CommandeModel.findByIdAndDelete(query)
}

exports.lastInsertedCommande = async () => {
    return await CommandeModel.find().sort({_id:-1}).limit(1).lean()
}