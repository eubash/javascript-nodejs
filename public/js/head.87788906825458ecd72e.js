var head=function(e){function t(n){if(o[n])return o[n].exports;var i=o[n]={exports:{},id:n,loaded:!1};return e[n].call(i.exports,i,i.exports,t),i.loaded=!0,i.exports}var n=window.webpackJsonp_name_;window.webpackJsonp_name_=function(o,s){for(var r,a,l=0,c=[];l<o.length;l++)a=o[l],i[a]&&c.push.apply(c,i[a]),i[a]=0;for(r in s)e[r]=s[r];for(n&&n(o,s);c.length;)c.shift().call(null,t)};var o={},i={1:0};return t.e=function(e,n){if(0===i[e])return n.call(null,t);if(void 0!==i[e])i[e].push(n);else{i[e]=[n];var o=document.getElementsByTagName("head")[0],s=document.createElement("script");s.type="text/javascript",s.charset="utf-8",s.async=!0,s.src=t.p+""+e+".87788906825458ecd72e.js",o.appendChild(s)}},t.m=e,t.c=o,t.p="/js/",t(0)}([function(e,t,n){n(33),t.init=n(18),t.login=n(30),n(31),t.Modal=n(7),t.fontTest=n(27),t.resizeOnload=n(16),n(29),n(32),n(28),window.Spinner=n(8)},,function(){var e={matches:Element.prototype.matchesSelector||Element.prototype.webkitMatchesSelector||Element.prototype.mozMatchesSelector||Element.prototype.msMatchesSelector,remove:function(){var e=this.parentNode;return e?e.removeChild(this):void 0}};for(var t in e)Element.prototype[t]||(Element.prototype[t]=e[t]);try{new CustomEvent("IE has CustomEvent, but doesn't support constructor")}catch(n){window.CustomEvent=function(e,t){var n;return t=t||{bubbles:!1,cancelable:!1,detail:void 0},n=document.createEvent("CustomEvent"),n.initCustomEvent(e,t.bubbles,t.cancelable,t.detail),n},CustomEvent.prototype=Object.create(window.Event.prototype)}},,,,function(e,t,n){n(2),e.exports=function(e,t){for(;e;){if(e.matches(t))return e;e=e.parentElement}return null}},function(e){function t(){this.render(),this.onClick=this.onClick.bind(this),this.onDocumentKeyDown=this.onDocumentKeyDown.bind(this),this.elem.addEventListener("click",this.onClick),document.addEventListener("keydown",this.onDocumentKeyDown)}t.prototype.render=function(){document.body.insertAdjacentHTML("beforeEnd",'<div class="modal"><div class="modal-dialog"></div></div>'),this.elem=document.body.lastChild,this.contentElem=this.elem.lastChild},t.prototype.onClick=function(e){e.target.classList.contains("close-button")&&this.remove()},t.prototype.onDocumentKeyDown=function(e){27==e.keyCode&&(e.preventDefault(),this.remove())},t.prototype.showOverlay=function(){this.contentElem.classList.add("modal-overlay")},t.prototype.hideOverlay=function(){this.contentElem.classList.remove("modal-overlay")},t.prototype.setContent=function(e){"string"==typeof e?this.contentElem.innerHTML=e:(this.contentElem.innerHTML="",this.contentElem.appendChild(e));var t=this.contentElem.querySelector("[autofocus]");t&&t.focus()},t.prototype.remove=function(){document.body.removeChild(this.elem),document.removeEventListener("keydown",this.onDocumentKeyDown)},e.exports=t},function(e){function t(e){if(e=e||{},this.elem=e.elem,this.size=e.size||"medium",this.class=e.class?" "+e.class:"",this.elemClass=e.elemClass,"medium"!=this.size&&"small"!=this.size)throw new Error("Unsupported size: "+this.size);this.elem||(this.elem=document.createElement("div"))}t.prototype.start=function(){this.elemClass&&this.elem.classList.toggle(this.elemClass),this.elem.insertAdjacentHTML("beforeend",'<span class="spinner spinner_active spinner_'+this.size+this.class+'"><span class="spinner__dot spinner__dot_1"></span><span class="spinner__dot spinner__dot_2"></span><span class="spinner__dot spinner__dot_3"></span></span>')},t.prototype.stop=function(){this.elem.removeChild(this.elem.querySelector(".spinner")),this.elemClass&&this.elem.classList.toggle(this.elemClass)},e.exports=t},,,,function(e){function t(e,t){function n(){return s?(o=arguments,void(i=this)):(e.apply(this,arguments),s=!0,void setTimeout(function(){s=!1,o&&(n.apply(i,o),o=i=null)},t))}var o,i,s=!1;return n}e.exports=t},function(e,t,n){function o(e){e=e||document;var t=Math.max(e.body.scrollHeight,e.documentElement.scrollHeight,e.body.offsetHeight,e.documentElement.offsetHeight,e.body.clientHeight,e.documentElement.clientHeight);return e.documentElement.scrollWidth>e.documentElement.clientWidth&&(i||(i=s()),t+=i),t}var i,s=n(14);e.exports=o},function(e){function t(){var e=document.createElement("div");if(e.style.cssText="visibility:hidden;height:100px",!document.body)throw new Error("getScrollbarHeight called to early: no document.body");document.body.appendChild(e);var t=e.offsetWidth;e.style.overflow="scroll";var n=document.createElement("div");n.style.width="100%",e.appendChild(n);var o=n.offsetWidth;return e.parentNode.removeChild(e),t-o}e.exports=t},function(e,t,n){function o(e,t){function n(e,n){clearTimeout(o),t(e,n)}var o=setTimeout(function(){t(new Error("timeout"))},500);try{(e.contentDocument||e.contentWindow.document).body}catch(r){i(e,n)}if(!e.offsetWidth){var a=e.cloneNode(!0);return a.name="",a.style.height="50px",a.style.position="absolute",a.style.display="block",a.style.top="10000px",a.onload=function(){var t=s(this.contentDocument);e.style.display="block",a.remove(),n(null,t)},void document.body.appendChild(a)}e.style.display="block",e.style.height="1px";var l=s(e.contentDocument);e.style.height="",n(null,l)}function i(){throw new Error("Not implemented yet")}var s=n(13);o.async=function(e,t){setTimeout(function(){o(e,t)},0)},e.exports=o},function(e,t,n){var o=n(15),i=n(6),s=n(12),r=[];t.iframe=function(e){function t(){o.async(e,function(t,n){t&&console.error(t),n&&(e.style.height=n+"px")})}t()},t.codeTabs=function(e){function t(){var t=i(e,".code-tabs"),n=(i(e,"[data-code-tabs-content]"),t.querySelector("[data-code-tabs-switches]")),o=n.firstElementChild;o.offsetWidth>n.offsetWidth?t.classList.add("code-tabs_scroll"):t.classList.remove("code-tabs_scroll")}t(),r.push(t)},window.addEventListener("resize",s(function(){r.forEach(function(e){e()})},200))},,function(e){function t(e){o[e]?o[e]():i[e]=!0}function n(e,t){i[e]?t():o[e]=t}var o={},i={};e.exports={whenReady:t,addHandler:n}},,,,,,,function(e){function t(){return n?"initial":o?"onload":i?"click":null}var n=!0,o=!1,i=!1;document.addEventListener("DOMContentLoaded",function(){setTimeout(function(){n=!1},2e3)}),document.addEventListener("click",function(){i=!0,setTimeout(function(){i=!1},50)}),window.onload=function(){o=!0,setTimeout(function(){o=!1},200)},e.exports=t},,function(e){e.exports=function(){function e(){n!=t.offsetWidth?document.body.classList.remove("no-icons"):setTimeout(e,100)}var t=document.createElement("span");document.body.appendChild(t),t.className="font-test",t.style.fontFamily="serif";var n=t.offsetWidth;t.style.fontFamily="",e()}},function(e,t,n){var o,i=n(6);document.addEventListener("mouseover",function(e){var t=i(e.target,"[data-add-class-on-hover]");t&&(o=t,t.classList.add("hover"))}),document.addEventListener("touchend",function(){setTimeout(function(){o&&(o.classList.remove("hover"),o=null)},500)}),document.addEventListener("mouseout",function(e){var t=i(e.target,"[data-add-class-on-hover]");t!=o&&(o.classList.remove("hover"),o=null)})},function(e,t,n){function o(){u&&console.log.apply(console,arguments)}function i(){o("compactifySidebar");var e=document.querySelector(".sidebar"),t=e.querySelector(".sidebar__content"),n=e.querySelector(".sidebar__inner"),i=e.classList.contains("sidebar_sticky-footer"),s=e.classList.contains("sidebar_compact");if(s){var r;r=i?t.lastElementChild.getBoundingClientRect().top-t.lastElementChild.previousElementSibling.getBoundingClientRect().bottom:t.getBoundingClientRect().bottom-t.lastElementChild.getBoundingClientRect().bottom,o("decompact?",r),r>150&&e.classList.remove("sidebar_compact")}else o(n.scrollHeight,n.clientHeight),n.scrollHeight>n.clientHeight&&(o("compact!"),e.classList.add("sidebar_compact"))}function s(){var e=document.querySelector(".sitetoolbar");if(!e)return void o("no sitetoolbar");var t=e.offsetHeight,n=document.querySelector(".sidebar");n&&(n.style.top=Math.max(e.getBoundingClientRect().bottom,0)+"px",i()),r();var s=l();if(o("scrollCause",s),null!==s)return o("browser scroll"),void(c=window.pageYOffset);var a=window.pageYOffset>c?"down":"up";"up"==a&&window.pageYOffset>t+20&&window.pageYOffset+document.documentElement.clientHeight<document.documentElement.scrollHeight-60?document.body.classList.add("page_bottom-nav"):document.body.classList.remove("page_bottom-nav"),c=window.pageYOffset}function r(){var e=document.documentElement.clientWidth<=d,t=document.querySelector('meta[name="viewport"]').content;t=t.replace(/user-scalable=\w+/,"user-scalable="+(e?"yes":"no")),document.querySelector('meta[name="viewport"]').content=t}var a,l=n(25),c=0,u=!1,d=840;!function(){function e(){o("onWindowScrollAndResizeThrottled",a),a||(a=window.requestAnimationFrame(function(){s(),a=null}))}window.addEventListener("scroll",e),window.addEventListener("resize",e),document.addEventListener("DOMContentLoaded",e)}()},function(e,t,n){function o(){var e=new s,t=new r;e.setContent(t.elem),t.start(),n.e(2,function(){e.remove();var t=n(17).AuthModal;new t})}var i=n(18),s=n(7),r=n(8);i.addHandler("login",function(){var e=document.querySelector(".sitetoolbar__login");e.onclick=function(e){e.preventDefault(),o()}}),e.exports=o},function(e){function t(){var e=document.createElement("form");e.innerHTML='<input type="hidden" name="_csrf" value="'+window.csrf+'">',e.method="POST",e.action="/auth/logout",document.body.appendChild(e),e.submit()}document.addEventListener("click",function(e){e.target.hasAttribute("data-action-user-logout")&&(e.preventDefault(),t())}),e.exports=t},function(e,t,n){function o(e){if(!~["INPUT","TEXTAREA","SELECT"].indexOf(document.activeElement.tagName)&&e[r+"Key"]){var t=null;switch(e.keyCode){case 37:t="prev";break;case 39:t="next";break;default:return}var n=document.querySelector('link[rel="'+t+'"]');n&&(document.location=n.href,e.preventDefault())}}function i(){var e,t=r[0].toUpperCase()+r.slice(1),n=document.querySelector('link[rel="next"]');n&&(e=document.querySelector('a[href="'+n.getAttribute("href")+'"] .page__nav-text-shortcut'),e.innerHTML=t+' + <span class="page__nav-text-arr">→</span>');var o=document.querySelector('link[rel="prev"]');o&&(e=document.querySelector('a[href="'+o.getAttribute("href")+'"] .page__nav-text-shortcut'),e.innerHTML=t+' + <span class="page__nav-text-arr">←</span>')}var s=n(36),r=~navigator.userAgent.toLowerCase().indexOf("mac os x")?"ctrl":"alt";s(document,{onRight:function(){var e=document.querySelector('link[rel="next"]');e&&(document.location=e.href)},onLeft:function(){var e=document.querySelector('link[rel="prev"]');e&&(document.location=e.href)}}),document.addEventListener("keydown",o),document.addEventListener("DOMContentLoaded",i)},function(){document.addEventListener("click",function(e){for(var t=e.target;t;){if(t.className.match(/_unready\b/))return void e.preventDefault();t=t.parentElement}}),document.addEventListener("submit",function(e){e.target.className.match(/_unready\b/)&&event.preventDefault()})},,,function(e){function t(e,t){t=t||{};var n,o,i,s,r,a=t.onRight||function(){},l=t.onLeft||function(){},c=t.tolerance||100,u=t.threshold||150,d=t.allowedTime||200;e.addEventListener("touchstart",function(e){var t=e.changedTouches[0];i=0,n=t.pageX,o=t.pageY,r=Date.now()},!1),e.addEventListener("touchend",function(e){var t=e.changedTouches[0];i=t.pageX-n,s=Date.now()-r,Math.abs(t.pageY-o)>c||s>d||(i>u&&a(e),-u>i&&l(e))},!1)}e.exports=t}]);