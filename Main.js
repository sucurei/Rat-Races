const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://123:123@cluster0.ru79j.mongodb.net/db?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});
const App = require('./App')
const RequestBody = require('./RequestBody')
const User = require('./schemas/userschema')
const PORT = 5000

const JSONheader = {'Content-Type': 'application/json; charset=UTF-8', 'Access-Control-Allow-Origin': '*'}

const app = new App(5000)

app.get('/users', async (req, res) => {
    // TODO verific daca am QS
    // ?username=:name&password=:pass
    res.writeHead(200, JSONheader)


    let extractedParams = new RequestBody(req)
    await User.find({ name : extractedParams.qsParams["name"] })
        .lean().exec(function (err, users) {
            if (err != null && users != undefined)
            {
                console.log(users)
                res.end(JSON.stringify(users));
            }
            else
            {
                console.log(extractedParams.qsParams);
                res.end('');
            }
    })
})

app.post('/signup', (req,res) => {
    let cacat = "";
    req.on("data",(data) => {
        cacat += data;
    })

    req.on("end", async () => {
        req.body = cacat

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

app.post('/otherroute', (req, res) => {
    res.writeHead(200, JSONheader)
    res.write('hello from other route')
    res.end()
})

app.startServer(() => {
    console.log(`Server started on port ${PORT}! Enjoy!`)
})