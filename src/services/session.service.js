const config = require('config')
const { get, omit } = require('lodash')
const SessionModel = require('../models/session.model')
const { verifyJWT, signJWT } = require('../utils/jwt.utils')
const { findUser, updateUser } = require('./user.service')

exports.createSession = async (userId, userAgent) => {
    const session = await SessionModel.create({ user_id: userId, userAgent })
    await updateUser({_id: userId}, { $set: { last_session: omit(session.toJSON(), "_id", "updatedAt") }}, { safe: true, upsert: true, new: true })
    return session.toJSON()
}

exports.findSessions = async (query) => {
    return SessionModel.find(query).limit(24).lean()
}

exports.updateSession = async (query, update) => {
    return SessionModel.updateOne(query, update)
}

exports.reIssueAccessToken = async ({refreshToken}) => {
    const { decoded } = verifyJWT(refreshToken)

    if(!decoded || !get(decoded, '_id')) return false

    const session = await SessionModel.findById(get(decoded, '_id'))

    if(!session || !session.valid) return false

    const user = await findUser({ _id: session.user})

    if(!user) return false

    const accessToken = signJWT(
        { ...user, session: sesssion._id },
        { expiresIn: config.get('accessTokenTtl') } // 15 minutes
    )

    return accessToken
}
