function update_user(json){
    let el = json[0];
    document.getElementById("nume").innerText = 'Name: ' + el['name'];
    document.getElementById("wins").innerText = 'Curse Castigate: ' + el['wins'];
    document.getElementById("racecnt").innerText = 'Curse Participate: ' + el['races'];
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

fetch('/ratProfile?name=' + localStorage.getItem("nume_shobo"),{
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

console.log(getToken(document.cookie))

function getToken (cookies) {
    var token = cookies.split('=')[1];
    return token;
}

function update_races(races){
    for (var l of races){
        console.log(l)
        var name = l["name"]
        var time = l["time"]["hour"] + ":" + l["time"]["minutes"]
        var date = l["date"]["day"] + "/" + l["date"]["month"] + "/" + l["date"]["year"]
        document.getElementById("listacurse").innerHTML += `
    <div class="race">
                <div class="name">
                    ${name}
                </div>
                <div class="date">
                    ${date}
                </div>
                <div class="time">
                    ${time}
                </div>                 
                <div class="nr-of-shobo">
                    shoboCount=6
                </div>               
            </div>
    
    `
    }
    
}

fetch('/ratraces?name=' + localStorage.getItem("nume_shobo"),{
        method: 'GET',
        headers: {
            "X-Auth-Token" : getToken(document.cookie)
        }
    }).then(
    response => response.json()
).then(json => update_races(json))