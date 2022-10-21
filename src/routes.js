const express = require('express');
const config = require('config')
const requireUser = require('./middlewares/requireUser');
const upload = require('./middlewares/uploadFiles');
const validate = require('./middlewares/validateResource');

const { createUserSessionHandler, getUserSessionsHandler, deleteSessionHandler, changePasswordHandler, verifyPassword } = require('./controllers/session.controller');
const { createUserHandler, updateUserHandler, getUserHandler, getLoggedInUserHanlder, updatePermissionsHandler, deleteUserHandler } = require('./controllers/user.controller');
const { createSessionSchema, checkPwdSchema, changePwdSchema} = require('./schemas/session.schema');
const { createUserSchema, updateUserSchema } = require('./schemas/user.schema');

const { createClientSchema, updateClientSchema, deleteClientSchema } = require('./schemas/client.schema');
const { createClientHandler, updateClientHandler, getClientHandler, deleteClientHandler } = require('./controllers/client.controller');

const { createDesignationSchema, updateDesignationSchema, deleteDesignationSchema } = require('./schemas/designation.schema');
const { createDesignationHandler, updateDesignationHandler, getDesignationHandler, deleteDesignationHandler } = require('./controllers/designation.controller');

const { createProviderSchema, updateProviderSchema, deleteProviderSchema } = require('./schemas/provider.schema');
const { createProviderHandler, updateProviderHandler, getProviderHandler, deleteProviderHandler } = require('./controllers/provider.controller');

const { createFinanceSchema, updateFinanceSchema, deleteFinanceSchema } = require('./schemas/finance.schema');
const { createFinanceHandler, updateFinanceHandler, getFinanceHandler, deleteFinanceHandler } = require('./controllers/finance.controller');

const { createInvoiceSchema, updateInvoiceSchema, cancelInvoiceSchema } = require('./schemas/invoice.schema');
const { createInvoiceHandler, updateInvoiceHandler, getInvoiceHandler, cancelInvoiceHandler, getTodayCashSales } = require('./controllers/invoice.controller');

const { createPurchaseSchema, updatePurchaseSchema, deletePurchaseSchema } = require('./schemas/purchase.schema');
const { createPurchaseHandler, updatePurchaseHandler, getPurchaseHandler, deletePurchaseHandler } = require('./controllers/purchase.controller');

const { createSaleSchema, updateSaleSchema, deleteSaleSchema } = require('./schemas/sale.schema');
const { createSaleHandler, updateSaleHandler, getSaleHandler, deleteSaleHandler } = require('./controllers/sale.controller');

const { createStockSchema, updateStockSchema, deleteStockSchema } = require('./schemas/stock.schema');
const { createStockHandler, updateStockHandler, getStockHandler, deleteStockHandler } = require('./controllers/stock.controller');

const { createTravelSchema, updateTravelSchema, deleteTravelSchema } = require('./schemas/travel.schema');
const { createTravelHandler, updateTravelHandler, getTravelHandler, deleteTravelHandler } = require('./controllers/travel.controller');
const { getResultReportHandler, getDashboardReportHandler } = require('./controllers/result.controller');
const { getResultSchema } = require('./schemas/result.schema');


