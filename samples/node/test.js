var rapidomize = require('../../dist/rapidomize');

// Following examples show how to use the node js sdk, for triggering ICApps and tracking events for telematics/telemetry/analytics
const APP_ID ='YOUR_APP_ID';
const TOKEN= 'YOUR_APP_API_KEY';
const ICAPP_ID='YOUR_ICAPP_ID';

/* initialize the library with appId and token */
rapidomize.init(APP_ID, TOKEN);

/* set a session information for event tracking */
rapidomize.setSession('123qwe', 'user123');       

 /* track an event */
 rapidomize.event('register', {
    'type': 'click',
    'wait': '160s'
 }, ICAPP_ID);

rapidomize.trigger(ICAPP_ID, {
        to: 'sample@abc.com',  
        from: 'noreply@my-site.com',
        subject: 'Test Subject',
        body: 'Test body'
    }, 
    //call back
    {   
        ack: (res) => { 
            console.log('res', res)
        }, 
        err: (err) => {
            console.log('err', err.err)
        }
    }
);




