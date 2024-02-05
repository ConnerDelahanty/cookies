function generateUUID() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

function setCookieByDocument(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
        document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

function getCookie(name) {
    let nameEQ = name + "=";
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function setCookieByServer(value, days) {
    // Construct the URL with the specified value and expiration
    const url = `https://identification-testing-ce12468ede46.herokuapp.com/cookie/${encodeURIComponent(value)}/${days}/`;
    
    // Use fetch to send the request
    fetch(url, {
        method: 'GET',
        credentials: 'include',
    })
    .then(response => {
        if(response.ok) {
            console.log('Request to set cookie was successful');
        } else {
            console.error('Request to set cookie failed with status:', response.status);
        }
    })
    .catch(error => console.error('Error making request to set cookie:', error));
}


if (getCookie("inc3p-dc7") === null) {
    setCookieByDocument("inc3p-dc7", generateUUID(), 7);
}

if (getCookie("inc3p-dc30") === null) {
    setCookieByDocument("inc3p-dc30", generateUUID(), 30);
}

if (getCookie("inc3p-sc1p7") === null) {
    setCookieByServer("inc3p-sc1p7", 7);
}

if (getCookie("inc3p-sc1p30") === null) {
    setCookieByServer("inc3p-sc1p30", 30);
}

if (localStorage.getItem("inc3p-ls") === null) {
    localStorage.setItem("inc3p-ls", generateUUID());
}

if (sessionStorage.getItem("inc3p-ss") === null) {
    sessionStorage.setItem("inc3p-ss", generateUUID());
}

document.getElementById('inc3p-dc7').innerText = getCookie("inc3p-dc7");
document.getElementById('inc3p-dc30').innerText = getCookie("inc3p-dc30");
document.getElementById('inc3p-sc1p7').innerText = getCookie("inc3p-sc1p7");
document.getElementById('inc3p-sc1p30').innerText = getCookie("inc3p-sc1p30");
document.getElementById('inc3p-ls').innerText = localStorage.getItem("inc3p-ls");
document.getElementById('inc3p-ss').innerText = sessionStorage.getItem("inc3p-ss");
