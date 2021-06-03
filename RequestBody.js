const url = require('url')
const querystring = require('querystring')

let parseBodyFormData = (body) => {
    const lines = body.split("\r\n");
    const separtor = lines[0];
    const properties = body.split(separtor);
    properties.pop();
    properties.shift();
    let returnObj = {}

    for (let prop of properties) {
        const proplines = prop.split("\r\n");
        proplines.shift();
        let key = proplines[0].split("name=")[1];
        key = key.replace(/\"/gi, "");
        console.log("key", key)
        const value = proplines[2];
        returnObj[key] = value;
    }

    return returnObj;
}


class RequestBody {
    method
    path
    qsParams 
    formData
    constructor(req) {
        this.method = req.method
        req.url = url.parse(req.url)
        this.path = req.url.pathname

        this.qsParams = querystring.parse(req.url.query)
        
        if (req.body !== undefined)
            this.formData = querystring.parse(req.body)

        //
    }

    
}

module.exports = RequestBody