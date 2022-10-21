const { omit, isEmpty } = require('lodash')
const UserModel = require('../models/user.model')

exports.createUser =  async (input) => {
    try {
        const user = await UserModel.create(input)
        return omit(user?.toJSON(), "password", "permissions")
    } catch (error) {
        throw new Error(error)
    }
}

exports.validatePassword = async ({email, password}) => {
    const user = await UserModel.findOne({ email })

    if(!user) return false

    const isValid = await user.comparePassword(password)

    if(!isValid) return false

    return omit(user.toJSON(), 'password')
}

exports.findUser = async (query) => {
    if(isEmpty(query)) {
        const users = await UserModel.find(query)
        return users.map(user => omit(user.toJSON(), "password", "updatedAt"))
    }

    const user = await UserModel.findById(query)
    return omit(user.toJSON(), "password", 'updatedAt')
}

exports.updateUser = async (query, update, options) => {
    const user = await UserModel.findByIdAndUpdate(query, update, options)
    return omit(user.toJSON(), "password", "updatedAt", "createdAt", "permissions")
}

exports.updateUserPermissions = async (query, update, options) => {
    const user = await UserModel.findByIdAndUpdate(query, update, options)
    return omit(user.toJSON(), "password", "updatedAt", "createdAt")
}

exports.deleteUser = async (query) => {
    return await UserModel.findByIdAndDelete(query)
}