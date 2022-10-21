const { get } = require("lodash")
const { reIssueAccessToken } = require("../services/session.service")
const { verifyJWT } = require("../utils/jwt.utils")


const deserializeUser = async (req, res, next) => {
    const accessToken = 
        get(req, 'cookies.accessToken') || 
        get(req, 'headers.authorization', '').replace(/^Bearer\s/, '') 

    const refreshToken = 
        get(req, 'cookies.refreshToken') || 
        get(req, 'headers.refreshtoken')

    if(!accessToken || accessToken === null) {
        return next()
    }

    const { decoded, expired } = verifyJWT(accessToken)

    if(decoded) {
        res.locals.user = decoded;
        return next()
    }

    if(expired && refreshToken) {
        const newAccessToken = await reIssueAccessToken({ refreshToken })

        if(newAccessToken) {
            res.setHeader('x-access-token', newAccessToken)

            res.cookie("accessToken", newAccessToken, {
                maxAge: 900000, // 15 mins
                httpOnly: true,
                secure: true,
                domain: 'localhost',
                path:'/',
                sameSite: 'strict'
            })
        }

        const result = verifyJWT(newAccessToken)

        res.locals.user = result.decoded
        return next()
    }

    return next()
}

module.exports = deserializeUser