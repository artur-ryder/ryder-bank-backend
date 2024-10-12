const mongoose = require("../connection");
const bcrypt = require("bcryptjs")

const userSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    balance: {type: Number, required: false, default: 3000},
    createdAt: {type: Date, default: Date.now}
})

// Middleware to 
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

const User = mongoose.model('User', userSchema, 'users');

module.exports = User