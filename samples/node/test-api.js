const rapidomize = require('../../dist/rapidomize');
const process = require('process');

// Following examples show how to use the node js sdk, for triggering ICApps and tracking events for telematics/telemetry/analytics
const APP_ID ='YOUR_APP_ID';
const TOKEN= 'YOUR_APP_API_KEY';
const ICAPP_ID='YOUR_ICAPP_ID';

/* initialize the library with appId and token */
rapidomize.init(APP_ID, TOKEN);

//Test REST API GET operation for endpoint path & query '/rows?rng=A1:K1&st=5'
rapidomize.get('/rows?rng=A1:K1&st=5', ICAPP_ID,
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



//Test REST API POST operation for endpoint path  '/rows'
/* for(let i=0; i< 2;i++){
    const st = performance.now();
    let usage = process.cpuUsage();
    rapidomize.post('/rows', {"aa":"bbbbbbbbb", "cc":"dddddddddddd"}, ICAPP_ID,
        //call back
        {   
            ack: (res) => { 
                const en = performance.now();
                console.log('total: ', (en - st))
                let now = process.cpuUsage(usage)
                let tot = (now.system + now.user) / 1000;
                console.log("time: ", tot);
                console.log('res', res)
            }, 
            err: (err) => {
                console.log('err', err)
            }
        }
    );
} */