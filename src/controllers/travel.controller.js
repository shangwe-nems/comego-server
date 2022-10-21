const { createTravel, updateTravel, findTravel, deleteTravel } = require("../services/travel.service")

exports.createTravelHandler = async (req, res) => {
    const author = res.locals.user._id
    const permission = req.permissions
    const body = req.body
    
    if(!permission.CREATE_TRAVEL) return res.sendStatus(403)

    const travel  = await createTravel({ ...body, author})
    res.send(travel)
}

exports.updateTravelHandler = async (req, res) => {
    const permission = req.permissions
    const _id = req.params.travel_id

    const update = req.body

    if(!permission.UPDATE_TRAVEL) return res.sendStatus(403)

    const travel = await findTravel({ _id })

    if(!travel) return res.sendStatus(404)

    const updatedTravel = await updateTravel({ _id }, {$set: { ...update}}, {
        safe: true,
        upsert: true,
        new: true
    })

    return res.send(updatedTravel)
}

exports.getTravelHandler = async (req, res) => {
    const _id = req.params.travel_id
    const permission = req.permissions

    if(!permission.READ_TRAVEL) return res.sendStatus(403)

    const travel = await findTravel(_id === '*' ? {} : { _id })

    if(!travel) return res.sendStatus(404)

    return res.send(travel)
}

exports.deleteTravelHandler = async (req, res) => {
    const _id = req.params.travel_id
    const permission = req.permissions

    if(!permission.DELETE_TRAVEL) return res.sendStatus(403)

    const travel = await findTravel({ _id })

    if(!travel) return res.sendStatus(404)

    await deleteTravel({ _id })

    return res.sendStatus(200)
}