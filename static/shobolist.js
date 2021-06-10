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

function gotoshobo(name){
    localStorage.setItem("nume_shobo", name)
    window.location = "http://localhost:5000/rats.html"
}

function update_races(races){
    for (var l of races){
        console.log(l)
         var name = l["name"]
         var races = l["races"]
         var wins = l["wins"]
        document.getElementById("curse").innerHTML += `
    <div class="race">
                <div class="name">
                    ${name}
                </div>
                <div class="date">
                    races = ${races}
                </div>
                <div class="nr-of-shobo">
                    wins = ${wins}
                </div>
                <button type="button" class="btn" onclick='gotoshobo("${name}")'>
                    pariaza
                </button>
            </div>
    
    `
    }
    
}

fetch('/allRats' + '',{
        method: 'GET',
        headers: {
            "X-Auth-Token" : getToken(document.cookie)
        }
    }).then(
    response => response.json()
).then(json => update_races(json))