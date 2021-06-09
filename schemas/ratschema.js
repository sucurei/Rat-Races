const mongoose = require ("mongoose")

const ratschema = new mongoose.Schema({
    name : String,
    wins : Number,
    races : Number
})

const Rat = mongoose.model('rat', ratschema);

module.exports = Rat