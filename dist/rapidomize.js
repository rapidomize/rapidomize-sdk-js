!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.rapidomize=t():e.rapidomize=t()}(this,(()=>{return e={218:(e,t,n)=>{var o=n(181).Buffer;const i="ics.rapidomize.com",s="/api/v1";let r,l,a,u={},c=!1,p={ack:e=>{},err:e=>{}};const d="GET",f="POST",g="PUT",h="DELETE",m=`${s}/icapp`;let v;const y=`${s}/agw/`;function b(e,t){return r?!e||"string"!=typeof e||0==e.length||e.length>2048?S("invalid request uri/path"):!(t=t||l)||"string"!=typeof t||0==t.length||t.length>60?S("Invalid icappId!"):"/"!=e.charAt(0)?`${y}${t}/${e}`:`${y}${t}${e}`:S("Rapidomize is not initialized!")}const w=n(692);function x(e,t,n,s=null){let r=v;e!=d&&n&&(n=JSON.stringify(n),r={...v,"Content-Length":o.byteLength(n)}),console.log("uri",e,t,r,n);const l=w.request({protocol:"https:",hostname:i,port:443,path:t,method:e,headers:r},(e=>{let t=e.headers["content-type"];const n=e.statusCode;console.log("Content-Type",t),console.log("status",n,e.statusMessage);let i=[];e.on("data",(e=>{i.push(e)})),e.on("end",(()=>{if(i=o.concat(i),t){let e=t.indexOf(";");switch(e>0&&(t=t.substring(0,e)),t){case"text/plain":case"text/html":i=o.byteLength(i)>0?i.toString():"";break;case"application/json":i=o.byteLength(i)>0?JSON.parse(i.toString()):void 0}}if(console.log("body: ",i),s){if(n>=200&&n<300)return void s.ack(i);{let o;o="application/json"==t?i&&Object.keys(i).length>0&&i.err?i.err:e.statusMessage:i,s.err({err:o,st:n,sm:e.statusMessage})}}}))}));l.on("error",(e=>{console.error(e)})),n&&l.write(n),l.end()}function z(){let e=(t="rapidomize-session","undefined"==typeof window?a.get(t):localStorage.getItem(t));var t;return e?JSON.parse(e):null}function S(e){if(c)throw new Error(e);return console.log(e),!1}e.exports={init:function(e,t,n=null,s=null){e&&!(e.length>60)&&t&&i?(r=e,l=n,u=Object.assign(u,s),function(e){v={"Content-Type":"application/json",Accept:"application/json, text/plain;q=0.9",Connection:"keep-alive",Authorization:`Basic ${o.from(`:${e}`).toString("base64")}`}}(t),"undefined"==typeof window&&(c=!0,a=new Map)):console.warn("Failed to initialize rapidomize!!")},trigger:function(e,t,n=p){if(!r)return S("Rapidomize is not initialized!");if(!(e=e||l)||e.length>60||!t)return void console.log("missing req params",e,t);let o=t;if(u.session){const e=z();if(!e||!e.sessionId&&!e.userId)return void console.log("invalid session - call setSession() before using");o=Object.assign(t,e)}x(f,`${m}/${e}`,o,n)},event:function(e,t=null,n=null){if(!r)return S("Rapidomize is not initialized!");if(!(n=n||l)||n.length>60||!e)return void console.log("missing req params for event",n,e);let o={_evt:e},i=t?Object.assign(o,t):o;const s=z();if(!s||!s.sessionId&&!s.userId)return void console.log("invalid session - call setSession() before using");const a=Object.assign(i,s);x(f,`${m}/${n}/event`,a)},setSession:function(e,t=null,n=null){let o={sessionId:e};var i,s;t&&(o.userId=t),n&&(o.userProps=n),i="rapidomize-session",s=JSON.stringify(o),"undefined"==typeof window?a.set(i,s):localStorage.setItem(i,s)},clearSession:function(){var e;e="rapidomize-session","undefined"==typeof window?a.delete(e):localStorage.removeItem(e)},get:function(e,t=null,n=null){let o=b(e,t);o&&x(d,o,null,n)},post:function(e,t,n=null,o=null){let i=b(e,n);i&&x(f,i,t,o)},put:function(e,t,n=null,o=null){let i=b(e,n);i&&x(g,i,t,o)},del:function(e,t,n=null,o=null){let i=b(e,n);i&&x(h,i,t,o)},LifeCycleHandler:p}},181:e=>{"use strict";e.exports=require("buffer")},692:e=>{"use strict";e.exports=require("https")}},t={},function n(o){var i=t[o];if(void 0!==i)return i.exports;var s=t[o]={exports:{}};return e[o](s,s.exports,n),s.exports}(218);var e,t}));