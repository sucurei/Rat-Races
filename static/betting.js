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

function showRats() {
    document.getElementById("raceName").innerHTML = "Pariaza la cursa " + localStorage.getItem("nume_cursa")
    document.getElementById("dateAndOra").innerHTML = localStorage.getItem("data") + " ora " + localStorage.getItem("timp")

    let ratsList = document.getElementById("rats").children

    for (let i = 0; i < 3; i++) {
        for(let j = 0; j < 2; j++) {
            ratsList[i].children[j].innerHTML = localStorage.getItem("shobolani").split(",")[i * 2 + j]
            if (localStorage.getItem("shoboBet") == localStorage.getItem("shobolani").split(",")[i * 2 + j]) {
                ratsList[i].children[j].style.backgroundColor = "pink";
            }
            else {
                ratsList[i].children[j].style.backgroundColor = "gray";
            }
        }
    }
}


function calcCastigPosibil() {
    document.getElementById("poswin").innerText = "Castig Posibil " + (parseInt(document.getElementById("suma").value) * 6);
}

function chooseRat(el) {
    localStorage.setItem("shoboBet", el.innerHTML)
    showRats()

}

function bet() {
    fetch(`/addBet?raceName=${localStorage.getItem("nume_cursa")}&ratName=${localStorage.getItem("shoboBet")}&betSize=${parseInt(document.getElementById("suma").value)}`, {
        method: "POST",
        headers: {
            "X-Auth-Token": getToken(document.cookie)
        }
    }).then(response => response.json()).then(json => {
        if (json !== "Nu aveti destule fonduri") {
            window.location="http://localhost:5000/races.html"
        }})
}