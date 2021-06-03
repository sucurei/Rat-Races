function getToken(tokenObj)
{
    localStorage.setItem('authToken', JSON.stringify(tokenObj))
}

fetch('/login').then(
     response => response.json()
).then(json => getToken(json))
