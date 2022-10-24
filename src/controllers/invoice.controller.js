const { omit } = require("lodash")
const invoiceModel = require("../models/invoice.model")
const { updateClient, findClient } = require("../services/client.service")
const { createFinance } = require("../services/finance.service")
const { createInvoice, updateInvoice, findInvoice, deleteInvoice, lastInserted } = require("../services/invoice.service")
const { createManySales, findSale } = require("../services/sale.service")
const { updateStock } = require("../services/stock.service")

const generateInvoiceNo = async () => {
    const last = await lastInserted()
    if(last.length === 0) return parseInt(0)
    return last[0].invoice_no
}

exports.createInvoiceHandler = async (req, res) => {
    const author = res.locals.user._id
    const permission = req.permissions
    const body = req.body
    
    if(!permission.CREATE_INVOICE) return res.sendStatus(403)

    const invoice  = await createInvoice({ ...omit(body, "products"), author, invoice_no: await generateInvoiceNo() + 1 })

    const products = body.products.map(prod => {
        return {
            ...prod,
            author: author
        }
    })

    if(body.buyer_category === 'regular' && body.isCredit) {
        await updateClient(
            {_id: body.client},
            { $push: { invoices: invoice._id }, $inc: { dette : body.total_amount} },
            { safe: true, upsert: true, new: true }
        )
    }

    const popProducts = products.map(prod => {
        return {
            ...prod,
            invoice: invoice._id, 
        }
    })

    const sales = await createManySales(popProducts)

    const sales_ids = sales.map(sale => sale._id)

    await Promise.all(
        body.products.map(async (item) => {
            if(item.category === 'product') {
                const update = {
                    $inc : { 
                        qty : parseInt(item?.qty * -1)
                    } 
                }

                await updateStock(
                    { _id: item?.product },
                    update,
                    { 
                        safe: true, 
                        new: true 
                    }
                )
            }
        })
    );

    const updatedInvoice = await updateInvoice(
        { _id: invoice._id },
        { $push: { products: { $each: sales_ids } } },
        { safe: true, upsert: true, new: true }
    )

    // if(!body.isCredit) {
    //     await createFinance({
    //         source: 'treasury',
    //         category: 'income',
    //         designation_id: 'jhhjjjhhhj',
    //         designation: `Vente marchandise`,
    //         motive: `Paiement de la facture Nº ${(row.invoice_no)?.toString()?.padStart(7 + '', "0")} par l'acheteur ${updatedInvoice.buyer_category === 'casual' ? updatedInvoice.buyer_name : updatedInvoice.client.names}`,
    //         code: `70.1`, 
    //         reference: author.first_name?.concat(' ', author.last_name),
    //         amount: invoice.total_amount,
    //         author
    //     })
    // }

    const newInvoice = {...updatedInvoice._doc, buyer: updatedInvoice.buyer_category === 'casual' ? updatedInvoice.buyer_name : updatedInvoice.client.names}

    return res.send(newInvoice)
}


exports.updateInvoiceHandler = async (req, res) => {
    const permission = req.permissions
    const _id = req.params.invoice_id

    const update = req.body

    // if(!permission.UPDATE_INVOICE) return res.sendStatus(403)
    if(!permission.UPDATE_INVOICE) return res.sendStatus(403)


    const invoice = await findInvoice({ _id })

    if(!invoice) return res.sendStatus(404)

    const updatedInvoice = await updateInvoice({ _id }, {$set: { ...update}}, {
        safe: true,
        upsert: true,
        new: true
    })

    return res.send(updatedInvoice)
}

exports.getInvoiceHandler = async (req, res) => {
    const _id = req.params.invoice_id
    const permission = req.permissions

    // if(!permission.READ_INVOICE) return res.sendStatus(403)
    if(!permission.READ_INVOICE) return res.sendStatus(403)

    const invoice = await findInvoice(_id === '*' ? {} : { _id })

    if(!invoice) return res.sendStatus(404)

    const invoiceList = invoice?.map(invoice => {
        return {
            ...invoice,
            buyer: invoice.buyer_category === 'casual' ? invoice.buyer_name : invoice.client.names
        }
    })

    return res.send(invoiceList)
}


exports.cancelInvoiceHandler = async (req, res) => {
    const _id = req.params.invoice_id
    const permission = req.permissions

    // if(!permission.DELETE_INVOICE) return res.sendStatus(403)
    if(!permission.DELETE_INVOICE) return res.sendStatus(403)


    const invoice = await findInvoice({ _id })

    if(!invoice) return res.sendStatus(404)

    await Promise.all(
        invoice.products.map(async (item) => {
            if(item.category === 'product') {
                const update = {
                    $inc : { 
                        qty : parseInt(item?.qty)
                    } 
                }
    
                await updateStock(
                    { _id: item?.product },
                    update,
                    { 
                        safe: true, 
                        new: true 
                    }
                )
            }
        })
    );

    if(invoice.buyer_category === 'regular' && invoice.isCredit) {
        await updateClient(
            { _id: invoice.client._id },
            { $inc: { dette : parseFloat(invoice.total_amount * -1)} },
            { safe: true, upsert: true, new: true }
        )
    }

    const updatedInvoice = await updateInvoice(
        { _id: invoice._id },
        { $set: { isValid: false } },
        { safe: true, upsert: true, new: true }
    )

    return res.send(updatedInvoice)
}

exports.getTodayCashSales = async (req, res) => {
    const permission = req.permissions
    const today = new Date().toISOString()

    if(!permission.READ_INVOICE) return res.sendStatus(403)

    // To be completed

    const dayStart = today.substring(0,10).concat('T00:00:00Z');
    const dayEnd = today.substring(0,10).concat('T23:59:59Z');

    const tot_payment_daily = await invoiceModel.aggregate(
        [
            { $match: { 
                isCredit: false,
                isValid: true,
                createdAt: { 
                    $gte: new Date(dayStart), 
                    $lt: new Date(dayEnd)
                }
            }},
            { $group: { 
                _id : "$isCredit",
                count : { $sum: "$total_amount" }
            }
        }
    ]);

    return res.send(tot_payment_daily)
}
