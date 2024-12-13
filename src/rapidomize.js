/*
 * Copyright (c) 2018-2024, Rapidomize.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * OR contact:
 * contact@rapidomize.com
 * 
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License
 * is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing permissions and limitations under
 * the License.
 */



const EP_HOST='ics.rapidomize.com';
// const EP_HOST='localhost'; //for dev testing

const VERSION='v1';
const BASE_PATH=`/api/${VERSION}`;

let _appId;
let _icappId;
let _options = {};
let _store;
let _nde=false;


/**
 * Initialize rapidomize and creates a client to remotely interact with Rapidomize server/cloud platform. 
 * 
 * @param {String} appId   App/Device ID obtained from App/Device definition.
 * @param {String} token   App/Device Token obtained from App/Device definition 'API Authorizations' tab.
 * @param {String} icappId (optional) ICApp ID to use in event tracking for analytics against a given ICApp
 * @param {Object} options (optional) additional options 
 *                         {
 *                          'session': true  => include session data for all ICApp triggers
 *                         }
 * 
 * 
 */
function init(appId, token,  icappId = null, options = null) {
    if(!appId || appId.length > 60 || !token || !EP_HOST || !BASE_PATH) {
        console.warn('Failed to initialize rapidomize!!');
        return;
    }

    _appId = appId; //NoP for the time being
    _icappId = icappId;
    _options =  Object.assign(_options, options);

    _hdr(token);

    if(typeof window === 'undefined'){
        _nde = true;
        _store = new Map();
    }
}

/**
 * If you are expecting response from your ICApp then you must provide a callback handler to receive response.
 * 
 * Default callback handler.
 * 
 */
 let LifeCycleHandler = {
    /**
     * Receive response from the server/cloud platform.  
     * 
     * @param {Object} res response data
     */
    ack: (res)=>{},

    /**
     * if in case of an error. Error msg err description is found under err attribute
     * e.g. {err: 'reason ..', status:'status text'}
     * 
     * @param {Object} err in case of error
     */
    err: (err) => {}
};

const HttpMethod = {
    GET:'GET',
    POST:'POST',
    PUT:'PUT',
    PATCH:'PATCH',
    DELETE: 'DELETE'
}


const ICAPP_PATH=`${BASE_PATH}/icapp`;


/**
 * Trigger an ICApp with input JSON data
 *
 * @param {String} icappId ICApp ID
 * @param {Object} data inbound data for the ICApp, is either a object or an array of objects. 
 *                      For bulk operations you can send data as an array of objects. ICApp will be triggered for each object in the array.
 * @param {LifeCycleHandler} handler callback handler see above
 */
 function trigger(icappId, data, handler = LifeCycleHandler){
    if(!_appId)  {
        return _err('Rapidomize is not initialized!');
    }

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

    const path = `${ICAPP_PATH}/${icappId}`;

    _send(HttpMethod.POST, path, reqdata, handler);
}

/**
 * Convenient method to invoke user defined GET REST API
 * 
 * @param {String} path 
 * @param {LifeCycleHandler} handler callback handler see above
 */
function get(path, icappId=null, handler=null){
    let gwpath = _gwpath(path, icappId);
    if(!gwpath) return;
    _send(HttpMethod.GET, gwpath, null, handler);
}

/**
 * Convenient method to invoke user defined POST REST API
 * 
 * @param {String} path 
 * @param {Object} data inbound data for the ICApp, is either a object or an array of objects. 
 *                      For bulk operations you can send data as an array of objects. ICApp will be triggered for each object in the array.
 * @param {LifeCycleHandler} handler callback handler see above
 */
function post(path, data, icappId=null, handler=null){
    let gwpath = _gwpath(path, icappId);
    if(!gwpath) return;
    _send(HttpMethod.POST, gwpath, data, handler);
}

/**
 * Convenient method to invoke user defined PUT REST API
 * 
 * @param {String} path 
 * @param {Object} data inbound data for the ICApp, is either a object or an array of objects. 
 *                      For bulk operations you can send data as an array of objects. ICApp will be triggered for each object in the array.
 * @param {LifeCycleHandler} handler callback handler see above
 */
function put(path, data, icappId=null, handler=null){
    let gwpath = _gwpath(path, icappId);
    if(!gwpath) return;
    _send(HttpMethod.PUT, gwpath, data, handler);
}

/**
 * Convenient method to invoke user defined DELETE REST API
 * 
 * @param {String} path 
 * @param {Object} data inbound data for the ICApp, is either a object or an array of objects. 
 *                      For bulk operations you can send data as an array of objects. ICApp will be triggered for each object in the array.
 * @param {LifeCycleHandler} handler callback handler see above
 */
function del(path, data, icappId=null, handler=null){
    let gwpath = _gwpath(path, icappId);
    if(!gwpath) return;
    _send(HttpMethod.DELETE, gwpath, data, handler);
}


