/*
 * Copyright (c) 2018-2022, Rapidomize.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * OR contact:
 * contact@rapidomize.com
 * +1 650 603 0899
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License
 * is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing permissions and limitations under
 * the License.
 */

const EP_URI='https://intcon.rapidomize.com/api/v1/mo';

let httpReq = null;
let baseUri = null;
let qparams = null;
let _icappId = null;
let _options = {};

/**
 * Initialize rapidomize
 * token based authentication for browser
 * 
 * @param {String} appId - App ID
 * @param {String} token - Token for the App
 * @param {String} icappId (optional) ICApp ID to use in event tracking for analytics against a given ICApp
 * @param {Object} options additional options 
 *                         {
 *                          'session': true  => include session data for all ICApp triggers
 *                         }
 * 
 * 
 */
function init(appId, token, icappId = null, options = null) {
    if(!appId || appId.length > 60) {
        console.warn('Failed to initialize rapidomize!! - invalid App ID');
        return;
    }
    if(!token) {
        console.warn('Failed to initialize rapidomize!! - invalid param');
        return;
    }
    qparams = `token=${encodeURIComponent(token)}`;
    baseUri = `${EP_URI}/${appId}`;
    _icappId = icappId;
    _options =  Object.assign(_options, options);
    
    httpReq = new XMLHttpRequest();

    httpReq.onload = function(event) {
        var text = httpReq.responseText;
        // console.log('');
    };
    
    httpReq.onerror = function(event) {
        console.log('rapidomize', event);
    }; 
}


/**
 * Execute ICApp having 'my-app' or 'webhook' and receive inbound data (as JSON) for ICApp processing.
 * 
 * @param {String} icappId ICApp ID
 * @param {Object} data inbound data for the ICApp, is either a object or an array of objects. 
 *                      For bulk operations you can send data as an array of objects. ICApp will be triggered for each object in the array.
 * 
 * @return none
 */
 function trigger(icappId, data){
    if(!baseUri || !qparams) return;

    icappId = icappId? icappId: _icappId;
    if(!icappId || icappId.length > 60 || !data) {
        console.log('missing req params', icappId, data);
        return;
    }

    let reqdata = data;
    if(_options['session']){
        const session = _getSession();
        if (!session || !session.sessionId && !session.userId) {
            console.log('invalid session - call setSession() before using');
            return;
        }

        reqdata = Object.assign(data, session);
    }

    _send(icappId, reqdata);
}

/**
 * Setup session data for event tracking for analytics
 * 
 * @param {String} sessionId  - a unique id to identify the a given session
 * @param {String} userId - (optional) anonymous user ID for event tracking for analytics
 * @param {Object} userProps - (optional) other use properties to be included
 */
 function setSession(sessionId, userId = null, userProps = null) {
    var session = {'sessionId': sessionId};

    if (userId) session.userId = userId;
    if (userProps) session.userProps = userProps;

    localStorage.setItem("rapidomize-session", JSON.stringify(session));
}

/**
 * clear session data
 */
function clearSession() {
    localStorage.removeItem("rapidomize-session");
}

/**
 * For analytics purpose, track webapp user events such as button clicks and send event data to your ICApp for analysis.
 * Prior to executing this function, it is required to setup session information by calling setSession().
 * 
 * @param {String} eventName  any unique name which can be used to identify an event
 * @param {Object} properties OPTIONAL dictionary object which can be used to attach any properties associated with the event
 * @param {String} icappId ICApp ID, this is optional if already provided when initializing library by calling init(..., icappId,..)
 * 
 * @return none
 */
 function event(eventName, properties = null, icappId = null) {
    if(!baseUri || !qparams) return;

    icappId = icappId? icappId: _icappId;

    if(!icappId || icappId.length > 60 || !eventName) {
        console.log('missing req params for event', icappId, eventName);
        return;
    }

    let ev = {'n': eventName};
    let data = properties? Object.assign(ev, properties): ev;

    const session = _getSession();
    if (!session || !session.sessionId && !session.userId) {
        console.log('invalid session - call setSession() before using');
        return;
    }

    const reqdata = Object.assign(data, session);
    _send(icappId, reqdata, true);
}

/**
 * internal function to send HTTP request
 * 
 * @param {String} icappId 
 * @param {*} data 
 * @param {*} ev 
 * 
 * @returns 
 */
function _send(icappId, data, ev){
    let URI = `${baseUri}/icapp/${icappId}${ev?'/events':''}?${qparams}`
    // console.log('uri', URI, data);

    httpReq.open('POST', URI);
    httpReq.setRequestHeader('Content-Type', 'application/json');
    return httpReq.send(JSON.stringify(data));
}

/*
{
    if (navigator.sendBeacon) { 
        //on unload send the last event
        window.addEventListener("unload", function lstEv() {
            navigator.sendBeacon(`${baseUri}/event?${baseParams}`, data);
        });
    }
}
*/

function _getSession() {
    var ses = localStorage.getItem("rapidomize-session")
    return ses ? JSON.parse(ses):null;
}

module.exports = {
    init,
    event,
    trigger,
    setSession,
    clearSession
}