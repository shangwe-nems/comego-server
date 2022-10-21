const clientModel = require("../models/client.model");
const financeModel = require("../models/finance.model");
const invoiceModel = require("../models/invoice.model");
const providerModel = require("../models/provider.model");
const saleModel = require("../models/sale.model");
const { lastTransaction } = require("../services/finance.service");

const currentBalance = async (query) => {
    const last = await lastTransaction({ source: query })
    if(last.length === 0) return parseInt(0)
    return last[0].balance
}

exports.getResultReportHandler = async (req, res) => {
    const permission = req.permissions
    const body = req.body
    
    if(!permission.READ_REPORTS) return res.sendStatus(403)

    const result = await financeModel.aggregate(
        [
            { $match: { 
                createdAt: { 
                    $gte: new Date(body.start_date.substring(0,10).concat('T00:00:00Z')), 
                    $lt: new Date(body.end_date.substring(0,10).concat('T23:59:59Z'))
                }
            }},
            { $group: { 
                _id : {
                    designation_id: "$designation_id",
                    designation : "$designation",
                    code: "$code", 
                    move: "$move"
                },
                total : { $sum: "$amount" }
            }
        }
    ]);

    const resultData = result.map(res => {
        return {
            ...res._id,
            total: res.total
        }
    })

    return res.send(resultData)
}

exports.getDashboardReportHandler = async (req, res) => {
    const permission = req.permissions

    if(!permission.READ_REPORTS) return res.sendStatus(403)

    const tot_debt_provider = await providerModel.aggregate(
        [{ 
            $match : {
                $expr: {
                    $eq: [{ $year: "$createdAt" }, new Date().getFullYear()]
                }
            }
        },
        { 
            $group : { 
                _id : "dettes", 
                amount : { $sum : "$dette" } 
            }
        }]
    );

    const tot_debt_client = await clientModel.aggregate(
        [{ 
            $match : {
                $expr: {
                    $eq: [{ $year: "$createdAt" }, new Date().getFullYear()]
                }
            }
        },
        { 
            $group : { 
                _id : "creances", 
                amount : { $sum : "$dette" } 
            }
        }]
    );

    const solde = await currentBalance('treasury')


    const cash_tot_payment = await invoiceModel.aggregate(
        [{ 
            $match : {
                $and: [
                    { isCredit: false },
                    { isValid: true }
                ],
                $expr: {
                    $eq: [{ $year: "$createdAt" }, new Date().getFullYear()]
                }
            }
        },
        { 
            $group : { 
                _id : "tot_cash", 
                amount : { $sum : "$total_amount" } 
            }
        }]
    );

    const credit_tot_payment = await invoiceModel.aggregate(
        [{ 
            $match : {
                $and: [
                    { isCredit: true },
                    { isValid: true }
                ],
                $expr: {
                    $eq: [{ $year: "$createdAt" }, new Date().getFullYear()]
                }
            }
        },
        { 
            $group : { 
                _id : "tot_credit", 
                amount : { $sum : "$total_amount" } 
            }
        }]
    );

    async function findMonthActivities(invoiceModel){
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    
        const activities = months.map(async (month, index) => {
            const cash = await invoiceModel.aggregate(
                [{ 
                    $match : {
                        $and: [
                            { isCredit: false },
                            { isValid: true }
                        ],
                        $expr: {
                            $and: [
                                { $eq: [{$month: "$createdAt"}, index + parseInt(1)] },
                                { $eq: [{ $year: "$createdAt" }, new Date().getFullYear()] }
                            ]
                        }
                    }
                },
                { 
                    $group : { 
                        _id : "cash", 
                        amount : { $sum : "$total_amount" } 
                    }
                }]
            );

            const credit = await invoiceModel.aggregate(
                [{ 
                    $match : {
                        $and: [
                            { isCredit: true },
                            { isValid: true }
                        ],
                        $expr: {
                            $and: [
                                { $eq: [{$month: "$createdAt"}, index + parseInt(1)] },
                                { $eq: [{ $year: "$createdAt" }, new Date().getFullYear()] }
                            ]
                        }
                    }
                },
                { 
                    $group : { 
                        _id : "credit", 
                        amount : { $sum : "$total_amount" } 
                    }
                }]
            );
    
            return {
                index,
                name: month,
                cash : (cash.find(o => o._id === 'cash'))?.amount || 0,
                credit: (credit.find(o => o._id === 'credit'))?.amount || 0
            }
        })
    
        return Promise.all(activities)
       
    }

    const best_clients = await invoiceModel.aggregate(
        [{ 
            $match : {
                $and: [
                    { buyer_category: 'regular'},
                    {isValid: true}
                ],
                $expr: {
                    $eq: [{ $year: "$createdAt" }, new Date().getFullYear()]
                }
            }
        },
        { 
            $group : { 
                _id : "$buyer_name", 
                count : { $sum : 1 } 
            }
        },
        {
            $sort : { "count" : -1 }
        }
    ]
    );

    const best_selling_products = await saleModel.aggregate(
        [{ 
            $match : {
                $expr: {
                    $eq: [{ $year: "$createdAt" }, new Date().getFullYear()]
                }
            }},
            { 
                $group : { 
                    _id : {
                        product: "$product",
                        designation: "$designation"
                    }, 
                    count : { $sum : 1 } 
                },
            }, 
            {
                $sort : { "count" : -1 }
            }
        ]
    );

    const best_selling = best_selling_products?.map(obj => {
        return { _id: obj._id.product, designation : obj._id.designation, count: obj.count}
    })

    const response = {
        tot_debt_client : (tot_debt_client.find(o => o._id === 'creances'))?.amount,
        tot_debt_provider: (tot_debt_provider.find(o => o._id === 'dettes'))?.amount,
        solde,
        cash_tot_payment : (cash_tot_payment.find(o => o._id === 'tot_cash'))?.amount,
        credit_tot_payment : (credit_tot_payment.find(o => o._id === 'tot_credit'))?.amount,
        best_clients: best_clients?.slice(0,5).map(data => { return { ...data, _id: data._id?.split(' ')[0]?.concat(' ', data._id?.split(' ')[1]?.substring(0,1) || '')}}),
        sum_sales_products: best_selling?.reduce((a, b) => a + (b['count'] || 0), 0),
        best_selling_products : best_selling?.slice(0,8),
        activities: await findMonthActivities(invoiceModel)
    }

    return res.status(200).send(response)
}