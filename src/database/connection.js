const mongoose = require("mongoose");
const URI = process.env.MONGO_DB_CONNECTION_URI

console.log("[DATABASE] Starting Connection...")

if (!URI) {
    throw new Error("MONGO_DB_CONNECTION_URI not provided on .env.");
}

mongoose.connect(URI).then(() => {
    console.log("[DATABASE] Connected SuccessFully!")
}).catch(err => {
    console.log("[DATABASE] Could not connect to the database.")
    console.log(err)
})

module.exports = mongoose
