const http = require('http')
const url = require('url')
const fs = require('fs')

const User = require('./schemas/userschema')
const Race = require('./schemas/raceschema')
const Rat = require('./schemas/ratschema')
const Bet = require('./schemas/betschema')

const JWTController = require('./JWTController')


async function servestatic(req,res){
    req.url = url.parse(req.url)
    let filename = req.url.pathname
    let type = filename.split('.')[1]
    let header = undefined
    if (type === 'css')
        header = CSSheader 
    if (type === 'html')
        header = HTMLheader
    if (type === 'js')
        header = JSheader
    if (type === 'jpg')
        header = JPGheader
    if (type === 'png')
        header = PNGheader

    if ((type == "html" && filename != "/index.html" && filename != "/signup.html" && filename != "/races.html" && JWTController.authTokenValid(req, res)) 
        || (filename == "/index.html" || filename == "/signup.html" || filename == "/races.html" || type != "html")) {
        fs.readFile('static' + filename, {}, (error, data) => {
            if (error != null) {
                res.writeHead(404, JSONheader)
                res.end(JSON.stringify({'error' : `Action not found`}))
                return;
            }
    
            res.writeHead(200, header)        
            res.end(data)
            return;
        });
    }
}

const JSONheader = {'Content-Type': 'application/json; charset=UTF-8'}
const HTMLheader = {'Content-Type': 'text/html; charset=UTF-8'}
const CSSheader = {'Content-Type': 'text/css; charset=UTF-8'}
const JSheader = {'Content-Type': 'application/javascript; charset=UTF-8'}
const PNGheader = {'Content-Type': 'image/png'}
const JPGheader = {'Content-Type': 'image/jpeg'}

class App {
    startServer;
    get;
    post;
    put;
    delete;
    genericActionAdd;
    server;
    getAction;
    serverPort;
    // vector de actiuni pe care le fac in functie de req primit
    actionList = [];
    httpVerbs = ['GET', 'POST', 'PUT', 'DELETE']
    getActionKey = (req) => {
        let parsedURL = url.parse(req.url, true)
        return {
            method : req.method,
            path : parsedURL.pathname
        }
    }
    constructor(PORT) {
        this.serverPort = PORT;

        this.getAction = (givenKey) => {
            let action = this.actionList.find(key =>
                key.method === givenKey.method && key.path === givenKey.path
            )

            return action ? action.action : null
        }

        this.checkRaces = async () => {
            let currentDate = new Date()

            let unfinishedRaces = await Race.find({finished: 0}).lean().exec()
            for (const race of unfinishedRaces) {
                if (!((race["date"]["month"] <= currentDate.getMonth() + 1 && race["date"]["year"] <= currentDate.getFullYear()) &&
                    (race["date"]["day"] < currentDate.getDate()) ||
                    (race["date"]["day"] === currentDate.getDate() && (race["time"]["hour"] < currentDate.getHours() ||
                                                                       race["time"]["hour"] === currentDate.getHours() && race["time"]["minutes"] < currentDate.getMinutes())))) {

                    console.log("Cursele sunt up-to-date")
                    return;
                }

                let winnerName = race["rats"][Math.floor(Math.random() * 6)]

                let winnerRat = (await Rat.find({ name : winnerName }).lean().exec())[0]

                for (const ratName of race["rats"]) {
                    let result = (ratName === winnerName) ? 1 : 0

                    let rat = (await Rat.find({ name : ratName }).lean().exec())[0]

                    Rat.updateOne({ name : ratName }, { wins : rat["wins"] +
                            result, races : rat["races"] + 1}, function (err, fluffy) {
                        if (err)
                            return console.error(err);
                    })
                }

                let winBets = await Bet.find({ ratId : winnerRat["_id"]}).lean().exec()

                for (const bet of winBets) {
                    await User.find({ _id : bet["userId"] }).lean().exec(function (err, user) {
                        console.log(bet["betSize"])
                        console.log(user[0]["balanta"])
                        User.updateOne({ _id : user[0]["_id"] }, { balanta : user[0]["balanta"] + bet["betSize"] * 6 }, function (err, fluffy) {
                            if (err)
                                return console.error(err);
                        })
                    })
                }

                Race.updateOne({ _id : race["_id"] }, { finished : 1 }, function (err, fluffy) {
                    if (err)
                        return console.error(err);
                })
            }
        }


        this.server = http.createServer(async (req, res) => {
            let actionKey = this.getActionKey(req)

            if (this.httpVerbs.includes(actionKey.method) === false) {
                res.writeHead(500, JSONheader)
                res.end(JSON.stringify({'error' : `HTTP method ${actionKey.method} not supported`}))
                return
            }

            ////////////   check all races

            await this.checkRaces()

            let action = this.getAction(actionKey)   // action = lambda
            if (action != null)
                action(req, res)
            else  
                await servestatic(req, res)
        })

        this.startServer = (callbackOnServerListening) => {
            this.server.listen(this.serverPort, callbackOnServerListening)
        }

        this.get = (path, action) => {
            this.genericActionAdd('GET', path, action)
        }

        this.post = (path, action) => {
            this.genericActionAdd('POST', path, action)
        }

        this.put = (path, action) => {
            this.genericActionAdd('PUT', path, action)
        }

        this.delete = (path, action) => {
            this.genericActionAdd('DELETE', path, action)
        }

        this.genericActionAdd = (method, path, action) => {
            this.actionList.push({
                method : method,
                path : path,
                action : action
            })
            console.log(`${method}  ${path}`)
        }
    }

}

module.exports = App