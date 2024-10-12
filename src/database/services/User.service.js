const UserModel = require("../models/User.model")
const bcrypt = require('bcryptjs')

function UserService () {
    async function createUser(username, password) {

        if ( username == "" || password == "" ) return "Invalid body. Must provide username and password."
        if ( username.length < 3 ) return "Invalid body. Username is too small."

        if ( await UserModel.findOne({username: username}) ) return "User already exists."

        const user = await UserModel.create({
            username: username, 
            password: password
        })

        console.log("[DATABASE - USER] Created user " + username);

        return user;
    }
    
    async function getUserByUsername(username) {
        if ( username == "" ) return

        const user = await UserModel.findOne({
            username: username
        })

        return user
    }

    async function getUserById(id) {
        if ( id == "" ) return

        const user = await UserModel.findById(id)

        return user
    }

    async function getBalance(username){
        if ( username == "" ) return

        const userBalance = (await UserModel.findOne({username})).balance

        return userBalance
    }

    async function setBalance(username, amount){
        if ( username == "" ) return

        const user = await UserModel.updateOne({username: username}, {balance: amount})

        return user
    }

    async function chekIfUserIsExists(username, password){
        if ( username == "" ) return false

        // get user from database
        const user = await UserModel.findOne({
            username
        })

        // Check if user is valid
        if (!user) return false

        return true
    }

    async function chekIfUserIsValid(username, password){
        if ( username == "" ) return false

        // get user from database
        const user = await UserModel.findOne({
            username
        })

        // Check if user is valid
        if (!user) return false
        
        // Check if the password provided is the same as the user's and return the result
        if (!await bcrypt.compare(password, user.password)) {
            return false
        }

        return true
    }

    async function deleteUserByUsername(username, password) {
        if ( username == "" ) return

        // get user from database
        const user = await UserModel.findOne({
            username
        })

        // Check if user is valid
        if (!user) return "Icorrect Username or Password."
        
        // Check if the password provided is the same as the user's and return the result
        if (!await bcrypt.compare(password, user.password)) {
            return "Icorrect Username or Password."
        }

        const success = await UserModel.deleteOne({
            username: username
        })

        return success

    }

    return {
        createUser,
        getUserByUsername,
        getUserById,
        getBalance,
        setBalance,
        chekIfUserIsExists,
        chekIfUserIsValid,
        deleteUserByUsername
    }
}

module.exports = UserService()