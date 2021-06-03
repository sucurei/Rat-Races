const http = require('http')
const url = require('url')
const fs = require('fs')


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
    fs.readFile('static' + filename, {}, (error, data) => {
        if (error != null) {
            res.writeHead(404, JSONheader)
            res.end(JSON.stringify({'error' : `Action not found`}))
            return;
        }

        res.writeHead(200, header)
        console.log(data)
        res.end(data)
        return;
    });
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
        this.server = http.createServer(async (req, res) => {
            let actionKey = this.getActionKey(req)

            if (this.httpVerbs.includes(actionKey.method) === false) {
                res.writeHead(500, JSONheader)
                res.end(JSON.stringify({'error' : `HTTP method ${actionKey.method} not supported`}))
                return
            }

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