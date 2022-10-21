const { findDesignation, deleteDesignation, updateDesignation, createDesignation } = require("../services/designation.service")

exports.createDesignationHandler = async (req, res) => {
    const author = res.locals.user._id
    const body = req.body
    const permission = req.permissions

    if(!permission.CREATE_DESIGNATION) return res.sendStatus(403)

    const designation = await createDesignation({ ...body, author})
    res.json(designation)
}

exports.updateDesignationHandler = async (req, res) => {
    const permission = req.permissions
    const _id = req.params.designation_id

    const update = req.body

    if(!permission.UPDATE_DESIGNATION) return res.sendStatus(403)

    const designation = await findDesignation({ _id })

    if(!designation) return res.sendStatus(404)

    const updatedDesignation = await updateDesignation({ _id }, { $set: {...update}}, {
        safe: true,
        upsert: true,
        new: true
    })

    return res.json(updatedDesignation)
}

exports.getDesignationHandler = async (req, res) => {
    const _id = req.params.designation_id

    const permission = req.permissions

    if(!permission.READ_DESIGNATION) return res.sendStatus(403)

    const designation = await findDesignation( _id === '*' ? {} : { _id })

    if(!designation) return res.sendStatus(404)

    return res.json(designation)
}

exports.deleteDesignationHandler = async (req, res) => {
    const _id = req.params.designation_id

    const permission = req.permissions

    if(!permission.DELETE_DESIGNATION) return res.sendStatus(403)

    const designation = await findDesignation({ _id })

    if(!designation) return res.sendStatus(404)

    await deleteDesignation({ _id })

    return res.sendStatus(200)
}

