var rapidomize = require('../../dist/rapidomize');

// Following examples show how to use the node js sdk, for calling user defined APIs
const APP_ID ='YOUR_APP_ID';
const TOKEN= 'YOUR_APP_TOKEN';
const ICAPP_ID='ICAPP_ID';

/* initialize the library with appId and token */
rapidomize.init(APP_ID, TOKEN);

rapidomize.get('rows?rng=A1:K1&st=5', ICAPP_ID,
    //call back
    {   
        ack: (res) => { 
            console.log('res', res)
        }, 
        err: (err) => {
            console.log('err', err)
        }
    }
);
