const express = require('express')
const router = express.Router()

const TransactionService = require('../database/services/Transaction.service')

router.use((req, res, next) => {
    if (!req.user) {
        res.statusCode = 400
        return res.json({
            "error": "You must be logged in to make transferences."
        })
    }

    next();
})

router.get('/', async (req, res) => {
    res.json(await TransactionService.getTransactionsFromUsername(req.user.username))
})

router.post('/create', async (req, res) => {
    const body = req.body;

    // Check if both fields are sent
    if(!body.receiver || !body.amount) {
        res.statusCode = 400
        return res.json({error: "Invalid body. Must provide receiver Username and amount."})
    }

    body.amount = Number(body.amount)

    const transaction = await TransactionService.createTransaction(
        req.user.username, 
        body.receiver, 
        body.amount
    )

    if (typeof transaction == 'string') {
        res.statusCode = 400
        return res.json({error: transaction})
    }
    
    res.json({
        message: `Successfully transfered R$ ${body.amount} to ${body.receiver}.`
    })

})

module.exports = router