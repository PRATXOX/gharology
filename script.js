(function(){"use strict";
var C=window.GHAR_CONFIG||{},d=document,B=d.body;
function $(s,r){return(r||d).querySelector(s)}function $$(s,r){return[].slice.call((r||d).querySelectorAll(s))}
function store(){return{g:function(k){try{return localStorage.getItem(k)}catch(e){return null}},s:function(k,v){try{localStorage.setItem(k,v)}catch(e){}}}}
var L=store();
function log(){if(C.testMode&&window.console)console.log.apply(console,["[ghar.o.logy]"].concat([].slice.call(arguments)))}
/* Settings -> page text (empty values keep the default wording in the HTML) */
$$("[data-cfg]").forEach(function(e){var v=C[e.getAttribute("data-cfg")]||(C.details||{})[e.getAttribute("data-cfg").replace("details.","")];if(v)e.textContent=v});
/* Call + WhatsApp: real links only when valid numbers are set; otherwise they scroll to the form */
var pOk=/^\+\d{10,15}$/.test(C.phone||""),wOk=/^\d{10,15}$/.test(C.whatsapp||"");
$$("[data-call]").forEach(function(a){if(pOk){a.href="tel:"+C.phone;a.dataset.live="call"}else{a.href="#enquire";a.setAttribute("data-go","")}});
$$("[data-wa]").forEach(function(a){if(wOk){a.href="https://wa.me/"+C.whatsapp+"?text="+encodeURIComponent(C.waMessage||"");a.target="_blank";a.rel="noopener noreferrer";a.dataset.live="wa"}else{a.href="#enquire";a.setAttribute("data-go","")}});
if(C.testMode)log("Settings not yet filled:",["phone","whatsapp","legalName","privacyEmail"].filter(function(k){return!C[k]}).join(", ")||"none");
/* Smooth scroll to the form and focus the first field */
d.addEventListener("click",function(e){var a=e.target.closest&&e.target.closest("[data-go]");if(!a)return;e.preventDefault();
 var f=$("#enquire"),rm=matchMedia("(prefers-reduced-motion:reduce)").matches;f.scrollIntoView({behavior:rm?"auto":"smooth"});
 setTimeout(function(){var n=$("#fn");if(n&&!n.closest("[hidden]"))n.focus({preventScroll:true})},rm?0:750)});
if(location.hash==="#privacy")$("#privacy").open=true;
d.addEventListener("click",function(e){var a=e.target.closest&&e.target.closest('a[href="#privacy"]');if(a)$("#privacy").open=true});
/* Meta Pixel: only after consent */
var ready=false,allowed=false,leadSent=false;
function loadPixel(){if(ready||!/^\d{8,20}$/.test(C.pixelId||""))return;
!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version="2.0";n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,d,"script","https://connect.facebook.net/en_US/fbevents.js");
fbq("init",C.pixelId);fbq("track","PageView");ready=true;log("Pixel initialised + PageView")}
function track(ev){if(!ready||!allowed||typeof window.fbq!=="function"){log("Not sent (no consent / not ready):",ev);return false}fbq("track",ev);log("Sent:",ev);return true}
var cb=d.createElement("div");cb.id="cb";cb.setAttribute("role","dialog");cb.setAttribute("aria-label","Tracking consent");
cb.innerHTML='<p>We use Meta Pixel to measure our ad performance, only if you agree. Your name, phone number and form answers are never sent to Meta. <a href="#privacy">Details</a></p><div><button class="btn" data-c="yes">Accept</button><button class="btn l" data-c="no">Reject</button></div>';
B.appendChild(cb);
function show(f){cb.classList.add("show");B.classList.add("co");if(f)$("button",cb).focus()}
cb.addEventListener("click",function(e){var c=e.target.getAttribute("data-c");if(c){L.s("gh_consent",c);cb.classList.remove("show");B.classList.remove("co");apply()}});
$$("[data-consent]").forEach(function(b){b.addEventListener("click",function(){show(true)})});
function apply(){allowed=!C.consentRequired||L.g("gh_consent")==="yes";
 if(allowed){loadPixel();if(ready)fbq("consent","grant")}else if(ready){fbq("consent","revoke");log("Consent withdrawn")}else log("Pixel not loaded: no consent")}
apply();if(C.consentRequired&&!L.g("gh_consent"))show(false);
var sent={};d.addEventListener("click",function(e){var a=e.target.closest&&e.target.closest("[data-live]");if(a&&!sent[a.dataset.live]&&track("Contact"))sent[a.dataset.live]=1});
/* Header */
var hd=$("header");function sc(){hd.classList.toggle("s",scrollY>30)}sc();addEventListener("scroll",sc,{passive:true});
$$("[data-year]").forEach(function(e){e.textContent=new Date().getFullYear()});
/* Enquiry form (Netlify Forms + Localhost Preview Support) */
var F=$("#enquiry"),el=F.elements,btn=$("#sub"),msg=$("#msg"),busy=false;
function err(id,t){$("#e-"+id).textContent=t||"";$("#"+id).setAttribute("aria-invalid",t?"true":"false");return!t}
function mob(){return el["mobile"].value.replace(/[\s-]/g,"").replace(/^(\+?91|0)(?=\d{10}$)/,"")}
function valid(){var ok=true;
 ok=err("fn",el["name"].value.trim().length<2?"Please enter your full name.":"")&&ok;
 ok=err("fm",/^[6-9]\d{9}$/.test(mob())?"":"Enter a valid 10-digit Indian mobile number starting with 6, 7, 8 or 9.")&&ok;
 var c=el["consent"].checked;$("#e-cs").textContent=c?"":"Please tick the box so we can contact you about this enquiry.";return c&&ok}
function handleSuccess(){
 F.hidden=true;
 var t=$("#done");
 t.hidden=false;
 t.focus();
 if(!leadSent){leadSent=true;track("Lead")}
}
F.addEventListener("submit",function(e){e.preventDefault();if(busy)return;msg.className="";
 if(el["bot-field"].value)return;
 if(!valid()){($("[aria-invalid=true]",F)||el["consent"]).focus();return}
 busy=true;btn.disabled=true;btn.textContent="Sending…";
 var fd=new FormData(F);fd.set("mobile","+91"+mob());
 var isLocal=location.hostname==="localhost"||location.hostname==="127.0.0.1";
 if(isLocal){
  setTimeout(function(){
   log("Localhost preview: Form data validated & simulated:",Object.fromEntries(fd));
   handleSuccess();
  },400);
  return;
 }
 fetch("/",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:new URLSearchParams(fd).toString()})
 .then(function(r){if(!r.ok)throw r.status;handleSuccess()})
 .catch(function(st){
  log("Form submission failed with HTTP status:",st);
  busy=false;btn.disabled=false;btn.textContent="Get Project Details";
  msg.textContent="Your enquiry was not sent. Please try again, or use Call Now or WhatsApp."+(C.testMode&&st?" (Status: "+st+")":"");
  msg.className="show";msg.focus();
 })});
["fn","fm"].forEach(function(i){$("#"+i).addEventListener("blur",valid)});
})();