const { omit, isEmpty } = require('lodash')
const TravelModel = require('../models/travel.model')

exports.createTravel = async (input) => {
    try {
        const travel = await TravelModel.create(input)
        return omit(travel.toJSON(), "author", 'updatedAt')
    } catch (err) {
        throw new Error(err)
    }
}

exports.findTravel = async (query, options = { lean: true }) => {
    if(isEmpty(query)) {
        const travels = await TravelModel.find(query).populate('author', 'first_name last_name')
        return travels.map(travel => omit(travel.toJSON(), "updatedAt"))
    }

    return await TravelModel.findById(query, {}, options).populate('author', 'first_name last_name')
}

exports.updateTravel = async (query, update, options = { lean: true }) => {
    return await TravelModel.findByIdAndUpdate(query, update, options).populate('author', 'first_name last_name')
}

exports.deleteTravel = async (query) => {
    return await TravelModel.findByIdAndDelete(query)
}