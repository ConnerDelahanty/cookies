const LS_KEY_WRT = '_alwrt';
const LS_KEY_EVENT_ID = '_aleid';
const LS_KEY_ART = '_alart';
const LS_KEY_SID = '_alsid';
const LS_META = '_almeta';

const QUERY_PARAM_EVENT_ID = 'aleid';
const QUERY_PARAM_ART = 'alart';

const MAX_METADATA_SIZE = 20;

let state = {
    hostUrl: null,
    apiKey: null
};

function init(hostUrl, apiKey)
{
    state.hostUrl = hostUrl;
    state.apiKey = apiKey;
}

function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
        .replace(/[xy]/g, function (c) {
            let r = Math.random() * 16 | 0;
            let v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
}

function getQueryParameter(param, location) {
    if (location && location.search)
    {
        const queryParams = new URLSearchParams(location.search);
        return queryParams.get(param);
    }
    return null;
}

async function getLocalStorage(item) {
    if (window.localStorage && typeof window.localStorage.getItem === "function")
    {
        try { 
            return window.localStorage.getItem(item)
        } catch {
            return null
        }
    }
    return null;
}

async function setLocalStorage(key, item) {
    if (window.localStorage && typeof window.localStorage.setItem === "function")
    {
        try { 
            window.localStorage.setItem(key, item)
        } catch {
        }
    }
}

async function getSessionStorage(item) {
    if (window.sessionStorage && typeof window.sessionStorage.getItem === "function")
    {
        try { 
            return window.sessionStorage.getItem(item)
        } catch {
            return null
        }
    }
    return null;
}

async function setSessionStorage(key, item) {
    if (window.sessionStorage && typeof window.sessionStorage.setItem === "function")
    {
        try { 
            window.sessionStorage.setItem(key, item)
        } catch {
        }
    }
}

async function _getMetadata()
{
    const value = await getLocalStorage(LS_META);
    return value ? JSON.parse(value) : [];
}

async function _setMetadata(meta)
{
    await setLocalStorage(LS_META, JSON.stringify(meta));
}

async function initMetadata()
{
    let metadata = await _getMetadata();
    if (metadata.length > MAX_METADATA_SIZE)
    {
        metadata = [metadata[0] + 1];
    } else if (metadata.length > 0)
    {
        metadata[0] = metadata[0] + 1;
    } else {
        metadata.push(0);
    }
    await _setMetadata(metadata);
}

async function logToMetadata(value)
{
    let metadata = await _getMetadata();
    metadata.push(value);
    await _setMetadata(metadata);
}

async function postRequest(url, body)
{
    await fetch(url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-Connect-Event-Key': state.apiKey
        },
        cache: "no-cache",
        credentials: "omit",
        mode: "cors",
        body: body
    })
    .then(async response => {
        if (response.status == 200) {
            await logToMetadata("r"); // Request completed successfully
        } else {
            await logToMetadata("ERR: " + response.status + " : " + response.statusText + " : " + response.type);
        }
    })
    .catch(async error => {
        await logToMetadata("ERR: " + error.toString() );
    })
}

function init(host, api_key)
{

}

function event(data) {
    (async () => {
        try {
            await initMetadata();
            await logToMetadata("l"); // Pixel loaded

            let localStoreWrt = await getLocalStorage(LS_KEY_WRT);
            let wrt = localStoreWrt || generateUUID();

            let sessionStoreSid = await getSessionStorage(LS_KEY_SID);
            let sid = sessionStoreSid || generateUUID();

            await logToMetadata("i"); // Identifiers initialized

            let localStoreEventId = await getLocalStorage(LS_KEY_EVENT_ID);
            let queryStringEventId = getQueryParameter(QUERY_PARAM_EVENT_ID, window.location)
            let eventId = queryStringEventId || localStoreEventId;

            let localStoreArt = await getLocalStorage(LS_KEY_ART);
            let queryStringArt = getQueryParameter(QUERY_PARAM_ART, window.location);
            let art = queryStringArt || localStoreArt;

            await logToMetadata("q"); // Query params logged
        
            let payload = {
                applovin: {
                    wrt: wrt,
                    sid: sid,
                    eventId: eventId,
                    art: art
                },
                event: data,
                initData: window.init ? window.init.data : null,
            }

            await postRequest(state.hostUrl, JSON.stringify(payload));

            await setLocalStorage(LS_KEY_WRT, wrt); // WRT is always set
            await setSessionStorage(LS_KEY_SID, sid); // SID is always set

            // Update event ID if it was found in the query string
            if (eventId) {
                await setLocalStorage(LS_KEY_EVENT_ID, eventId);
            }

            // Update ART if it was found in the query string
            if (art) {
                await setLocalStorage(LS_KEY_ART, art);
            }

            await logToMetadata("f"); // Finished

        } catch (error) {
            await logToMetadata("e"); // Error
            await postRequest('https://b.applovin.com/shopify/error', JSON.stringify({error: error.toString(), connectEventKey: state.apiKey}));
        }
    })();
}