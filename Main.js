const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://123:123@cluster0.ru79j.mongodb.net/db?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});

const App = require('./App')
const JWTController = require('./JWTController')
const RequestBody = require('./RequestBody')

const User = require('./schemas/userschema')
const Race = require('./schemas/raceschema')
const Rat = require('./schemas/ratschema')
const Bet = require('./schemas/betschema')
const PORT = 5000

const JSONheader = {'Content-Type': 'application/json; charset=UTF-8', 'Access-Control-Allow-Origin': '*'}

const app = new App(5000)

app.get('/users', async (req, res) => {
    res.writeHead(200, JSONheader)

    await User.find({ name : JWTController.getAuthToken(req)["name"] })
        .lean().exec(function (err, users) {
            if (err === null && users !== undefined)
            {
                console.log(users)
                console.log(req.headers)
                if (JWTController.authTokenValid(req, res)) {                    
                    res.end(JSON.stringify(users))
                }
            }
            else
            {
                res.end('');
            }
    })
})

app.post('/signup', (req,res) => {
    let bodyFormat = "";
    req.on("data",(data) => {
        bodyFormat += data;
    })

    req.on("end", async () => {
        req.body = bodyFormat

        let extractedParams = (new RequestBody(req)).formData
        
        let usersList = await User.find({ name : extractedParams["name"] }).lean().exec()
        
        if (usersList.length) {
            res.writeHead(200, JSONheader)
            res.end("Username deja folosit")
            return
        }

        if (extractedParams["password"] !== extractedParams["cpassword"])
        {
            res.writeHead(200, JSONheader)
            res.end("Parola nu se potriveste")
            return
        }

        const user = new User({ name: extractedParams["name"], password: extractedParams["password"], email: extractedParams["email"], balanta : 1000 });
        user.save(function (err, fluffy) {
            if (err){
                res.writeHead(200, JSONheader)
                console.error(err);
                res.end(err);
            }

        });
        let authJWT = JWTController.getTokenWithPayload({ name : extractedParams["name"] } , 60 * 60 * 10)
        res.writeHead(302, {
            "Location": "/races.html",
            "Set-Cookie" : "token=" + authJWT + "; Path=/"
        })
        res.end()
    })
})

app.post('/login', (req, res) => {
    let bodyFormat = "";
    req.on("data",(data) => {
        bodyFormat += data;
    })

    req.on("end", async () => {
        req.body = bodyFormat

        let extractedParams = (new RequestBody(req)).formData

        await User.find({ name : extractedParams["name"], password : extractedParams["password"] })
            .lean().exec(function (err, users) {
                if (err === null && users !== undefined)
                {
                    console.log(users)
                    let authJWT = JWTController.getTokenWithPayload({ name : extractedParams["name"] } , 60 * 60 * 10)
                    console.log(authJWT)
                    console.log(JWTController.extractPayloadFromToken(authJWT))
                    res.writeHead(302, {
                        "Location" : "/races.html",
                        "Set-Cookie" : "token=" + authJWT + "; Path=/"
                    })
                    res.end();
                }
                else
                {
                    console.log(extractedParams.qsParams);
                    res.end('');
                }
            })
    })
})

////////////////////////////////////////////////////////////////////////////////////////////////////    RATS

app.post('/addRat', (req, res) => {
    res.writeHead(200, JSONheader)

    let extractedParams = new RequestBody(req)

    const newRat = new Rat( { name : extractedParams.qsParams["name"], wins : 0, races : 0 })

    newRat.save(function (err, fluffy) {
        if (err)
            return console.error(err);
    });

    console.log(JSON.stringify(newRat))

    res.end(JSON.stringify(newRat))
})

app.get('/allRats', async (req, res) => {
    res.writeHead(200, JSONheader)

    await Rat.find().lean().exec(function (err, rats) {
        res.end(JSON.stringify(rats))
    })
})

app.get('/ratProfile', async (req, res) => {
    res.writeHead(200, JSONheader)

    let extractedParams = new RequestBody(req)

    await Rat.find({ name : extractedParams.qsParams["name"] }).lean().exec(function (err, rat) {
        res.end(JSON.stringify(rat))
    })

    // await Race.find({ rats : { $elemMatch : { name : extractedParams.qsParams["name"] } } }).lean().exec(function (err, races) {
    //     res.end(JSON.stringify(races))
    // })
})

