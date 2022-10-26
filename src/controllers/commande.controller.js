const { omit } = require("lodash")
const { createCommande, updateCommande, findCommande, lastInsertedCommande } = require("../services/commande.service")

const generateCommandeNo = async () => {
    const last = await lastInsertedCommande()
    if(last.length === 0) return parseInt(0)
    return last[0].commande_no
}

exports.createCommandeHandler = async (req, res) => {
    const author = res.locals.user._id
    const permission = req.permissions
    const body = req.body
    
    if(!permission.CREATE_INVOICE) return res.sendStatus(403)

    const newCommande  = await createCommande({ ...body, author, commande_no: await generateCommandeNo() + 1 })

    const commande = await findCommande({ _id: newCommande._id})

    return res.send(commande)
}


exports.updateCommandeHandler = async (req, res) => {
    const permission = req.permissions
    const _id = req.params.commande_id

    const update = req.body

    // if(!permission.UPDATE_INVOICE) return res.sendStatus(403)
    if(!permission.UPDATE_INVOICE) return res.sendStatus(403)


    const commande = await findCommande({ _id })

    if(!commande) return res.sendStatus(404)

    const updatedCommande = await updateCommande({ _id }, {$set: { ...update}}, {
        safe: true,
        upsert: true,
        new: true
    })

    return res.send(updatedCommande)
}

exports.getCommandeHandler = async (req, res) => {
    const _id = req.params.commande_id
    const permission = req.permissions

    // if(!permission.READ_INVOICE) return res.sendStatus(403)
    if(!permission.READ_INVOICE) return res.sendStatus(403)

    const commande = await findCommande(_id === '*' ? {} : { _id })

    if(!commande) return res.sendStatus(404)

    // const commandeList = commande?.map(commande => {
    //     return {
    //         ...commande,
    //         buyer: commande.buyer_category === 'casual' ? commande.buyer_name : commande.client.names
    //     }
    // })

    return res.send(commande)
}


exports.cancelCommandeHandler = async (req, res) => {
    const _id = req.params.commande_id
    const permission = req.permissions

    // if(!permission.DELETE_INVOICE) return res.sendStatus(403)
    if(!permission.DELETE_INVOICE) return res.sendStatus(403)


    const commande = await findCommande({ _id })

    if(!commande) return res.sendStatus(404)

    const updatedCommande = await updateCommande(
        { _id: commande._id },
        { $set: { isValid: false } },
        { safe: true, upsert: true, new: true }
    )

    return res.send(updatedCommande)
}

