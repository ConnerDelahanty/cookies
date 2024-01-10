/* Set secret from path param (if exist).
    Print secret set time and expiration
*/

(() => {
    cookie();
    ls();
    ss();
})()


function cookie() {
    const EXP_DAYS = 7;
    if (getCookie('cook-cv') === null) {
        let r = Math.floor(Math.random() * 1000000000000000); 
        setCookie('cook-cv', r, EXP_DAYS);

        var date = new Date();
        setCookie('cook-sd', formatNiceDate(date), EXP_DAYS)

        date.setTime(date.getTime() + (EXP_DAYS * 24 * 60 * 60 * 1000))
        setCookie('cook-ed', formatNiceDate(date), EXP_DAYS)
    }

    document.getElementById('cook-cv').innerText = getCookie('cook-cv')
    document.getElementById('cook-ed').innerText = getCookie('cook-ed')
    document.getElementById('cook-sd').innerText = getCookie('cook-sd')
}


function ls() {
    if (localStorage.getItem('local-cv') === null) {
        let r = Math.floor(Math.random() * 1000000000000000); 
        localStorage.setItem('local-cv', r);
    }

    var date = new Date();
    localStorage.setItem('local-sd', formatNiceDate(date))

    document.getElementById('local-cv').innerText = localStorage.getItem('local-cv')
    // document.getElementById('cook-ed').innerText = getCookie('cook-ed')
    document.getElementById('local-sd').innerText = localStorage.getItem('local-sd')
}

function ss() {
    if (sessionStorage.getItem('session-cv') === null) {
        let r = Math.floor(Math.random() * 1000000000000000); 
        sessionStorage.setItem('session-cv', r);
    }

    var date = new Date();
    sessionStorage.setItem('session-sd', formatNiceDate(date))

    document.getElementById('session-cv').innerText = sessionStorage.getItem('session-cv')
    // document.getElementById('cook-ed').innerText = getCookie('cook-ed')
    document.getElementById('session-sd').innerText = sessionStorage.getItem('session-sd')
}







function setCookie(name, value, days) {
    var expires = "";

    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }

    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

function formatNiceDate(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
    return date.toLocaleDateString('en-US', options);
}