app.get('/ratraces', async (req, res) => {
    res.writeHead(200, JSONheader)

    let extractedParams = new RequestBody(req)

    // await Rat.find({ name : extractedParams.qsParams["name"] }).lean().exec(function (err, rat) {
    //     res.end(JSON.stringify(rat))
    // })

    await Race.find({ rats : extractedParams.qsParams["name"]}).lean().exec(function (err, races) {        
        res.end(JSON.stringify(races))
    })
})


////////////////////////////////////////////////////////////////////////////////////////////////////   RACES


app.post('/addRace', async (req, res) => {
    res.writeHead(200, JSONheader)

    let extractedParams = new RequestBody(req)

    console.log(extractedParams)
    console.log(extractedParams.qsParams["date"].split('/')[0])

    let newDate = {
        day : Number(extractedParams.qsParams["date"].split('/')[0]),
        month : Number(extractedParams.qsParams["date"].split('/')[1]),
        year : Number(extractedParams.qsParams["date"].split('/')[2]),
    }

    let newTime = {
        hour : Number(extractedParams.qsParams["time"].split(':')[0]),
        minutes : Number(extractedParams.qsParams["time"].split(':')[1])
    }

    let ratsList = []

    let rats = await Rat.find().lean().exec()

    let i = 0

    while (i < 6) {
        let index = Math.floor(Math.random() * rats.length)
        if (!ratsList.includes(rats[index].name)) {
            i++;
            ratsList.push(rats[index].name)
        }
    }

    console.log(JSON.stringify(ratsList))

    const newRace = new Race({name : extractedParams.qsParams["name"], date : newDate, time : newTime, rats : ratsList, finished : 0 })

    newRace.save(function (err, fluffy) {
        if (err)
            return console.error(err);
    });

    res.end(JSON.stringify(newRace))
})

app.get('/allRaces', async (req, res) => {
    res.writeHead(200, JSONheader)

    await Race.find().lean().exec(function (err, races) {
        res.end(JSON.stringify(races))
    })
})

app.get('/races', async (req, res) => {
    res.writeHead(200, JSONheader)

    let currentD = new Date()
    let currentDate = {
        day : currentD.getDate(),
        month : currentD.getMonth() + 1,
        year : currentD.getFullYear()
    }

    let currentTime = {
        hour : currentD.getHours(),
        minutes : currentD.getMinutes()
    }

    await Race.find({ date : currentDate }).lean().exec(function (err, races) {
        console.log(':)')
        console.log(currentDate)
        res.end(JSON.stringify(races))
    })
})

////////////////////////////////////////////////////////////////////////////////////////////////////   BETS

app.post('/addBet', async (req, res) => {
    res.writeHead(200, JSONheader)

    let extractedParams = new RequestBody(req)

    if (!JWTController.authTokenValid(req, res)) {
        res.end("Nu esti logat")
        return
    }

    let authTokenPayload = JWTController.getAuthToken(req)

    let user = (await User.find({ name : authTokenPayload["name"] }).lean().exec())[0]

    if (user["balanta"] < extractedParams.qsParams["betSize"]) {
        res.end("Nu aveti destule fonduri")
        return
    }

    let newBet = new Bet({ userId : user["_id"], raceName : extractedParams.qsParams["raceName"], ratName : extractedParams.qsParams["ratName"], betSize : extractedParams.qsParams["betSize"] })

    newBet.save(function (err, fluffy) {
        if (err)
            return console.error(err);
    });

    console.log(user)

    user["balanta"] -= Number(extractedParams.qsParams["betSize"])

    User.updateOne({ _id : user["_id"] }, { balanta : user["balanta"] }, function (err, fluffy) {
        if (err)
            return console.error(err);
    })

    res.end(JSON.stringify(newBet))
})

app.get('/allBets', async (req, res) => {
    res.writeHead(200, JSONheader)

    await Bet.find().lean().exec(function (err, bets) {
        res.end(JSON.stringify(bets))
    })
})

app.get('/userbets', async (req, res) => {
    res.writeHead(200, JSONheader)

    let extractedParams = new RequestBody(req)

    const user_id = extractedParams.qsParams["id"]

    await Bet.find({userId: user_id}).lean().exec(function (err, bets) {
        res.end(JSON.stringify(bets))
    })
})

app.get('/logout', async (req, res) => {
    res.writeHead(302, {
        "Location": "/index.html",
        "Set-Cookie" : "token=; Path=/"
    })

    res.end()
})

app.startServer(() => {
    console.log(`Server started on port ${PORT}! Enjoy!`)
})