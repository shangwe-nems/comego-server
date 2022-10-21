const { findProvider, deleteProvider, updateProvider, createProvider } = require("../services/provider.service")

exports.createProviderHandler = async (req, res) => {
    const author = res.locals.user._id
    const body = req.body
    const permission = req.permissions

    // if(!permission.CREATE_PROVIDER) return res.sendStatus(403)
    if(!permission.CREATE_PROVIDER) return res.sendStatus(403)

    const provider = await createProvider({ ...body, author})
    return res.json(provider)
}

exports.updateProviderHandler = async (req, res) => {
    const permission = req.permissions
    const _id = req.params.provider_id

    const update = req.body

    // if(!permission.UPDATE_PROVIDER) return res.sendStatus(403)
    if(!permission.UPDATE_PROVIDER) return res.sendStatus(403)

    const provider = await findProvider({ _id })

    if(!provider) return res.sendStatus(404)

    if(update.action === 'payment') {
        const updatedData = await updateProvider(
            { _id }, 
            { $inc : { dette : parseFloat(update.amount * -1) }}, 
            {
                safe: true,
                upsert: true,
                new: true
            })
        return res.json(updatedData)
    }

    const updatedProvider = await updateProvider({ _id }, { $set: {...update}}, {
        safe: true,
        upsert: true,
        new: true
    })

    return res.json(updatedProvider)
}

exports.getProviderHandler = async (req, res) => {
    const _id = req.params.provider_id

    const permission = req.permissions

    // if(!permission.READ_PROVIDER) return res.sendStatus(403)
    if(!permission.READ_PROVIDER) return res.sendStatus(403)

    const provider = await findProvider( _id === '*' ? {} : { _id })

    if(!provider) return res.sendStatus(404)

    return res.json(provider)
}

exports.deleteProviderHandler = async (req, res) => {
    const _id = req.params.provider_id

    const permission = req.permissions

    // if(!permission.DELETE_PROVIDER) return res.sendStatus(403)
    if(!permission.DELETE_PROVIDER) return res.sendStatus(403)


    const provider = await findProvider({ _id })

    if(!provider) return res.sendStatus(404)

    await deleteProvider({ _id })

    return res.sendStatus(200)
}