/**
 * Setup session data for event tracking for analytics
 * 
 * @param {String} sessionId  - a unique id to identify the a given session
 * @param {String} userId - (optional) anonymous user ID for event tracking for analytics
 * @param {Object} userProps - (optional) other use properties to be included
 */
function setSession(sessionId, userId = null, userProps = null) {
    let session = {'sessionId': sessionId};

    if (userId) session.userId = userId;
    if (userProps) session.userProps = userProps;

    _setItem("rapidomize-session", JSON.stringify(session));
}

/**
 * clear session data
 */
function clearSession() {
    _removeItem("rapidomize-session");
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
    if(!_appId)  {
        return _err('Rapidomize is not initialized!');
    }

    icappId = icappId? icappId: _icappId;

    if(!icappId || icappId.length > 60 || !eventName) {
        console.log('missing req params for event', icappId, eventName);
        return;
    }

    let ev = {'_evt': eventName};
    let data = properties? Object.assign(ev, properties): ev;

    const session = _getSession();
    if (!session || !session.sessionId && !session.userId) {
        console.log('invalid session - call setSession() before using');
        return;
    }

    const reqdata = Object.assign(data, session);
    let path = `${ICAPP_PATH}/${icappId}/event`;
    _send(HttpMethod.POST, path, reqdata);
}

let _headers;

function _hdr(token){
    _headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/plain;q=0.9',
        'Connection': 'keep-alive',
        'Authorization': `Basic ${Buffer.from(`:${token}`).toString('base64')}`
    }
}

const API_GW_PATH=`${BASE_PATH}/agw/`;

function _gwpath(path, icappId){
    if(!_appId)  {
        return _err('Rapidomize is not initialized!');
    }
    if(!path || typeof path != 'string' || path.length == 0 || path.length > 2048){
        return _err('invalid request uri/path');
    }

    icappId = icappId? icappId: _icappId;
    if(!icappId || typeof icappId != 'string' || icappId.length == 0 || icappId.length > 60) {
        return _err('Invalid icappId!');
    }

    return path.charAt(0)!='/'?`${API_GW_PATH}${icappId}/${path}`:`${API_GW_PATH}${icappId}${path}`;
}

const _https = require('https');

/**
 * internal - send HTTP request
 * 
 * @param {String} icappId 
 * @param {Object} data 
 * @param {boolean} ev 
 * 
 * @returns 
 */
function _send(method, path, data, handler=null){
    let headers = _headers;
    if(method != HttpMethod.GET && data){
        data = JSON.stringify(data);
        headers = {..._headers, ...{'Content-Length': Buffer.byteLength(data)}};
    }

    console.log('uri', method, path, headers, data);
      
    const req = _https.request({
        protocol: 'https:',
        hostname: EP_HOST,
        port: 443,
        path: path,
        method: method,
        headers: headers
      }, (res) => {
        let cnt = res.headers['content-type'];
        const status = res.statusCode;
        console.log('Content-Type',cnt);
        console.log('status', status, res.statusMessage);
        
        let _data = [];
        res.on('data', (chunk) => {
            _data.push(chunk)
        });

        res.on('end', () => {
            _data = Buffer.concat(_data);
            if(cnt){
                let loc = cnt.indexOf(';');
                if(loc > 0) cnt = cnt.substring(0, loc);
                switch(cnt){
                    case 'text/plain': 
                    case 'text/html': _data = Buffer.byteLength(_data)> 0 ?_data.toString():''; break;
                    case 'application/json': _data = Buffer.byteLength(_data)> 0 ?JSON.parse(_data.toString()):undefined; break;
                }
            }
            console.log('body: ', _data);
            
            if(handler){
                if (status >= 200 && status < 300) {
                    handler.ack(_data);
                    return;
                } else {
                    let err;
                    if(cnt == 'application/json'){
                        if(_data && Object.keys(_data).length > 0 && _data.err)
                            err = _data.err;
                        else err = res.statusMessage;
                    }else err = _data;
                    handler.err({err: err, st: status, sm: res.statusMessage});
                }
            }
        });
    });
    
    req.on('error', error => {
        console.error(error);
    });
    
    if(data)
        req.write(data);
    req.end();
}
    
function _getSession() {
    let ses = _getItem("rapidomize-session")
    return ses ? JSON.parse(ses):null;
}

function _getItem(key){
    return (typeof window === 'undefined')? _store.get(key): localStorage.getItem(key) ;
}

function _setItem(key, value){
    return (typeof window === 'undefined')? _store.set(key, value): localStorage.setItem(key, value) ;
}

function _removeItem(key){
    return (typeof window === 'undefined')? _store.delete(key): localStorage.removeItem(key) ;
}

function _err(msg){
    if(_nde) throw new Error(msg);
    else {
        console.log(msg);
        return false;
    }
}

module.exports = {
    init,
    trigger,
    event,
    setSession,
    clearSession,
    get,
    post,
    put,
    del,
    LifeCycleHandler
}