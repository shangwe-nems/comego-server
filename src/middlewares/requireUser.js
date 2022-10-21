const { get } = require('lodash')
const { findUser } = require('../services/user.service')
const requireUser = async (req, res, next) => {
    const user = res.locals?.user
    
    if(!user) {
        return res.sendStatus(403)
    }
    const userData = await findUser({ _id: user._id})
    req.permissions = userData.permissions

    return next()
}

module.exports = requireUser