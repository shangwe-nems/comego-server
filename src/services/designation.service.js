const { omit, isEmpty } = require('lodash')
const DesignationModel = require('../models/designation.model')

exports.createDesignation = async (input) => {
    try {
        const designation = await DesignationModel.create(input)
        return omit(designation.toJSON(), "author", 'updatedAt')
    } catch (err) {
        throw new Error(err)
    }
}

exports.findDesignation = async (query, options = { lean: true }) => {
    if(isEmpty(query)) {
        const designations = await DesignationModel.find(query)
        return designations.map(designation => omit(designation.toJSON(), "updatedAt"))
    }

    return await DesignationModel.findById(query, {}, options)
}

exports.updateDesignation = async (query, update, options = { lean: true }) => {
    return await DesignationModel.findByIdAndUpdate(query, update, options)
}

exports.deleteDesignation = async (query) => {
    return await DesignationModel.findByIdAndDelete(query)
}