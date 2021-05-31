const mongoose = require ("mongoose")

const userschema = new mongoose.Schema({
    name: String,
    password: String,
    email: String,
    balanta: Number
});

const User = mongoose.model('user', userschema);

module.exports = User;