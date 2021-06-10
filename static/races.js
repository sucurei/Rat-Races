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

function gotorace(name, date, time, rats){
    console.log(date);
    console.log(time);
    console.log(rats);
    localStorage.setItem("nume_cursa", name)
    localStorage.setItem("data", date)
    localStorage.setItem("timp", time)
    localStorage.setItem("shobolani", rats)

    window.location = "http://localhost:5000/betting.html"
}

function closure(string) {
    return '"' + string + '"';
}

rk = undefined;

const icalex = `
BEGIN:#{summary}
SUMMARY: #{summary}
ORGANIZER:mailto:doni@smecherul.com
DTSTART:#{dstart}
END:#{summary}
`

function dateToString(date) {
    if(date < 10) {
        return "0" + date;
    }
    return "" + date;
}


function update_races(races){
    rk = races;
    for (var l of races){
        console.log(l)
        var name = l["name"]
        var time = l["time"]["hour"] + ":" + l["time"]["minutes"]
        var date = l["date"]["day"] + "/" + l["date"]["month"] + "/" + l["date"]["year"]        
        var rats = l["rats"]        
        var paranghelie = `[${rats.map(closure).join(", ")}]`
        document.getElementById("curse").innerHTML += `
    <div class="race">
                <div class="name">
                    ${name}
                </div>
                <div class="date">
                    ${time}
                </div>
                <div class="nr-of-shobo">
                    shoboCount=6
                </div>
                <button type="button" class="btn" onclick='gotorace("${name}", "${date}", "${time}", ${paranghelie})'>
                    pariaza
                </button>
            </div>
    
    `
    }
    document.getElementById("calendar").addEventListener("click", (e) => {
        e.preventDefault();
        
        let data = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//RDU Software//NONSGML HandCal//EN`;

        for(let el of rk) {
            data += icalex.replaceAll("#{summary}", el["name"]).replaceAll("#{dstart}", 
            dateToString(el["date"]["year"]) + dateToString(el["date"]["month"]) + dateToString(el["date"]["day"]) + "T"
            +  dateToString(el["time"]["hour"]) + dateToString(el["time"]["minutes"] + "00"));
        }

        data += "END:VCALENDAR";

        var blob = new Blob([data], {type: 'text/text'}),
        e    = document.createEvent('MouseEvents'),
        a    = document.createElement('a')

    a.download = "calendar.txt";
    a.href = window.URL.createObjectURL(blob)
    a.dataset.downloadurl =  ['text/text', a.download, a.href].join(':')
    e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
    a.dispatchEvent(e)
    
    })
    
}

fetch('/races' + '',{
        method: 'GET',
        headers: {
            "X-Auth-Token" : getToken(document.cookie)
        }
    }).then(
    response => response.json()
).then(json => update_races(json))