function routes(app) {
    // express handling headers
    app.use((req, res, next) => {
        // res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Origin", config.get('origin'));
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
        if (req.method === 'OPTIONS') {
            res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
            return res.status(200).json({});
        }
        next();
    });

    app.get('/api/healthcheck', (req, res) => res.sendStatus(200))

    // ====================================
    // USER'S ROUTES
    // ====================================

    app.post('/api/users', [requireUser, validate(createUserSchema)], createUserHandler)
    app.get('/api/me', [requireUser], getLoggedInUserHanlder)
    app.patch('/api/users/:user_id', [requireUser, validate(updateUserSchema)],updateUserHandler)
    app.put('/api/users/:user_id/permissions', [requireUser, validate(updateUserSchema)], updatePermissionsHandler)
    app.get('/api/users/:user_id', requireUser, getUserHandler)
    app.delete('/api/users/:user_id', [requireUser], deleteUserHandler)

    // ====================================
    // SESSION'S ROUTES
    // ====================================
    app.post('/api/sessions', validate(createSessionSchema), createUserSessionHandler)
    app.post('/api/sessions/confirm-current-pwd', [requireUser, validate(checkPwdSchema)], verifyPassword)
    app.post('/api/sessions/change-password', [requireUser, validate(changePwdSchema)], changePasswordHandler)
    app.get('/api/sessions', requireUser, getUserSessionsHandler)
    app.delete('/api/sessions', requireUser, deleteSessionHandler)

    // ====================================
    // CLIENT'S ROUTES
    // ====================================
    app.post('/api/clients', [requireUser, validate(createClientSchema)], createClientHandler)
    app.patch('/api/clients/:client_id', [requireUser, validate(updateClientSchema)], updateClientHandler)
    app.get('/api/clients/:client_id', requireUser, getClientHandler)
    app.delete('/api/clients/:client_id', [requireUser, validate(deleteClientSchema)], deleteClientHandler)

    // ====================================
    // DESIGNATION'S ROUTES
    // ====================================
    app.post('/api/motives', [requireUser, validate(createDesignationSchema)], createDesignationHandler)
    app.patch('/api/motives/:designation_id', [requireUser, validate(updateDesignationSchema)], updateDesignationHandler)
    app.get('/api/motives/:designation_id', requireUser, getDesignationHandler)
    app.delete('/api/motives/:designation_id', [requireUser, validate(deleteDesignationSchema)], deleteDesignationHandler)

     // ====================================
    // PROVIDER'S ROUTES
    // ====================================
    app.post('/api/providers', [requireUser, validate(createProviderSchema)], createProviderHandler)
    app.patch('/api/providers/:provider_id', [requireUser, validate(updateProviderSchema)], updateProviderHandler)
    app.get('/api/providers/:provider_id', requireUser, getProviderHandler)
    app.delete('/api/providers/:provider_id', [requireUser, validate(deleteProviderSchema)], deleteProviderHandler)

    // ====================================
    // FINANCE'S ROUTES
    // ====================================
    app.post('/api/finances', [requireUser, validate(createFinanceSchema)], createFinanceHandler)
    app.patch('/api/finances/:finance_id', [requireUser, validate(updateFinanceSchema)], updateFinanceHandler)
    app.get('/api/finances/:finance_id', requireUser, getFinanceHandler)
    app.delete('/api/finances/:finance_id', [requireUser, validate(deleteFinanceSchema)], deleteFinanceHandler)

    // ====================================
    // INVOICE'S ROUTES
    // ====================================
    app.post('/api/invoices', [requireUser, validate(createInvoiceSchema)], createInvoiceHandler)
    app.post('/api/invoices/today-cash', requireUser, getTodayCashSales)
    app.patch('/api/invoices/:invoice_id', [requireUser, validate(updateInvoiceSchema)], updateInvoiceHandler)
    app.get('/api/invoices/:invoice_id', requireUser, getInvoiceHandler)
    app.put('/api/invoices/:invoice_id', [requireUser, validate(cancelInvoiceSchema)], cancelInvoiceHandler)
   

    // ====================================
    // PURCHASE'S ROUTES
    // ====================================
    app.post('/api/purchases', [requireUser, validate(createPurchaseSchema)], createPurchaseHandler)
    app.patch('/api/purchases/:purchase_id', [requireUser, validate(updatePurchaseSchema)], updatePurchaseHandler)
    app.get('/api/purchases/:purchase_id', requireUser, getPurchaseHandler)
    app.delete('/api/purchases/:purchase_id', [requireUser, validate(deletePurchaseSchema)], deletePurchaseHandler)

    // ====================================
    // SALE'S ROUTES
    // ====================================
    app.post('/api/sales', [requireUser, validate(createSaleSchema)], createSaleHandler)
    app.patch('/api/sales/:sale_id', [requireUser, validate(updateSaleSchema)], updateSaleHandler)
    app.get('/api/sales/:sale_id', requireUser, getSaleHandler)
    app.delete('/api/sales/:sale_id', [requireUser, validate(deleteSaleSchema)], deleteSaleHandler)

    // ====================================
    // STOCK'S ROUTES
    // ====================================
    app.post('/api/stocks', [requireUser, validate(createStockSchema)], createStockHandler)
    app.patch('/api/stocks/:stock_id', [requireUser, validate(updateStockSchema)], updateStockHandler)
    app.get('/api/stocks/:stock_id', requireUser, getStockHandler)
    app.delete('/api/stocks/:stock_id', [requireUser, validate(deleteStockSchema)], deleteStockHandler)


    // ====================================
    // TRAVEL'S ROUTES
    // ====================================
    app.post('/api/travels', [requireUser, validate(createTravelSchema)], createTravelHandler)
    app.patch('/api/travels/:travel_id', [requireUser, validate(updateTravelSchema)], updateTravelHandler)
    app.get('/api/travels/:travel_id', requireUser, getTravelHandler)
    app.delete('/api/travels/:travel_id', [requireUser, validate(deleteTravelSchema)], deleteTravelHandler)


    // ====================================
    // RESULT'S ROUTES
    // ====================================
    app.post('/api/reports/result', [requireUser, validate(getResultSchema)], getResultReportHandler)
    app.post('/api/reports/dashboard', [requireUser, validate(getResultSchema)], getDashboardReportHandler)



    app.use('/uploads', requireUser, express.static('uploads'));

    // Error handling
    app.use((req, res, next) => {
        const error = new Error('url not found');
        error.status = 404;
        next(error);
    });

    app.use((error, req, res, next) => {
        res.status(error.status || 500).json({
            success: false,
            message: error.message,
        });
    });
}

module.exports = routes