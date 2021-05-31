function update_user(json){
    let el = json[0];
    document.getElementById("nume").innerText = 'Name: ' + el['name'];
    document.getElementById("id").innerText = 'ID: ' + el['_id'];
    document.getElementById("balanta").innerText = 'Balanta: ' + el['balanta'] + ' RONI';

    
}

fetch('/users?name=Doni',{}).then(
    response => response.json()
).then(json => update_user(json))