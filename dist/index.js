!function(t){var e={};function r(n){if(e[n])return e[n].exports;var i=e[n]={i:n,l:!1,exports:{}};return t[n].call(i.exports,i,i.exports,r),i.l=!0,i.exports}r.m=t,r.c=e,r.d=function(t,e,n){r.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},r.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},r.t=function(t,e){if(1&e&&(t=r(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var i in t)r.d(n,i,function(e){return t[e]}.bind(null,i));return n},r.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return r.d(e,"a",e),e},r.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},r.p="",r(r.s=0)}([function(t,e,r){"use strict";function n(t,e){if(t===e)return t;if(typeof t!=typeof e)return e;if(!e||!t)return e;if("object"==typeof t){let r=!1;for(let i in e){const o=n(t[i],e[i]);o!==t[i]?(e[i]=o,r=!0):e[i]=t[i]}for(let n in t)n in e||(r=!0);return r?e:t}return e}function i(t){let e=t;if(e&&"object"==typeof t){e=t.constructor===[].constructor?[]:{};for(const r in t)e[r]=i(t[r])}return e}r.r(e),r.d(e,"default",function(){return o});class o{constructor(t={}){this.initialState=t,this.listeners=[],this.currentState=t}get(){return i(this.currentState)}set(t,e=!1){const r=this.currentState;this.currentState=t,e||this.listeners.forEach(e=>{const i=e.map?e.map(r):r;n(i,e.map?e.map(t):t)!==i&&e.action(this.currentState,r)})}subscribe(t,e=null){this.listeners.push({map:e,action:t})}unsubscribe(t){this.listeners=this.listeners.filter(e=>e.action!==t)}reset(){this.currentState=this.initialState}update(t,e=!1){const r=function(t,e){const r=i(t),o=e(r);return o||n(t,r)}(this.currentState,t);r!==this.currentState&&this.set(r,e)}awaiter(t,e){return new Promise(r=>{this.subscribe(e=>{const n=t(e);void 0!==n&&r(n)},e)})}}}]);