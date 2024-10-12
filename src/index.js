require('dotenv').config()

const express = require("express")
const app = express();
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser');
const port = 4000

const userRouter = require('./Routes/users');
const transactionRouter = require('./Routes/transactions')

console.log("[SERVER] Starting...")

if (!process.env.JWT_SECRET) {
    throw new Error("[SERVER] You must provide JWT_SECRET on .env.")
}

// Config JSON Body
app.use(express.json())
app.use(express.urlencoded({extended: true}))

// Config Cookies
app.use(cookieParser())

// JWT Authentication
app.use((req, res, next) => {
    const token = req.cookies.authorization;

    if(!token) return next()

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return console.log(err)
        }

        req.user = user
    })

    next()
})

// Use Router
app.use('/users', userRouter)
app.use('/transactions', transactionRouter)

app.use('/**', (req, res) => {
    res.statusCode = 404
    res.send("Not Found.")
})

app.listen(port, () => {
    console.log("[SERVER] Started on port " + port)
})