!function(e, t, s) {
"use strict";
var n, i, a, r, c = "__IM_smartpix", o = 0;
n = function(e) {
var t, n = [];
for (t in e) e.hasOwnProperty(t) && n.push(s(t) + "=" + s(e[t]));
return n.join("&");
}, i = function(e) {
var s = "script", n = t.createElement(s), i = t.getElementsByTagName(s)[0];
n.async = 1, n.src = e, i.parentNode.insertBefore(n, i);
}, a = function(e) {
var s = t.createElement("iframe");
s.style.width = 0, s.style.height = 0, s.style.border = "none", s.style.visibility = "hidden", 
s.src = e, t.documentElement.appendChild(s);
}, (r = function() {
if (e[c] && e[c].u) {
var t = e[c].a[0] || {};
switch (t.ctx + "") {
case "578045":
case "660505":
case "584446":
case "680995":
case "1069138":
case "528502":
case "205525":
case "52672":
i("//pix.impdesk.com/pix/smart.js?%24v=1&%24href=" + s(e[c].u) + "&" + n(t));
break;

default:
a("//pix.impdesk.com/pix/smart.html?%24v=1&%24href=" + s(e[c].u) + "&" + n(t));
}
} else o++ < 200 && e.setTimeout(r, 10);
})();
}(window, document, encodeURIComponent);