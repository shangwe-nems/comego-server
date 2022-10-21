const ObjectId =  require('mongoose').Types.ObjectId
const { updateProvider } = require('../services/provider.service')
const { createPurchase, updatePurchase, findPurchase, deletePurchase } = require("../services/purchase.service")
const { createStock, findStock, updateStock } = require("../services/stock.service")

const isObjectIdValid = id => ObjectId.isValid(id) ? String(new ObjectId(id) === id) ? true : false : false;

exports.createPurchaseHandler = async (req, res) => {
    const author = res.locals.user._id
    const permission = req.permissions
    const body = req.body
    
    if(!permission.CREATE_PURCHASE) return res.sendStatus(403)

    if(body.isCredit) {
        await updateProvider(
            { _id: body?.provider},
            { $inc: { dette : parseFloat(body.local_pa_unit) *  parseFloat(body.qty) }}
        )
    }

    console.log('IsValid ? ', isObjectIdValid(body?.designation))

    if(isObjectIdValid(body?.designation)) {
        const data = await findStock({ _id: body?.designation })
        const purchase  = await createPurchase({ ...body, designation: data?.designation || body?.designation, travel: body.travel === '' ? undefined : body.travel, author})

        const populatedPurchase = await findPurchase({_id : purchase._id })

        await updateStock(
            { _id: data?._id}, 
            { 
                $inc : {
                    qty : body.qty
                }, 
                $set: {
                    revient_price: (data?.revient_price + parseFloat(body?.revient_price)) / 2,
                    pv_min: (((data?.revient_price + parseFloat(body?.revient_price)) / parseInt(2)) * 1.20).toFixed(4)
                }
        })

        return res.send(populatedPurchase)
    } else {
        const purchase  = await createPurchase({ ...body, travel: body.travel === '' ? undefined : body.travel, author})
        const populatedPurchase = await findPurchase({_id : purchase._id })

        await createStock({ 
            designation: populatedPurchase.designation,
            unit: populatedPurchase.unit,
            category: 'product',
            pv_min : ((populatedPurchase.revient_price * 0.2) + populatedPurchase.revient_price),
            qty: populatedPurchase.qty,
            revient_price : populatedPurchase.revient_price,
            qty_min: body.qty_min,
            author
        })

        res.send(populatedPurchase)
    }

    // const purchase  = await createPurchase({ ...body, travel: body.travel === '' ? undefined : body.travel, author})
    // const populatedPurchase = await findPurchase({_id : purchase._id })

    // await createstock({ 
    //     designation: populatedPurchase.designation,
    //     pv_min : ((populatedPurchase.revient_price * 0.2) + populatedPurchase.revient_price),
    //     qty: populatedPurchase.qty,
    //     revient_price : populatedPurchase.revient_price,
    //     author
    // })

    // res.send(populatedPurchase)
}


exports.updatePurchaseHandler = async (req, res) => {
    const permission = req.permissions
    const _id = req.params.purchase_id

    const update = req.body

    if(!permission.UPDATE_PURCHASE) return res.sendStatus(403)

    const purchase = await findPurchase({ _id })

    if(!purchase) return res.sendStatus(404)

    const updatedPurchase = await updatePurchase({ _id }, {$set: { ...update}}, {
        safe: true,
        upsert: true,
        new: true
    })

    const populatedPurchase = await findPurchase({_id : updatedPurchase._id })

    return res.send(populatedPurchase)
}

exports.getPurchaseHandler = async (req, res) => {
    const _id = req.params.purchase_id
    const permission = req.permissions

    if(!permission.READ_PURCHASE) return res.sendStatus(403)

    const purchase = await findPurchase(_id === '*' ? {} : { _id })

    if(!purchase) return res.sendStatus(404)

    return res.send(purchase)
}

exports.deletePurchaseHandler = async (req, res) => {
    const _id = req.params.purchase_id
    const permission = req.permissions

    if(!permission.DELETE_PURCHASE) return res.sendStatus(403)

    const purchase = await findPurchase({ _id })

    if(!purchase) return res.sendStatus(404)

    await deletePurchase({ _id })

    return res.sendStatus(200)
}