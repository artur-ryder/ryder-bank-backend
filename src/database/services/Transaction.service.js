const TransactionModel = require('../models/Transaction.model')

const UserService = require('./User.service')

function TransactionService () {
    async function createTransaction(payerUsername, receiverUsername, amount) {
        if (!payerUsername || !receiverUsername || !amount) {
            return "Missing a field. [ payerId, receiverId, amount ]"
        }
        if (amount < 1) return "Invalid amount"
        if (payerUsername === receiverUsername) {
            return "You can not transfer money to yourself."
        }

        const payer = await UserService.getUserByUsername(payerUsername)
        const receiver = await UserService.getUserByUsername(receiverUsername)

        if(!payer || !receiver) return "The provided users does not exist."

        const payerOldBalance = payer.balance
        const receiverOldBalance = receiver.balance

        if ( payerOldBalance - amount < 0 ) return "The payer doesn't have enough balance."

        const payerNewBalance = payerOldBalance - amount;
        const receiverNewBalance = receiverOldBalance + amount;

        await UserService.setBalance(payerUsername, payerNewBalance)
        await UserService.setBalance(receiverUsername, receiverNewBalance)

        // Log Transaction to Historic
        await TransactionModel.create({
            payer: payerUsername,
            receiver: receiverUsername,
            amount: amount
        })

        console.log(`[DATABASE - TRANSACTIONS] ${payerUsername} transfered ${amount} to ${receiverUsername}`)

        return {};
    }

    async function getTransactionsFromUsername(username) {
        if (!username) return "Please provide an username."

        const user = await UserService.getUserByUsername(username);
        if (!user) return "The user provided does not exist."

        const transactions = await TransactionModel.find({$or: [
            {payer: username},
            {receiver: username}
        ]})

        return transactions.map(transaction => {
            if(transaction.payer == username) {
                transaction.payer = "You"
                transaction.amount = transaction.amount * -1
            }
            else {
                transaction.receiver = "You"
            }

            return transaction
        })

    }

    // async function revertTransaction(transactionId) {

    //     const oldTransaction = await TransactionModel.findById(transactionId)
    //     if(!oldTransaction) return("Invalid Transaction ID.")

    //     const payerBalance = await UserService.getBalance(payer)
    //     const receiverBalance = await UserService.getBalance(receiver)

    //     if ( receiverBalance - oldTransaction.amount < 0) return "Receiver balance invalid."

    //     await UserService.setBalance(oldTransaction.payer, payerBalance + oldTransaction.amount)
    //     await UserService.setBalance(oldTransaction.receiver, receiverBalance - oldTransaction.amount)

    //     // Log Transaction to Historic
    //     const newTransaction = await TransactionModel.create({
    //         payer: oldTransaction.receiver,
    //         receiver: oldTransaction.payer,
    //         amount: oldTransaction.amount
    //     })

    //     return newTransaction;
    // }

    return {
        createTransaction,
        getTransactionsFromUsername,
        // revertTransaction
    }
}

module.exports = TransactionService()