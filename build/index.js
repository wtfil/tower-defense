!function t(e,n,r){function i(a,s){if(!n[a]){if(!e[a]){var u="function"==typeof require&&require;if(!s&&u)return u(a,!0);if(o)return o(a,!0);var l=new Error("Cannot find module '"+a+"'");throw l.code="MODULE_NOT_FOUND",l}var c=n[a]={exports:{}};e[a][0].call(c.exports,function(t){var n=e[a][1][t];return i(n?n:t)},c,c.exports,t,e,n,r)}return n[a].exports}for(var o="function"==typeof require&&require,a=0;a<r.length;a++)i(r[a]);return i}({1:[function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{"default":t}}function i(){return w?setTimeout(i,1e3/60):(x.setTargets(),x.fire(),x.collision(),x.getUnits().forEach(function(t){t.move()}),void setTimeout(i,1e3/60))}function o(){var t={layer:m};l.renderMap(g.map,t),l.renderUnits(x.getUnits(),t),l.renderStats(x.getStats(),t),l.renderCursor(_,a({},t,x.cursorGrid(v.get()))),p(o)}var a=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(t[r]=n[r])}return t},s=t("./maps"),u=t("./objects"),l=t("./core/render"),c=(t("./core/utils"),t("./core/game")),f=r(c),h=t("./core/mouse"),d=r(h),g=(t("./core/constants"),s.getFirst()),p=window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||function(t){return setTimeout(t,1e3/60)},y=document.querySelector("canvas"),m=y.getContext("2d"),v=d["default"](m);m.imageSmoothingEnabled=!1,y.width=640,y.height=320;var x=f["default"](g),w=!1,_=null;x.run(),document.addEventListener("visibilitychange",function(t){return w=document.hidden}),document.addEventListener("keyup",function(t){switch(Number(t.keyCode)){case 49:_=u.arrowTower;break;case 50:_=u.cannonTower;break;default:_=null}}),y.addEventListener("click",function(t){var e;if(_){if(e=x.cursorGrid(v.get()),!e.alowed)return;x.addUnit(_,a({},e,{layer:m}))}}),l.preloadAll(function(){i(),o()})},{"./core/constants":4,"./core/game":5,"./core/mouse":6,"./core/render":7,"./core/utils":8,"./maps":10,"./objects":14}],2:[function(t,e,n){"use strict";function r(t,e){var n=e.x,r=e.y,o=e.target;this.config=t,this.x=n,this.y=r,this.createdAt=Date.now(),this.lastShotAt=0,this.alive=!0,this.isTower="tower"===t.type,this.health=t.health,this.target=o||null,this.path=null,this.angle=o?i.getAngle(this,o):0}n.__esModule=!0;var i=t("./utils");r.prototype.move=function(){this.config.homing&&this.target?this.angle=i.getAngle(this,this.target):this.path&&(this.angle=i.getAngle(this,this.path[0]),i.round(this.x-this.path[0].x,5)||i.round(this.y-this.path[0].y,5)||(this.path=this.path.slice(1),this.path.length||(this.path=null))),this.x+=this.config.movementSpeed*Math.cos(this.angle),this.y+=this.config.movementSpeed*Math.sin(this.angle)},r.prototype.setPath=function(t){this.path=t},r.prototype.setTarget=function(t){this.target=t},r.prototype.takeDamage=function(t){this.health-=t,this.health<=0&&this.die()},r.prototype.fire=function(){var t=1e3/this.config.attackSpeed,e=Date.now();return this.target&&this.lastShotAt+t<e?(this.lastShotAt=e,!0):null},r.prototype.die=function(){this.alive=!1,this.health=0},n["default"]=r,e.exports=n["default"]},{"./utils":8}],3:[function(t,e,n){"use strict";function r(t,e,n){var i=n[o(e)];return i=i.x===t.x&&i.y===t.y?i:r(t,i,n),[e].concat(i)}function i(t,e,n){for(var i,a,s,u,l,c,f,h,d=[t],g={},p={},y={},m=(i={},i[o(t)]=0,i),v=n[0].length,x=n.length;d.length;){if(s=d.shift(),s.x===e.x&&s.y===e.y)return r(t,e,y).reverse();for(c=o(s),u=m[c],g[c]=!0,f=[{x:s.x-1,y:s.y},{x:s.x+1,y:s.y},{x:s.x,y:s.y-1},{x:s.x,y:s.y+1}],a=0;4>a;a++)h=f[a],c=o(h),p[c]||h.x<0||h.x>=v||h.y<0||h.y>=x||n[h.y][h.x]||(l=u+1,(!(c in m)||l<m[c])&&(m[c]=l,y[c]=s),p[c]=!0,d.push(h))}return null}n.__esModule=!0,n["default"]=i;var o=function(t){return t.x+","+t.y};Math.abs;e.exports=n["default"]},{}],4:[function(t,e,n){"use strict";n.__esModule=!0;var r=32;n.SEGMENT=r},{}],5:[function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{"default":t}}function i(t){function e(t){return{x:Math.floor(t.x/s.SEGMENT),y:Math.floor(t.y/s.SEGMENT)}}function n(){b.forEach(function(n){var r=l["default"](e(n),t.finish,N).slice(1).map(function(t){return{x:t.x*s.SEGMENT,y:t.y*s.SEGMENT}});n.setPath(r)})}function r(t,r){var i=new a["default"](t,r),o=e(r);i.isTower?(N[o.y][o.x]=1,T.push(i),n()):(b.push(i),n())}function i(){return T.concat(b).concat(k)}function o(){var t,e,n,r;for(t=0;t<T.length;t++){if(n=T[t],r=n.target){if(c.inRange(n,r))continue;n.setTarget(null)}for(e=0;e<b.length;e++)r=b[e],c.inRange(n,r)&&n.setTarget(r)}}function u(){var t,e;for(t=0;t<T.length;t++)e=T[t],e.fire()&&k.push(new a["default"](e.config.shot,{x:e.x,y:e.y,target:e.target,angle:c.getAngle(e,e.target)}))}function f(){var t,e,n;for(t=0;t<k.length;t++)if(n=k[t],n.config.homing&&n.target&&c.inObject(n,n.target))h(n,n.target);else if(!n.config.homing)for(e=0;e<b.length;e++)if(c.inObject(n,b[e])){h(n,b[e]);break}for(g(),t=0;t<b.length;t++)c.inObject(b[t],A)||(_--,b[t].die());g()}function h(t,e){var n;if(t.config.splash)for(n=0;n<b.length;n++)c.inSplash(t,b[n])&&d(t,b[n]);else d(t,e);t.die()}function d(t,e){e.takeDamage(t.config.damage)}function g(){var t,e=[];for(t=0;t<b.length;t++)b[t].alive?e.push(b[t]):p(b[t]);k=k.filter(function(t){return t.alive}),b=e}function p(t){var e;for(e=0;e<T.length;e++)T[e].target===t&&T[e].setTarget(null);S--,S||(w++,setTimeout(m,5e3))}function y(n){var r=n.x,i=n.y;r=c.round(r,s.SEGMENT),i=c.round(i,s.SEGMENT);var o,a,u,f=b.concat(T),h={x:r,y:i},d=e(h);for(o=0;o<f.length;o++)if(c.inObject(h,f[o]))return{x:r,y:i,alowed:!1};return d.x<0||d.x>=t.size.width||d.y<0||d.y>=t.size.height?{x:r,y:i,alowed:!1}:(u=N.slice(),u[d.y]=N[d.y].slice(),u[d.y][d.x]=1,a=!!l["default"](t.spawn,t.finish,u),{x:r,y:i,alowed:a})}function m(){function e(){i>=n.count||(r(n.unit,{x:t.spawn.x*s.SEGMENT,y:t.spawn.y*s.SEGMENT}),i++,setTimeout(e,c.random(o,3*o)))}if(w>=t.waves.length)return console.log("END GAME");var n=t.waves[w],i=0,o=1e4/n.count;S=n.count,e()}function v(){m()}function x(){return{wave:w+1,lives:_,score:E,gold:M,unitsInWave:S}}var w=0,_=t.lives,M=t.gold,E=0,S=0,T=[],b=[],k=[],A={x:0,y:0,config:{width:t.size.width*s.SEGMENT,height:t.size.height*s.SEGMENT}},N=new Array(t.size.height).join().split(",").map(function(e){return new Array(t.size.width).join().split(",").map(Number)});return{addUnit:r,getUnits:i,setTargets:o,fire:u,collision:f,cursorGrid:y,run:v,getStats:x}}n.__esModule=!0,n["default"]=i;var o=t("./Unit"),a=r(o),s=t("./constants"),u=t("./algorithms/astar"),l=r(u),c=t("./utils");e.exports=n["default"]},{"./Unit":2,"./algorithms/astar":3,"./constants":4,"./utils":8}],6:[function(t,e,n){"use strict";n.__esModule=!0,n["default"]=function(t){var e=0,n=0;return t.canvas.addEventListener("mousemove",function(t){e=t.clientX,n=t.clientY}),{get:function(){return{x:e,y:n}}}},e.exports=n["default"]},{}],7:[function(t,e,n){"use strict";function r(t,e){function n(){var e=u/t.health;o.imageSmoothingEnabled=!1,o.drawImage(f,r,i,t.width,t.height),o.globalAlpha=1,"health"in t&&(o.fillStyle="#00FF00",o.fillRect(r,i,t.width,2),o.fillStyle="#FF0000",o.fillRect(r+e*t.width,i,(1-e)*t.width,2))}var r=e.x,i=e.y,o=e.layer,a=e.time,s=void 0===a?0:a,u=e.health,l=~~((Date.now()-s)/h)%t.textures.length,c=t.textures[l],f=g[c];f||(f=g[c]=new Image,f.src=c,f.loads=[],f.onload=function(){f.loads.forEach(function(t){return t()})}),f.complete?n():f.loads.push(n)}function i(t,e){var n=e.layer;t.forEach(function(t,e){t.forEach(function(t,i){var o={x:f.SEGMENT*i,y:f.SEGMENT*e,layer:n};r(t,o)})})}function o(t,e){var n=e.x,i=e.y,o=e.layer,a=e.alowed;t&&(o.globalAlpha=.4,o.fillStyle=a?"#00FF00":"#FF0000",o.fillRect(n,i,f.SEGMENT,f.SEGMENT),r(t,{layer:o,x:n,y:i}))}function a(t,e){var n=e.layer;t.forEach(function(t){r(t.config,{layer:n,x:t.x,y:t.y,health:t.health,time:t.createdAt})})}function s(t,e){var n=e.layer,r=e.x,i=e.y;n.strokeStyle="black",n.font="16px monaco",n.lineWidth=4,n.strokeText(t,r,i),n.fillStyle="white",n.fillText(t,r,i)}function u(t,e){var n=e.layer;s("wave:  "+t.wave,{x:10,y:20,layer:n}),s("lives: "+t.lives,{x:10,y:40,layer:n}),s("gold:  "+t.gold,{x:10,y:60,layer:n}),s("score: "+t.score,{x:10,y:80,layer:n}),s("Use 1 or 2 to build the tower",{x:140,y:20,layer:n})}function l(t,e){var n=t.reduce(function(t,e){return t.concat(e.textures)},[]).filter(Boolean);Promise.all(n.map(function(t){return new Promise(function(e){var n=new Image;g[t]=n,n.onload=e,n.loads=[],n.src=t})})).then(e)}function c(t){var e=Object.keys(d).map(function(t){return d[t]});return l(e,t)}n.__esModule=!0,n.render=r,n.renderMap=i,n.renderCursor=o,n.renderUnits=a,n.renderStats=u,n.preload=l,n.preloadAll=c;var f=t("./constants"),h=300,d=t("../objects"),g=[]},{"../objects":14,"./constants":4}],8:[function(t,e,n){"use strict";function r(t,e){return l(e.x-t.x)+l(e.y-t.y)<l(t.config.range)}function i(t,e){var n=e.x-t.x,r=e.y-t.y,i=Math.atan(r/n);return 0>n&&(i=Math.PI+i),i}function o(t,e){var n=t.config?t.config.width/2:0,r=t.config?t.config.height/2:0;return t.x>=e.x-n&&t.x<e.x+e.config.width+n&&t.y>=e.y-r&&t.y<e.y+e.config.height+r}function a(t,e){return l(t.x-e.x-e.config.width)+l(t.y-e.y-e.config.height)<l(t.config.splash)}function s(t,e){return Math.round(Math.random()*(e-t))+t}function u(t){var e=arguments.length<=1||void 0===arguments[1]?1:arguments[1];return t-t%e}n.__esModule=!0,n.inRange=r,n.getAngle=i,n.inObject=o,n.inSplash=a,n.random=s,n.round=u;var l=(Math.sqrt,function(t){return t*t})},{}],9:[function(t,e,n){"use strict";n.__esModule=!0,n["default"]={lives:3,gold:100,size:{width:20,height:10},spawn:{x:0,y:5},finish:{x:19,y:5},waves:[[1,10],[1,20]],map:"\n	11111111111111111111\n	11111111111111111111\n	11111111111111111111\n	11111111111111111111\n	11111111111111111111\n	11111111111111111111\n	11111111111111111111\n	11111111111111111111\n	11111111111111111111\n	11111111111111111111\n	"},e.exports=n["default"]},{}],10:[function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{"default":t}}function i(t){return t.split("\n").filter(Boolean).map(function(t){return t.trim().split("").map(Number).map(function(t){return f[t]})})}function o(t){return t.map(function(t){return{unit:h[t[0]],count:t[1]}})}function a(){var t=l["default"];return s({},t,{map:i(t.map),waves:o(t.waves)})}n.__esModule=!0;var s=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(t[r]=n[r])}return t};n.getFirst=a;var u=t("./first"),l=r(u),c=t("../objects"),f={0:c.sand,1:c.grass,2:c.rock},h={1:c.unit}},{"../objects":14,"./first":9}],11:[function(t,e,n){"use strict";n.__esModule=!0,n["default"]={name:"Arrow Tower",type:"tower",textures:["images/tower_1_2.png"],width:32,height:32,movementSpeed:0,attackSpeed:2,range:250,shot:{textures:["images/shot_1.png"],damage:10,homing:!0,movementSpeed:4,width:10,height:10}},e.exports=n["default"]},{}],12:[function(t,e,n){"use strict";n.__esModule=!0,n["default"]={name:"Cannon Tower",type:"tower",textures:["images/tower_2_1.png"],width:32,height:32,movementSpeed:0,attackSpeed:1,range:250,shot:{textures:["images/shot_2.png"],damage:30,homing:!1,splash:30,movementSpeed:1.5,width:10,height:10}},e.exports=n["default"]},{}],13:[function(t,e,n){"use strict";n.__esModule=!0,n["default"]={name:"Grass",textures:["images/grass_1.png"],width:32,height:32},e.exports=n["default"]},{}],14:[function(t,e,n){"use strict";function r(t){return t&&t.__esModule?t:{"default":t}}n.__esModule=!0;var i=t("./grass"),o=r(i);n.grass=o["default"];var a=t("./sand"),s=r(a);n.sand=s["default"];var u=t("./rock"),l=r(u);n.rock=l["default"];var c=t("./arrowTower"),f=r(c);n.arrowTower=f["default"];var h=t("./cannonTower"),d=r(h);n.cannonTower=d["default"];var g=t("./unit"),p=r(g);n.unit=p["default"]},{"./arrowTower":11,"./cannonTower":12,"./grass":13,"./rock":15,"./sand":16,"./unit":17}],15:[function(t,e,n){"use strict";n.__esModule=!0,n["default"]={name:"Rock",textures:["images/rock.png"],width:32,height:32},e.exports=n["default"]},{}],16:[function(t,e,n){"use strict";n.__esModule=!0,n["default"]={name:"Sand",textures:["images/sand.png"],width:32,height:32},e.exports=n["default"]},{}],17:[function(t,e,n){"use strict";n.__esModule=!0,n["default"]={name:"Unit",type:"unit",textures:["images/unit_1_1.png","images/unit_1_2.png"],width:20,height:36,movementSpeed:1,health:100,damage:0},e.exports=n["default"]},{}]},{},[1]);