//tealium universal tag - utag.284 ut4.0.201605121636, Copyright 2016 Tealium.com Inc. All Rights Reserved.
if(typeof window['_rfi']!=='function'){window['_rfi']=function(){window['_rfi'].commands=window['_rfi'].commands||[];window['_rfi'].commands.push(arguments);};}
try{(function(id,loader){var u={};utag.o[loader].sender[id]=u;if(utag.ut===undefined){utag.ut={};}
if(utag.ut.loader===undefined){u.loader=function(o){var b,c,l,a=document;if(o.type==="iframe"){b=a.createElement("iframe");o.attrs=o.attrs||{"height":"1","width":"1","style":"display:none"};for(l in utag.loader.GV(o.attrs)){b.setAttribute(l,o.attrs[l]);}b.setAttribute("src",o.src);}else if(o.type=="img"){utag.DB("Attach img: "+o.src);b=new Image();b.src=o.src;return;}else{b=a.createElement("script");b.language="javascript";b.type="text/javascript";b.async=1;b.charset="utf-8";for(l in utag.loader.GV(o.attrs)){b[l]=o.attrs[l];}b.src=o.src;}if(o.id){b.id=o.id};if(typeof o.cb=="function"){if(b.addEventListener){b.addEventListener("load",function(){o.cb()},false);}else{b.onreadystatechange=function(){if(this.readyState=='complete'||this.readyState=='loaded'){this.onreadystatechange=null;o.cb()}};}}l=o.loc||"head";c=a.getElementsByTagName(l)[0];if(c){utag.DB("Attach to "+l+": "+o.src);if(l=="script"){c.parentNode.insertBefore(b,c);}else{c.appendChild(b)}}}}else{u.loader=utag.ut.loader;}
if(utag.ut.typeOf===undefined){u.typeOf=function(e){return({}).toString.call(e).match(/\s([a-zA-Z]+)/)[1].toLowerCase();};}else{u.typeOf=utag.ut.typeOf;}
u.ev={"view":1};u.scriptrequested=false;u.known_args={"ver":1,"rb":1,"ca":1,"t":1,"transid":1,"revenue":1,"pid":1,"price":1,"cat":1,"pq":1,"q":1}
u.map={};u.extend=[];u.send=function(a,b){if(u.ev[a]||u.ev.all!==undefined){var c,d,e,f;u.data={"base_url":"//c1.rfihub.net/js/tc.min.js","ver":"9","rb":"2787","actionid":"20722112","actionid_conv":"","ca":"","cat":"","t":"","q":b["dom.query_string"],"pid":[],"pq":[],"price":[]};c=[];for(d in utag.loader.GV(u.map)){if(b[d]!==undefined&&b[d]!==""){e=u.map[d].split(",");for(f=0;f<e.length;f++){if(u.known_args[e[f]]){u.data[e[f]]=b[d];}else{u.data[e[f]]=b[d];_rfi("setArgs",e[f],b[d]+"");}}}}
u.data.transid=u.data.transid||b._corder||"";u.data.revenue=u.data.revenue||b._ctotal||"";if(u.data.pid.length===0&&b._cprod!==undefined){u.data.pid=b._cprod.slice(0);}
if(u.data.price.length===0&&b._cprice!==undefined){u.data.price=b._cprice.slice(0);}
if(u.data.pq.length===0&&b._cquan!==undefined){u.data.pq=b._cquan.slice(0);}
u.data.pid=u.data.pid+"";u.data.price=u.data.price+"";u.data.pq=u.data.pq+"";_rfi("setArgs","ver",u.data.ver);_rfi("setArgs","rb",u.data.rb);if(b._cevent=="search"||u.data.t=="srp"){u.data.t=u.data.t||"srp";_rfi("setArgs","q",u.data.q);}
if(b._cevent=="cartview"||b._cevent=="checkout"){u.data.t=u.data.t||"cv";}
if(b._cevent=="prodview"){u.data.t=u.data.t||"view";}
if(b._cevent=="category"||u.data.t=="cat"){u.data.t=u.data.t||"cat";if(u.data.cat===""&&typeof b._ccat!="undefined"){u.data.cat=b._ccat.slice(0,1).join("");}
_rfi("setArgs","cat",u.data.cat+"");}
if(u.data.transid){u.data.t="conv";u.data.ca=u.data.ca||u.data.actionid_conv||u.data.actionid;_rfi("setArgs","transid",u.data.transid);_rfi("setArgs","revenue",u.data.revenue);_rfi("setArgs","price",u.data.price);_rfi("setArgs","pq",u.data.pq);}else{u.data.ca=u.data.ca||u.data.actionid;}
if(u.data.t===""){if(u.data.pid.length>0&&u.data.pid.indexOf(",")<0){u.data.t="view"}else if(b["dom.pathname"]=="/"){u.data.t="home"}else{u.data.t="other"}}
if(u.data.t=="cat"||u.data.t=="srp"||u.data.t=="other"){u.data.pid=u.data.pid.split(",").slice(0,5).join(",");}
_rfi("setArgs","ca",u.data.ca);_rfi("setArgs","t",u.data.t);if(u.data.t!="home"){_rfi("setArgs","pid",u.data.pid);}
_rfi("track");if(!u.scriptrequested){u.scriptrequested=true;u.loader({"type":"script","src":u.data.base_url,"loc":"script","id":"utag_284"});}
}};utag.o[loader].loader.LOAD(id);}("284","adidas.adidasglobal"));}catch(error){utag.DB(error);}
