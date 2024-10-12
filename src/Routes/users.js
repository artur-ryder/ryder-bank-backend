const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')

const UserService = require('../database/services/User.service')

function generateToken (user){
    return jwt.sign({username: user.username}, process.env.JWT_SECRET, { expiresIn: '1h' })
}

router.get('/', async (req, res) => {

    if (!req.user) {
        res.statusCode = 403
        return res.json({"error": "You are not logged in."})
    }

    const username = req.user.username;

    const user = await UserService.getUserByUsername(username)

    if(!user) {
        return res.json({"error": "The user provided does not exist."})
    }

    res.json({
        username: user.username,
        balance: user.balance,
        createdAt: user.createdAt
    })
})

router.post("/login", async (req, res) => {
    const body = req.body;

    // Check if both fields are sent
    if(!body.username || !body.password) {
        res.statusCode = 400
        return res.json({"error":"Invalid body. Must have username and password."})
    }

    const userIsValid = await UserService.chekIfUserIsValid(body.username, body.password)

    if(!userIsValid) {
        res.statusCode = 400
        return res.json({"error":"Invalid Username or Password."})
    }

    res.cookie('authorization', generateToken({username: body.username}), {
        httpOnly: true,
        maxAge: 3600000
    })

    res.json({'Success': "true"})
})

router.get("/logout", (req, res) => {
    res.clearCookie("authorization");
    res.redirect("/login")
})

router.post("/create", async ( req, res ) => {
    const body = req.body;

    // Check if both fields are sent
    if(!body.username || !body.password) {
        return res.send("Invalid body. Must have username and password.")
    }

    // create user
    const user = await UserService.createUser(body.username, body.password)

    if (!user){
        res.statusCode = 400;
        return res.json({"error":`Error creating user ${body.username}.`})
    }

    res.cookie('authorization', generateToken({username: body.username}), {
        httpOnly: true,
        maxAge: 3600000
    })

    return res.json({
        "name": user.username,
        "balance": user.balance
    })
})

router.post("/delete", async ( req, res ) => {
    const body = req.body;

    console.log(req.user)

    // Chek if user is logged in
    if(!req.user){
        res.statusCode = 403;
        return res.send("You must be logged in to delete your account.")
    }
    // Check if both fields are sent
    if(!body.username || !body.password) {
        res.statusCode = 400;
        return res.send("Invalid body. Must have name and password.")
    }
    if(body.username != req.user.username){
        res.statusCode = 403;
        return res.send("You must be logged in to the account you want to delete.")
    }

    const isDeleted = await UserService.deleteUserByUsername(body.username, body.password)

    if (typeof isDeleted == 'string') res.statusCode = 400;

    return res.send(isDeleted)
})

module.exports = router