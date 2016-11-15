//tealium universal tag - utag.329 ut4.0.201611151523, Copyright 2016 Tealium.com Inc. All Rights Reserved.
try{(function(id,loader){var u={};utag.o[loader].sender[id]=u;u.ev={"view":1};u.map={"analytics_pagename":"pageid","product_id":"productid","language":"language","page_type":"pagetype","euci":"euci"};u.extend=[];u.send=function(a,b){if(u.ev[a]||u.ev.all!==undefined){var c,d,e,f;u.data={"base_url":"//tags.bkrtx.com/js/bk-coretag.js","siteid":"40530","limit":"","allow_multiple_calls":false};for(d in utag.loader.GV(u.map)){if(b[d]!==undefined&&b[d]!==""){e=u.map[d].split(",");for(f=0;f<e.length;f++){u.data[e[f]]=b[d];}}}
if(!u.initialized){window.bk_async=function(){if(u.data.pageid){bk_addPageCtx("id",u.data.euci);}
if(u.data.productid){bk_addPageCtx("productid",u.data.productid);}
if(u.data.language){bk_addPageCtx("language",u.data.language);}
if(u.data.pagetype){bk_addPageCtx("pagetype",u.data.pagetype);}
BKTAG.doTag(u.data.siteid,4);};(function(){var scripts=document.getElementsByTagName("script")[0];var s=document.createElement("script");s.async=true;s.src=u.data.base_url;scripts.parentNode.insertBefore(s,scripts);}());}
}};utag.o[loader].loader.LOAD(id);}("329","adidas.adidasglobal"));}catch(error){utag.DB(error);}
