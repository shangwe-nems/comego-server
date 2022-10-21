const { createUser, findUser, updateUser, deleteUser, updateUserPermissions } = require("../services/user.service")
const logger = require('../utils/logger')
const config = require('config')

exports.createUserHandler = async (req, res) => {
    const permission = req.permissions
    if(!permission.CREATE_USER) return res.sendStatus(403)

    try {
        const user = await createUser(req.body)
        return res.send(user)
    } catch (err) {
        logger.error("[Conflict]: Account already exist")
        return res.sendStatus(409)
    }
}

exports.updateUserHandler = async (req, res) => {
    const _id = req.params.user_id
    const permission = req.permissions

    if(!permission.UPDATE_USER) return res.sendStatus(403)
    
    const update = req.body

    const user = await findUser({ _id })

    if(!user) return res.sendStatus(404)

    if(String(user._id) !== _id) return res.sendStatus(403)

    const updatedUser = await updateUser({ _id }, {$set: {...update}},{
        safe: true, upsert: true, new: true
    })

    return res.send(updatedUser)
}

exports.disableAccountHandler = async (req, res) => {
    const _id = res.locals.user._id
    const permission = req.permissions

    if(!permission.UPDATE_USER) return res.sendStatus(403)

    if(String(user._id) === _id) return res.sendStatus(403)

    const user = await findUser({ _id })

    if(!user) return res.sendStatus(404)

    const disabledUser = await updateUser({ _id }, {$set: { isActive: false}}, {
        safe: true,
        upsert: true,
        new: true
    })

    return res.sendStatus(disabledUser)
}


exports.getUserHandler = async (req, res) => {
    const _id = req.params.user_id
    const permission = req.permissions

    if(!permission.READ_USER) return res.sendStatus(403)

    const user = await findUser(_id === '*' ? {} : { _id })

    if(!user) return res.sendStatus(404)

    return res.send(user)
}

exports.getLoggedInUserHanlder = async (req, res) => {
    const permission = req.permissions

    if(!permission.READ_USER) return res.sendStatus(403)

    let userData = res.locals.user;
    userData.permissions = permission

    return res.send(userData)
}

exports.updatePermissionsHandler = async (req, res) => {
    const _id = req.params.user_id
    const permission = req.permissions

    if(!permission.UPDATE_PERMISSIONS) return res.sendStatus(403)
    
    const update = req.body

    const user = await findUser({ _id })

    if(!user) return res.sendStatus(404)

    const updatedPermissions = {...user.permissions, ...update}

    const updatedUser = await updateUserPermissions({ _id }, {$set: { permissions : updatedPermissions}},{
        safe: true, upsert: true, new: true
    })

    return res.send(updatedUser)
}

exports.deleteUserHandler = async (req, res) => {
    const _id = req.params.user_id
    const permission = req.permissions

    if(!permission.DELETE_USER) return res.sendStatus(403)

    const order = await findUser({ _id })

    if(!order) return res.sendStatus(404)

    await deleteUser({ _id })

    return res.send({ _id })
}




