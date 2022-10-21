const { createStock, updateStock, findStock, deleteStock } = require("../services/stock.service")

exports.createStockHandler = async (req, res) => {
    const author = res.locals.user._id
    const permission = req.permissions
    const body = req.body
    
    if(!permission.CREATE_STOCK) return res.sendStatus(403)

    const stock  = await createStock({ ...body, author})
    res.send(stock)
}


exports.updateStockHandler = async (req, res) => {
    const permission = req.permissions
    const _id = req.params.stock_id

    const update = req.body

    if(!permission.UPDATE_STOCK) return res.sendStatus(403)

    const stock = await findStock({ _id })

    if(!stock) return res.sendStatus(404)

    const updatedStock = await updateStock({ _id }, {$set: { ...update}}, {
        safe: true,
        upsert: true,
        new: true
    })

    return res.send(updatedStock)
}

exports.getStockHandler = async (req, res) => {
    const _id = req.params.stock_id
    const permission = req.permissions

    if(!permission.READ_STOCK) return res.sendStatus(403)

    const stock = await findStock(_id === '*' ? {} : { _id })

    if(!stock) return res.sendStatus(404)

    return res.send(stock)
}

exports.deleteStockHandler = async (req, res) => {
    const _id = req.params.stock_id
    const permission = req.permissions

    if(!permission.DELETE_STOCK) return res.sendStatus(403)

    const stock = await findStock({ _id })

    if(!stock) return res.sendStatus(404)

    await deleteStock({ _id })

    return res.sendStatus(200)
}