const mongoose = require ("mongoose")

const betschema = new mongoose.Schema({
    userId : String,
    raceId : String,
    ratId : String,
    betSize : Number
})

const Bet = mongoose.model('bet', betschema);

module.exports = Bet