const config = require('config')
const { createSession, findSessions, updateSession  }  = require('../services/session.service')
const { validatePassword, findUser, updateUser } = require('../services/user.service')
const { signJWT }  = require('../utils/jwt.utils')
const { omit } = require('lodash')
const bcrypt = require('bcrypt')

exports.createUserSessionHandler = async (req, res) => {

    // Validate user's password
    const user = (({
        _id, 
        email, 
        first_name,
        last_name,
        user_role,
        phone,
        isActive,
        isAvailable
    }) => ({
        _id, 
        email, 
        first_name,
        last_name,
        user_role,
        phone,
        isActive,
        isAvailable
    }))(await validatePassword(req.body))

    if(!user?._id) {
        return res.sendStatus(401)
    }

    // create a session
    const session = await createSession(user._id, req.get('user-agent') || '')

    // create access token
    const accessToken = signJWT(
        { ...user, session: session._id },
        { expiresIn: config.get('accessTokenTtl') } // 15 minutes
    )

    // create a refresh token
    const refreshToken = signJWT(
        { ...user, session: session._id },
        { expiresIn: config.get('refreshTokenTtl') } // 1 year
    )


    res.setHeader('x-refresh-token', refreshToken)
    // return access & refresh token
    res.cookie("accessToken", accessToken, {
        maxAge: 900000, // 15 mins
        httpOnly: true,
        secure: true,
        domain: 'localhost',
        path:'/',
        sameSite: 'strict'
    })

    res.cookie("refreshToken", refreshToken, {
        maxAge: 3.154e10, // 1 year
        httpOnly: true,
        secure: true,
        domain: 'localhost',
        path:'/',
        sameSite: 'strict'
    })

    return res.send({ accessToken, refreshToken })
}

exports.confirmCurrentPassword = async (req, res) => {
    // Validate user's password
    const user = (({
        _id, 
        email, 
        isActive, 
        user_role
    }) => ({
        _id, 
        email, 
        isActive, 
        user_role
    }))(await validatePassword({ email: res.locals.user.email, password: req.body.password }))

    if(!user) {
        return res.sendStatus(403)
    }

    return res.sendStatus(200)
}

exports.verifyPassword = async (req, res) => {
    const user = await validatePassword({ email: res.locals.user.email, password: req.body.password })
    if(!user) {
        return res.status(200).json({
            success: false,
            message: 'Forbidden'
        })
    }

    return res.status(200).json({
        success: true,
        message: 'OK'
    })
}

exports.changePasswordHandler = async (req, res) => {
    const _id = res.locals?.user?._id;
    const body = req.body

    const user = await findUser({ _id })

    if(!user) return res.sendStatus(404)

    const salt = await bcrypt.genSalt(config.get('saltWorkFactor'))

    const hash = await bcrypt.hashSync(body.password, salt)

    await updateUser({ _id }, {$set: { password: hash}}, {
        safe: true, upsert: true, new: true
    })

    return res.sendStatus(201)
}

exports.getUserSessionsHandler = async (req, res) => {
    const userId = res.locals.user._id

    const sessions = await findSessions({user: userId})

    return res.send(sessions)
}

exports.deleteSessionHandler = async (req, res) => {
    const sessionId = res.locals.user.session

    await updateSession({ _id: sessionId }, { valid:  false })

    return res.send({
            accessToken: null,
            refreshToken: null
        })
}
