!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports):"function"==typeof define&&define.amd?define(["exports"],e):e((t="undefined"!=typeof globalThis?globalThis:t||self).ParrotDomUtils={})}(this,(function(t){"use strict";function e(t){if(null===t)return window;if("[object Window]"!==t.toString()){const e=t.ownerDocument;return e&&e.defaultView||window}return t}function n(t){return t instanceof e(t).Element||t instanceof Element}function o(t){return t instanceof e(t).HTMLElement||t instanceof HTMLElement}function i(t){if("undefined"==typeof ShadowRoot)return!1;return t instanceof e(t).ShadowRoot||t instanceof ShadowRoot}function r(t){return t?(t.nodeName||"").toLowerCase():null}function l(t){return((n(t)?t.ownerDocument:t.document)||window.document).documentElement}function c(t){return"html"===r(t)?t:t.assignedSlot||t.parentNode||(i(t)?t.host:null)||l(t)}function f(t){return e(t).getComputedStyle(t)}function u(t){const{overflow:e,overflowX:n,overflowY:o}=f(t);return/auto|scroll|overlay|hidden/.test(e+o+n)}function d(t){return["html","body","#document"].indexOf(r(t))>=0?t.ownerDocument.body:o(t)&&u(t)?t:d(c(t))}function s(t,n=[]){var o;const i=d(t),r=i===(null===(o=t.ownerDocument)||void 0===o?void 0:o.body),l=e(i),f=r?[l].concat(l.visualViewport||[],u(i)?i:[]):i,a=n.concat(f);return r?a:a.concat(s(c(f)))}function a(t){return["table","td","th"].indexOf(r(t))>=0}function h(t){return o(t)&&"fixed"!==getComputedStyle(t).position?t.offsetParent:null}function g(t){const n=e(t);let i=h(t);for(;i&&a(i)&&"static"===getComputedStyle(i).position;)i=h(i);return i&&("html"===r(i)||"body"===r(i)&&"static"===getComputedStyle(i).position)?n:i||function(t){const e=-1!==navigator.userAgent.toLowerCase().indexOf("firefox");if(-1!==navigator.userAgent.indexOf("Trident")&&o(t)&&"fixed"===getComputedStyle(t).position)return null;let n=c(t);for(;o(n)&&["html","body"].indexOf(r(n))<0;){const t=getComputedStyle(n);if("none"!==t.transform||"none"!==t.perspective||"paint"===t.contain||-1!==["transform","perspective"].indexOf(t.willChange)||e&&"filter"===t.willChange||e&&t.filter&&"none"!==t.filter)return n;n=n.parentNode}return null}(t)}function p(t){const e=t.getBoundingClientRect();return{width:e.width,height:e.height,top:e.top,right:e.right,bottom:e.bottom,left:e.left,x:e.left,y:e.top}}function m(t,e){const n=e.getRootNode&&e.getRootNode();if(t.contains(e))return!0;if(n&&i(n)){let n=e;do{if(n&&t.isSameNode(n))return!0;n=n.parentNode||n.host}while(n)}return!1}function w(t){const n=e(t);return{scrollLeft:n.pageXOffset,scrollTop:n.pageYOffset}}function y(t){return p(l(t)).left+w(t).scrollLeft}function b(t){const n=e(t),o=l(t),i=n.visualViewport;let r=o.clientWidth,c=o.clientHeight,f=0,u=0;return i&&(r=i.width,c=i.height,/^((?!chrome|android).)*safari/i.test(navigator.userAgent)||(f=i.offsetLeft,u=i.offsetTop)),{width:r,height:c,x:f+y(t),y:u}}const x=Math.max;function v(t){var e;const n=l(t),o=w(t),i=null===(e=t.ownerDocument)||void 0===e?void 0:e.body,r=x(n.scrollWidth,n.clientWidth,i?i.scrollWidth:0,i?i.clientWidth:0),c=x(n.scrollHeight,n.clientHeight,i?i.scrollHeight:0,i?i.clientHeight:0);let u=-o.scrollLeft+y(t);const d=-o.scrollTop;return"rtl"===f(i||n).direction&&(u+=x(n.clientWidth,i?i.clientWidth:0)-r),{width:r,height:c,x:u,y:d}}function S(t){return Object.assign(Object.assign({},t),{left:t.x,top:t.y,right:t.x+t.width,bottom:t.y+t.height})}const C=Math.max,O=Math.min;function W(t,e){return"viewport"===e?S(b(t)):o(e)?function(t){const e=p(t);return e.top=e.top+t.clientTop,e.left=e.left+t.clientLeft,e.bottom=e.top+t.clientHeight,e.right=e.left+t.clientWidth,e.width=t.clientWidth,e.height=t.clientHeight,e.x=e.left,e.y=e.top,e}(e):S(v(l(t)))}t.contains=m,t.getBoundingClientRect=p,t.getClippingRect=function(t,e,i){const l=[..."clippingParents"===e?function(t){const e=s(c(t)),i=["absolute","fixed"].indexOf(f(t).position)>=0&&o(t)?g(t):t;return n(i)?e.filter((t=>n(t)&&m(t,i)&&"body"!==r(t))):[]}(t):[].concat(e),i],u=l[0],d=l.reduce(((e,n)=>{const o=W(t,n);return e.top=C(o.top,e.top),e.right=O(o.right,e.right),e.bottom=O(o.bottom,e.bottom),e.left=C(o.left,e.left),e}),W(t,u));return d.width=d.right-d.left,d.height=d.bottom-d.top,d.x=d.left,d.y=d.top,d},t.getComputedStyle=f,t.getDocumentElement=l,t.getDocumentRect=v,t.getNodeName=r,t.getOffsetParent=g,t.getParentNode=c,t.getScrollParent=d,t.getViewportRect=b,t.getWindow=e,t.getWindowScroll=w,t.getWindowScrollBarX=y,t.isElement=n,t.isHTMLElement=o,t.isScrollParent=u,t.isShadowRoot=i,t.listScrollParents=s,t.rectToClientRect=S,t.reflow=function(t){return t.scrollTop},Object.defineProperty(t,"__esModule",{value:!0})}));
