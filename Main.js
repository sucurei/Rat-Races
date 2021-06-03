const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://123:123@cluster0.ru79j.mongodb.net/db?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});
const App = require('./App')
const JWTHelper = require('./JWTHelper')
const RequestBody = require('./RequestBody')
const User = require('./schemas/userschema')
const PORT = 5000

const JSONheader = {'Content-Type': 'application/json; charset=UTF-8', 'Access-Control-Allow-Origin': '*'}

const app = new App(5000)

app.get('/users', async (req, res) => {
    res.writeHead(200, JSONheader)


    let extractedParams = new RequestBody(req)
    await User.find({ name : extractedParams.qsParams["name"] })
        .lean().exec(function (err, users) {
            if (err === null && users !== undefined)
            {
                console.log(users)
                if (JWTHelper.MiddlewareAuthTokenValidation(req, res)) {
                    let authTokenPayload = JWTHelper.GetAuthTokenPayload(req)
                    if (authTokenPayload["name"] === extractedParams.qsParams["name"]) {
                        res.write(JSON.stringify(users))
                    }
                }
            }
            else
            {
                console.log(extractedParams.qsParams);
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
        res.writeHead(200, JSONheader)
        res.write('merge :D')

        const user = new User({ name: extractedParams.name, password: extractedParams.password, email: extractedParams.email, balanta:1000 });
        user.save(function (err, fluffy) {
            if (err) 
                return console.error(err);
            
        });
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
        res.writeHead(200, JSONheader)

        await User.find({ name : extractedParams["name"], password : extractedParams["password"] })
            .lean().exec(function (err, users) {
                if (err === null && users !== undefined)
                {
                    console.log(users)
                    let authJWT = JWTHelper.GetTokenFromPayload({ name : extractedParams["name"] } , 60 * 60 * 10)
                    console.log(authJWT)
                    console.log(JWTHelper.GetPayloadFromToken(authJWT))
                    res.end(JSON.stringify(authJWT));
                }
                else
                {
                    console.log(extractedParams.qsParams);
                    res.end('');
                }
            })
    })
})

app.startServer(() => {
    console.log(`Server started on port ${PORT}! Enjoy!`)
})