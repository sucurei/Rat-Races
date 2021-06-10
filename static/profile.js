function update_user(json){
    let el = json[0];
    document.getElementById("nume").innerText = 'Name: ' + el['name'];
    localStorage.setItem("user_id", el["_id"])
    document.getElementById("id").innerText = 'ID: ' + el['_id'];
    document.getElementById("balanta").innerText = 'Balanta: ' + el['balanta'] + ' RONI';

    fetch('/userbets?id=' + localStorage.getItem("user_id"),{
        method: 'GET',
        headers: {
            "X-Auth-Token" : getToken(document.cookie)
        }
    }).then(
        response => response.json()
    ).then(json => update_races(json))
}

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
};

console.log(getToken(document.cookie))

function getToken (cookies) {
    var token = cookies.split('=')[1];
    return token;
}

fetch('/users?name=Robert' + '',{
        method: 'GET',
        headers: {
            "X-Auth-Token" : getToken(document.cookie)
        }
    }).then(
    response => response.json()
).then(json => update_user(json))


function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
};

function closure(string) {
    return '"' + string + '"';
}

function saveHTML(filename) {
    let data = (new XMLSerializer().serializeToString(document))
    data = data.replace('<link rel="stylesheet" href="profile.css" />', `<style>${stylesheet}</style>`)
    console.log(data)
    if(!filename) filename = 'console.json'

    var blob = new Blob([data], {type: 'text/html'}),
        e    = document.createEvent('MouseEvents'),
        a    = document.createElement('a')

    a.download = filename
    a.href = window.URL.createObjectURL(blob)
    a.dataset.downloadurl =  ['text/html', a.download, a.href].join(':')
    e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
    a.dispatchEvent(e)
}

function saveCSV(data, filename) {
    const items = data
    const replacer = (key, value) => value === null ? '' : value // specify how you want to handle null values here
    const header = Object.keys(items[0])
    console.log(header);
    const csv = [
    header.join(','), // header row first
    ...items.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','))
    ].join('\r\n')

    console.log(csv)

    if(!filename) filename = 'console.csv'

    var blob = new Blob([csv], {type: 'text/csv'}),
        e    = document.createEvent('MouseEvents'),
        a    = document.createElement('a')

    a.download = filename
    a.href = window.URL.createObjectURL(blob)
    a.dataset.downloadurl =  ['text/csv', a.download, a.href].join(':')
    e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
    a.dispatchEvent(e)
}

function saveJSON(data, filename){

    if(!data) {
        console.error('No data')
        return;
    }

    if(!filename) filename = 'console.json'

    if(typeof data === "object"){
        data = JSON.stringify(data, undefined, 4)
    }

    var blob = new Blob([data], {type: 'text/json'}),
        e    = document.createEvent('MouseEvents'),
        a    = document.createElement('a')

    a.download = filename
    a.href = window.URL.createObjectURL(blob)
    a.dataset.downloadurl =  ['text/json', a.download, a.href].join(':')
    e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
    a.dispatchEvent(e)
}

var rk = undefined;


function update_races(races){
    rk = races;
    for (var l of races){
        console.log(l)
        var raceName = l["raceName"]
        var ratName = l["ratName"]
        var betSize = l["betSize"]
        // var time = l["time"]["hour"] + ":" + l["time"]["minutes"]       
        document.getElementById("curse").innerHTML += `
    <div class="race">
                <div class="name">
                    ${raceName}
                </div>
                <div class="date">
                    Shobo: ${ratName}
                </div>
                <div class="date">
                    Bet size: ${betSize}

                </div>
                <div class="nr-of-shobo">
                    shoboCount=6
                </div>
            </div>
    
    `
    }
    
}



const stylesheet = `
body{
    margin: 0em;
    overflow-x: hidden;
}

.page{
    height: 100vh;
    width: 100%;
    display: grid;
    grid-template-rows: 12% 78% 10%;
    overflow-x: hidden;
    overflow-y: hidden;
}

.header{
    background: #1abc9c;
    color: white;
    font-size: 2em;
    display: grid;
    grid-template-columns: 70% 30%;
}

.content{
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-rows: 50% 50%;
}

.race{
    background-color: white;
    display: flex;
    justify-content: space-between;
    /*border: none;*/
    border-width: 3px;
    border-color: black;
    border-radius: 2em;
    padding: 2em;
    width: 90%;
    margin-top: 1em;
    margin-bottom: 1em;
}

.footer{
    background-color: black;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
}

.rectangle{
    background-color: gray;
    display: flex;
    align-items: center;
    flex-direction: column;
    height: 100%;
    width: 100%;
    overflow-y: scroll;
}

::-webkit-scrollbar{
    width: 0.5em;
}

::-webkit-scrollbar-track{
    background:wheat;
}

::-webkit-scrollbar-thumb{
    background: gray;
}

.name{
    font-size: 2em;
    text-align: center;
}

.date{
    font-size: 1.5em;
    text-align: center;
}

.nr-of-shobo{
    font-size: 2em;
    color:gray;
    text-align: center;
}

.btn{
    background-color: green;
    color: #ffff;
    border-radius: 1em;
    border: none;
    margin-top: 0.2em;
    margin-bottom: 0.2em;
    margin-left: 0.2em;
    margin-right: 0.2em;
    width: 10em;
    height: 100%;
    padding-top: 0.5em;
    padding-bottom: 0.5em;
    font-size: 2em;
}

.btn2 {
    width: 5em;
    font-size: 1em;
    height: 20%;
}

.logo{
    margin: 0.45em;
    width: 6%;
    height: auto;
}

a{
    text-decoration: none;
}

.links{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding:0.5em;
}

.profile{
    display:grid;
    grid-template-columns: 33% 67%;
}

.icon{
    width: 50%;
    height: auto;
}
.picture{
    display: flex;
    justify-content: center;
    align-items: center;
}

p{
    font-size: 1.5em;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;

}
`