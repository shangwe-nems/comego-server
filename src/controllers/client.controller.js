const { findClient, deleteClient, updateClient, createClient } = require("../services/client.service")

exports.createClientHandler = async (req, res) => {
    const author = res.locals.user._id
    const body = req.body
    const permission = req.permissions

    if(!permission.CREATE_CLIENT) return res.sendStatus(403)

    const client = await createClient({ ...body, author})
    res.json(client)
}

exports.updateClientHandler = async (req, res) => {
    const permission = req.permissions
    const _id = req.params.client_id

    const update = req.body

    if(!permission.UPDATE_CLIENT) return res.sendStatus(403)

    const client = await findClient({ _id })

    if(!client) return res.sendStatus(404)

    if(update.action === 'payment') {
        const updatedData = await updateClient(
            { _id }, 
            { $inc : { dette : parseFloat(update.amount * -1) }}, 
            {
                safe: true,
                upsert: true,
                new: true
            })
        return res.json(updatedData)
    } 


    const updatedClient = await updateClient({ _id }, { $set: {...update}}, {
        safe: true,
        upsert: true,
        new: true
    })

    return res.json(updatedClient)
}

exports.getClientHandler = async (req, res) => {
    const _id = req.params.client_id

    const permission = req.permissions

    if(!permission.READ_CLIENT) return res.sendStatus(403)

    const client = await findClient( _id === '*' ? {} : { _id })

    if(!client) return res.sendStatus(404)

    return res.json(client)
}

exports.deleteClientHandler = async (req, res) => {
    const _id = req.params.client_id

    const permission = req.permissions

    if(!permission.DELETE_CLIENT) return res.sendStatus(403)


    const client = await findClient({ _id })

    if(!client) return res.sendStatus(404)

    await deleteClient({ _id })

    return res.sendStatus(200)
}