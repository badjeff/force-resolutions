#!/usr/bin/env node

"use strict";var e=require("fs");function n(e,n,i,o){return new(i||(i=Promise))((function(r,t){function s(e){try{c(o.next(e))}catch(e){t(e)}}function d(e){try{c(o.throw(e))}catch(e){t(e)}}function c(e){var n;e.done?r(e.value):(n=e.value,n instanceof i?n:new i((function(e){e(n)}))).then(s,d)}c((o=o.apply(e,n||[])).next())}))}const i=i=>n(void 0,void 0,void 0,(function*(){try{return yield e.promises.access(i,e.constants.O_RDWR),!0}catch(e){return!1}}));let o,r,t,s,d=!0;"undefined"!=typeof process&&(({FORCE_COLOR:o,NODE_DISABLE_COLORS:r,NO_COLOR:t,TERM:s}=process.env),d=process.stdout&&process.stdout.isTTY);const c={enabled:!r&&null==t&&"dumb"!==s&&(null!=o&&"0"!==o||d),reset:a(0,0),bold:a(1,22),dim:a(2,22),italic:a(3,23),underline:a(4,24),inverse:a(7,27),hidden:a(8,28),strikethrough:a(9,29),black:a(30,39),red:a(31,39),green:a(32,39),yellow:a(33,39),blue:a(34,39),magenta:a(35,39),cyan:a(36,39),white:a(37,39),gray:a(90,39),grey:a(90,39),bgBlack:a(40,49),bgRed:a(41,49),bgGreen:a(42,49),bgYellow:a(43,49),bgBlue:a(44,49),bgMagenta:a(45,49),bgCyan:a(46,49),bgWhite:a(47,49)};function l(e,n){let i,o=0,r="",t="";for(;o<e.length;o++)i=e[o],r+=i.open,t+=i.close,~n.indexOf(i.close)&&(n=n.replace(i.rgx,i.close+i.open));return r+n+t}function a(e,n){let i={open:`[${e}m`,close:`[${n}m`,rgx:new RegExp(`\\x1b\\[${n}m`,"g")};return function(n){return void 0!==this&&void 0!==this.has?(~this.has.indexOf(e)||(this.has.push(e),this.keys.push(i)),void 0===n?this:c.enabled?l(this.keys,n+""):n+""):void 0===n?function(e,n){let i={has:e,keys:n};return i.reset=c.reset.bind(i),i.bold=c.bold.bind(i),i.dim=c.dim.bind(i),i.italic=c.italic.bind(i),i.underline=c.underline.bind(i),i.inverse=c.inverse.bind(i),i.hidden=c.hidden.bind(i),i.strikethrough=c.strikethrough.bind(i),i.black=c.black.bind(i),i.red=c.red.bind(i),i.green=c.green.bind(i),i.yellow=c.yellow.bind(i),i.blue=c.blue.bind(i),i.magenta=c.magenta.bind(i),i.cyan=c.cyan.bind(i),i.white=c.white.bind(i),i.gray=c.gray.bind(i),i.grey=c.grey.bind(i),i.bgBlack=c.bgBlack.bind(i),i.bgRed=c.bgRed.bind(i),i.bgGreen=c.bgGreen.bind(i),i.bgYellow=c.bgYellow.bind(i),i.bgBlue=c.bgBlue.bind(i),i.bgMagenta=c.bgMagenta.bind(i),i.bgCyan=c.bgCyan.bind(i),i.bgWhite=c.bgWhite.bind(i),i}([e],[i]):c.enabled?l([i],n+""):n+""}}(function(){return n(this,void 0,void 0,(function*(){try{const n="win32"===process.platform,o=process.cwd(),r=n?"\\":"/",t=`${o}${r}package-lock.json`,s=`${o}${r}package.json`,d=yield i(t),l=yield i(s);if(d&&l){const n=yield e.promises.readFile(s),d=yield e.promises.readFile(t);let l=JSON.parse(n.toString()),a=JSON.parse(d.toString());const g=`${o}${r}package-resolutions.json`,u=(yield i(g))?yield e.promises.readFile(g):void 0,b=u?JSON.parse(u.toString()):void 0,h=b?b.resolutions:l.resolutions;console.log(c.cyan("Applying forced resolutions")),h&&(Object.keys(h).forEach((e=>{const n=new RegExp(`${e}$`),i=((e,n)=>{const i=[],o=[],r=[];if(!e&&("object"!=typeof e||Array.isArray(e)))throw new TypeError("First argument of finPropPath is not the correct type Object");if("function"!=typeof n)throw new TypeError("Predicate is not a function");const t=e=>{Object.keys(e).forEach((s=>{!0===n(s,o,e)&&(o.push(s),r.push(o.join(".")),o.pop());const d=e[s];d&&"object"==typeof d&&!Array.isArray(d)&&(i.find((e=>e===d))||(o.push(s),i.push(d),t(d),o.pop()))}))};return t(e),r})(a,((e,i,o)=>{const r=[...i,e].join(".");return n.test(r)}));let o={};i.forEach((n=>{const i=/packages\./g,r=/packages\.node_modules\/.*node_modules\/.*/g,t=/\.requires\./g;if(!n.match(/\.dependencies\./g)||n.match(t)||n.match(i)){if(n.match(i))n.match(r)?(o[`${n}.version`]=h[e],o[`${n}.resolved`]=void 0,o[`${n}.integrity`]=void 0,o[`${n}.requires`]=void 0,o[`${n}.deprecated`]=void 0,o[`${n}.dependencies`]=void 0):o[n]=h[e];else if(n.match(t)){o[n]=h[e];const i=n.replace("requires","dependencies");o[`${i}.version`]=h[e],o[`${i}.resolved`]=void 0,o[`${i}.integrity`]=void 0,o[`${i}.requires`]=void 0}}else o[`${n}.version`]=h[e],o[`${n}.resolved`]=void 0,o[`${n}.integrity`]=void 0,o[`${n}.requires`]=void 0})),a=((e,n)=>(Object.keys(n).forEach((i=>{let o=e,r=i.split("."),t=r.pop();r.forEach((e=>(o[e]=o[e]||{})&&(o=o[e]))),t&&(o[t]=n[i])})),e))(a,o),console.log(c.dim(`${e} => ${h[e]}`)),o={}})),yield e.promises.writeFile(t,JSON.stringify(a,null,2)),console.log(c.green("Finished applying forced resolutions")))}}catch(e){console.log(c.red("An unexpected error has occurred while running force-resolutions")),console.error(e)}}))})().then();
