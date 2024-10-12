const mongoose = require("../connection");

const transactionSchema = new mongoose.Schema({
    payer: {type: String, required: true},
    receiver: {type: String, required: true},
    amount: {type: Number, required: true, default: 3000},
    createdAt: {type: Date, default: Date.now}
})

const TransactionModel = mongoose.model('Transaction', transactionSchema, 'transactions');

module.exports = TransactionModel