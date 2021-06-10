const mongoose = require ("mongoose")

const betschema = new mongoose.Schema({
    userId : String,
    raceName : String,
    ratName : String,
    betSize : Number
})

const Bet = mongoose.model('bet', betschema);

module.exports = Bet