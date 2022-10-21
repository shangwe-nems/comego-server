const { findFinance, deleteFinance, updateFinance, createFinance, lastTransaction } = require("../services/finance.service")

const currentBalance = async (query) => {
    const last = await lastTransaction({ source: query })
    if(last.length === 0) return parseInt(0)
    return last[0].balance
}

const generateReceiptNo = async () => {
    const last = await lastTransaction({ move: 'in' })
    if(last.length === 0) return parseInt(0)
    return last[0].receipt_no
}

exports.createFinanceHandler = async (req, res) => {
    const author = res.locals.user._id
    const body = req.body
    const permission = req.permissions

    if(!permission.CREATE_FINANCE) return res.sendStatus(403)

    let newBalance = body.category === 'expense' || body.category === 'withdraw' ? 
            parseFloat(await currentBalance(body.source)) - parseFloat(body.amount) :
            parseFloat(await currentBalance(body.source)) + parseFloat(body.amount) 

    const finance = await createFinance({ 
        ...body, 
        receipt_no: await generateReceiptNo() + 1,
        balance: newBalance, 
        author
    })

    const transaction = await findFinance({ _id: finance._id })

    res.json(transaction[0])
}

exports.updateFinanceHandler = async (req, res) => {
    const permission = req.permissions
    const _id = req.params.finance_id

    const update = req.body

    if(!permission.UPDATE_FINANCE) return res.sendStatus(403)

    const finance = await findFinance({ _id })

    if(!finance) return res.sendStatus(404)

    const updatedFinance = await updateFinance({ _id }, { $set: {...update}}, {
        safe: true,
        upsert: true,
        new: true
    })

    return res.json(updatedFinance)
}

exports.getFinanceHandler = async (req, res) => {
    const _id = req.params.finance_id

    const permission = req.permissions

    if(!permission.READ_FINANCE) return res.sendStatus(403)

    const finance = await findFinance({ source: _id })

    if(!finance) return res.sendStatus(404)

    return res.json(finance)
}

exports.deleteFinanceHandler = async (req, res) => {
    const _id = req.params.finance_id

    const permission = req.permissions

    if(!permission.DELETE_FINANCE) return res.sendStatus(403)


    const finance = await findFinance({ _id })

    if(!finance) return res.sendStatus(404)

    await deleteFinance({ _id })

    return res.sendStatus(200)
}