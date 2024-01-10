/* Set secret from path param (if exist).
    Print secret set time and expiration
*/

(() => {
    const EXP_DAYS = 7;
    if (getCookie('rnd-token') === null) {
        let r = Math.floor(Math.random() * 10000000000000000000); 
        setCookie('rnd-token', r, EXP_DAYS);

        var date = new Date();
        setCookie('rnd-set-date', formatNiceDate(date), EXP_DAYS)

        date.setTime(date.getTime() + (EXP_DAYS * 24 * 60 * 60 * 1000))
        setCookie('rnd-expire-date', formatNiceDate(date), EXP_DAYS)
        console.log('Cookies set')
    }

    console.log(getCookie('rnd-token'))
    console.log(getCookie('rnd-set-date'))
    console.log(getCookie('rnd-expire-date'))

    document.getElementById('rnd-cv').innerText = getCookie('rnd-token')
    document.getElementById('rnd-ed').innerText = getCookie('rnd-expire-date')
    document.getElementById('rnd-sd').innerText = getCookie('rnd-set-date')
})()


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