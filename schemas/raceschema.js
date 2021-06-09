const mongoose = require ("mongoose")
const Rat = require('./ratschema')

const raceschema = new mongoose.Schema({
    name : String,
    date : Object,
    time : Object,
    rats : [ String ],
    finished : Number
})

const Race = mongoose.model('race', raceschema);

module.exports = Race