const { createSale, updateSale, findSale, deleteSale } = require("../services/sale.service")

exports.createSaleHandler = async (req, res) => {
    const author = res.locals.user._id
    const permission = req.permissions
    const body = req.body
    
    if(!permission.CREATE_SALE) return res.sendStatus(403)

    const sale  = await createSale({ ...body, author})
    res.send(sale)
}


exports.updateSaleHandler = async (req, res) => {
    const permission = req.permissions
    const _id = req.params.sale_id

    const update = req.body

    if(!permission.UPDATE_SALE) return res.sendStatus(403)

    const sale = await findSale({ _id })

    if(!sale) return res.sendStatus(404)

    const updatedSale = await updateSale({ _id }, {$set: { ...update}}, {
        safe: true,
        upsert: true,
        new: true
    })

    return res.send(updatedSale)
}

exports.getSaleHandler = async (req, res) => {
    const _id = req.params.sale_id
    const permission = req.permissions

    if(!permission.READ_SALE) return res.sendStatus(403)

    const sale = await findSale(_id === '*' ? {} : { _id })

    if(!sale) return res.sendStatus(404)

    return res.send(sale)
}

exports.deleteSaleHandler = async (req, res) => {
    const _id = req.params.sale_id
    const permission = req.permissions

    if(!permission.DELETE_SALE) return res.sendStatus(403)

    const sale = await findSale({ _id })

    if(!sale) return res.sendStatus(404)

    await deleteSale({ _id })

    return res.sendStatus(200)
}

