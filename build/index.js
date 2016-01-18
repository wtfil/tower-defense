!function t(e,n,i){function r(a,s){if(!n[a]){if(!e[a]){var u="function"==typeof require&&require;if(!s&&u)return u(a,!0);if(o)return o(a,!0);var f=new Error("Cannot find module '"+a+"'");throw f.code="MODULE_NOT_FOUND",f}var c=n[a]={exports:{}};e[a][0].call(c.exports,function(t){var n=e[a][1][t];return r(n?n:t)},c,c.exports,t,e,n,i)}return n[a].exports}for(var o="function"==typeof require&&require,a=0;a<i.length;a++)r(i[a]);return r}({1:[function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{"default":t}}function r(t){if(t&&t.__esModule)return t;var e={};if(null!=t)for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n]);return e["default"]=t,e}function o(){var t=setTimeout.bind(null,o,1e3/60);if(E)return t();var e=S.getStats();return e.lives<=0?(S.destroy(),S=d["default"](m),S.run(),t()):(S.setTargets(),S.fire(),S.collision(),S.getUnits().forEach(function(t){t.move()}),void t())}function a(){var t={layer:v};v.clearRect(0,0,1e3,1e3),l.renderMap(m.map,t),l.renderUnits(S.getUnits(),t),l.renderStats(S.getStats(),t),b&&l.renderCursor(b,s({},t,S.buildAtributes(b,w.get()))),y(a)}var s=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var i in n)Object.prototype.hasOwnProperty.call(n,i)&&(t[i]=n[i])}return t},u=t("./maps"),f=t("./objects"),c=r(f),l=t("./core/render"),h=(t("./core/utils"),t("./core/game")),d=i(h),g=t("./core/mouse"),p=i(g),m=(t("./core/constants"),u.getFirst()),y=window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||function(t){return setTimeout(t,1e3/60)},x=document.querySelector("canvas"),v=x.getContext("2d"),w=p["default"](v),_=Object.keys(c).map(function(t){return c[t]}).filter(function(t){return"tower"===t.type});v.imageSmoothingEnabled=!1,x.width=640,x.height=320;var S=d["default"](m),E=!1,b=null;S.run(),l.renderPanel(document.querySelector("[data-panel]")),document.addEventListener("visibilitychange",function(t){return E=document.hidden}),document.addEventListener("contextmenu",function(t){t.preventDefault(),b=null}),_.forEach(function(t){document.querySelector('[data-tower="'+t.name+'"]').addEventListener("click",function(e){b=t})}),x.addEventListener("click",function(t){var e;if(b){if(e=S.buildAtributes(b,w.get()),!e.alowed)return;S.buildTower(b,e)}}),l.preloadAll(function(){o(),a()})},{"./core/constants":4,"./core/game":5,"./core/mouse":6,"./core/render":7,"./core/utils":8,"./maps":10,"./objects":15}],2:[function(t,e,n){"use strict";function i(t,e){var n=e.x,i=e.y,r=e.target;this.config=t,this.x=n,this.y=i,this.createdAt=Date.now(),this.lastShotAt=0,this.alive=!0,this.health=t.health,this.target=r||null,this.path=null,this.buffs={},this.angle=r?o.getAngle(this,r):0,this.applyBuffs()}n.__esModule=!0;var r=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var i in n)Object.prototype.hasOwnProperty.call(n,i)&&(t[i]=n[i])}return t},o=t("./utils");i.prototype.applyBuffs=function(){var t,e;this.movementSpeed=this.config.movementSpeed;for(t in this.buffs)e=this.buffs[t],e.duration+e.startAt<Date.now()?delete this.buffs[t]:this.buffs[t].effect(this)},i.prototype.move=function(){this.applyBuffs(),this.config.homing&&this.target?this.angle=o.getAngle(this,this.target):this.path&&(this.angle=o.getAngle(this,this.path[0]),o.round(this.x-this.path[0].x,5)||o.round(this.y-this.path[0].y,5)||(this.path=this.path.slice(1),this.path.length||(this.path=null))),this.x+=this.movementSpeed*Math.cos(this.angle),this.y+=this.movementSpeed*Math.sin(this.angle)},i.prototype.setPath=function(t){this.path=t},i.prototype.setTarget=function(t){this.target=t},i.prototype.takeDamage=function(t){this.health-=t.damage,t.buff&&(this.buffs[t.buff.name]=r({},t.buff,{startAt:Date.now()}),this.applyBuffs()),this.health<=0&&this.die()},i.prototype.fire=function(){var t=1e3/this.config.attackSpeed,e=Date.now();return this.target&&this.lastShotAt+t<e?(this.lastShotAt=e,!0):null},i.prototype.die=function(){this.alive=!1,this.health=0,this.bounty=this.config.bounty},i.prototype.dieWithoutBounty=function(){this.alive=!1,this.health=0,this.bounty=0},n["default"]=i,e.exports=n["default"]},{"./utils":8}],3:[function(t,e,n){"use strict";function i(t,e,n){var r=n[o(e)];return r=r.x===t.x&&r.y===t.y?r:i(t,r,n),[e].concat(r)}function r(t,e,n){for(var r,a,s,u,f,c,l,h,d=[t],g={},p={},m={},y=(r={},r[o(t)]=0,r),x=n[0].length,v=n.length;d.length;){if(s=d.shift(),s.x===e.x&&s.y===e.y)return i(t,e,m).reverse();for(c=o(s),u=y[c],g[c]=!0,l=[{x:s.x-1,y:s.y},{x:s.x+1,y:s.y},{x:s.x,y:s.y-1},{x:s.x,y:s.y+1}],a=0;4>a;a++)h=l[a],c=o(h),p[c]||h.x<0||h.x>=x||h.y<0||h.y>=v||n[h.y][h.x]||(f=u+1,(!(c in y)||f<y[c])&&(y[c]=f,m[c]=s),p[c]=!0,d.push(h))}return null}n.__esModule=!0,n["default"]=r;var o=function(t){return t.x+","+t.y};Math.abs;e.exports=n["default"]},{}],4:[function(t,e,n){"use strict";n.__esModule=!0;var i=32;n.SEGMENT=i},{}],5:[function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{"default":t}}function r(t){function e(t){return{x:Math.floor(t.x/s.SEGMENT),y:Math.floor(t.y/s.SEGMENT)}}function n(){j.forEach(i)}function i(n){var i=f["default"](e(n),t.finish,P).slice(1).map(function(t){return{x:t.x*s.SEGMENT,y:t.y*s.SEGMENT}});n.setPath(i)}function r(t,i){var r=e(i);O.push(new a["default"](t,i)),P[r.y][r.x]=1,U={},T-=t.price,n()}function o(t,e){var n=new a["default"](t,e);j.push(n),i(n)}function u(){return O.concat(j).concat(k).concat(G)}function l(){var t,e,n,i,r,o,a;for(t=0;t<O.length;t++){if(n=O[t],i=n.target){if(c.inRange(n,i))continue;n.setTarget(null)}for(o=1/0,r=null,e=0;e<j.length;e++)i=j[e],a=c.inRangeDiff(n,i),0>a&&o>a&&(r=i,o=a),r&&n.setTarget(r)}}function h(){var t,e;for(t=0;t<O.length;t++)e=O[t],e.fire()&&k.push(new a["default"](e.config.shot,{x:e.x,y:e.y,target:e.target,angle:c.getAngle(e,e.target)}))}function d(){var t,e,n;for(t=0;t<k.length;t++)if(n=k[t],n.config.homing&&n.target&&c.inObject(n,n.target))g(n,n.target);else if(!n.config.homing)for(e=0;e<j.length;e++)if(c.inObject(n,j[e])){g(n,j[e]);break}for(m(),t=0;t<j.length;t++)c.inObject(j[t],F)&&(M--,j[t].dieWithoutBounty());m()}function g(t,e){var n;if(t.config.splash)for(n=0;n<j.length;n++)c.inSplash(t,j[n])&&p(t,j[n]);else p(t,e);t.die(),t.config.death&&G.push(new a["default"](t.config.death,{x:t.x,y:t.y}))}function p(t,e){e.takeDamage(t.config)}function m(){var t,e=Date.now(),n=[];for(t=0;t<j.length;t++)j[t].alive?n.push(j[t]):y(j[t]);k=k.filter(function(t){return t.alive}),G=G.filter(function(t){return t.config.corpse||60*t.config.textures.length+t.createdAt>e}),j=n}function y(t,e){var n,i=O.concat(k);for(n=0;n<i.length;n++)i[n].target===t&&i[n].setTarget(null);e||(T+=t.bounty,N--,N||(b++,w()))}function x(e){var n,i=e.x+","+e.y;return U[i]?U[i]:(n=P.slice(),n[e.y]=P[e.y].slice(),n[e.y][e.x]=1,U[i]=!!f["default"](t.spawn,t.finish,n),U[i])}function v(n,i){var r,o=j.concat(O),a=e(i),u=a.x*s.SEGMENT,f=a.y*s.SEGMENT,l={x:u,y:f,config:n};if(n.price>T)return{x:u,y:f,alowed:!1};for(r=0;r<o.length;r++)if(c.isOverlap(o[r],l))return{x:u,y:f,alowed:!1};return a.x<0||a.x>=t.size.width||a.y<0||a.y>=t.size.height?{x:u,y:f,alowed:!1}:{x:u,y:f,alowed:x(a)}}function w(){function e(){i>=n.count||(o(n.unit,{x:t.spawn.x*s.SEGMENT,y:t.spawn.y*s.SEGMENT}),i++,D=setTimeout(e,3e3))}if(b>=t.waves.length)return console.log("END GAME");var n=t.waves[b],i=0;N=n.count,D=setTimeout(e,5e3)}function _(){w()}function S(){clearTimeout(D),j.forEach(function(t){return y(t,!0)}),j=[],O=[],k=[]}function E(){return{wave:b+1,lives:M,score:A,gold:T,unitsInWave:N}}var b=0,M=t.lives,T=t.gold,A=0,N=0,O=[],j=[],k=[],G=[],D=null,F=({x:0,y:0,config:{width:t.size.width*s.SEGMENT,height:t.size.height*s.SEGMENT}},{x:t.finish.x*s.SEGMENT,y:t.finish.y*s.SEGMENT,config:{width:s.SEGMENT,height:s.SEGMENT}}),P=new Array(t.size.height).join().split(",").map(function(e){return new Array(t.size.width).join().split(",").map(Number)}),U={};return{buildTower:r,addUnit:o,getUnits:u,setTargets:l,fire:h,collision:d,buildAtributes:v,run:_,getStats:E,destroy:S}}n.__esModule=!0,n["default"]=r;var o=t("./Unit"),a=i(o),s=t("./constants"),u=t("./algorithms/astar"),f=i(u),c=t("./utils");e.exports=n["default"]},{"./Unit":2,"./algorithms/astar":3,"./constants":4,"./utils":8}],6:[function(t,e,n){"use strict";n.__esModule=!0,n["default"]=function(t){var e=0,n=0;return t.canvas.addEventListener("mousemove",function(t){e=t.clientX,n=t.clientY}),{get:function(){return{x:e,y:n}}}},e.exports=n["default"]},{}],7:[function(t,e,n){"use strict";function i(t,e){function n(){o.imageSmoothingEnabled=!1,o.drawImage(l,i,r,t.width,t.height),o.globalAlpha=1}var i=e.x,r=e.y,o=e.layer,a=e.time,s=void 0===a?0:a,u=(e.health,t.fastAnimation?p:g),f=~~((Date.now()-s)/u)%t.textures.length,c=t.textures[f],l=y[c];l||(l=y[c]=new Image,l.src=c,l.loads=[],l.onload=function(){l.loads.forEach(function(t){return t()})}),l.complete?n():l.loads.push(n)}function r(t,e){var n,r,o,a=e.layer,s=t.config,u=t.health/s.health,f=0,c=4;i(s,{layer:a,x:t.x,y:t.y,time:t.createdAt}),"health"in s&&(a.fillStyle="#00FF00",a.fillRect(t.x,t.y,s.width,2),a.fillStyle="#FF0000",a.fillRect(t.x+u*s.width,t.y,(1-u)*s.width,2));for(n in t.buffs)r=t.buffs[n],o=(Date.now()-r.startAt)/r.duration,a.beginPath(),a.arc(t.x+c*(f+1),t.y+2+c,c,(2*o-.5)*Math.PI,1.5*Math.PI),a.lineTo(t.x+c*(f+1),t.y+2+c),a.fillStyle=r.progressColor,a.fill(),f++}function o(t,e){var n=e.layer;t.forEach(function(t,e){t.forEach(function(t,r){var o={x:d.SEGMENT*r,y:d.SEGMENT*e,layer:n};i(t,o)})})}function a(t,e){var n=e.x,r=e.y,o=e.layer,a=e.alowed;o.globalAlpha=.4,o.fillStyle=a?"#00FF00":"#FF0000",o.fillRect(n,r,d.SEGMENT,d.SEGMENT),i(t,{layer:o,x:n,y:r})}function s(t,e){t.forEach(function(t){return r(t,e)})}function u(t,e){var n=e.layer,i=e.x,r=e.y;n.strokeStyle="black",n.font="16px monaco",n.lineWidth=4,n.strokeText(t,i,r),n.fillStyle="white",n.fillText(t,i,r)}function f(t,e){var n=e.layer;u("Wave  "+t.wave,{x:10,y:20,layer:n}),u("Lives "+t.lives,{x:10,y:40,layer:n}),u("Gold  "+t.gold,{x:10,y:60,layer:n})}function c(t){Object.keys(m).map(function(t){return m[t]}).filter(function(t){return"tower"===t.type}).forEach(function(e){var n=document.createElement("img");n.src=e.textures[0],n.classList.add("panel-tower"),n.dataset.tower=e.name,n.width=e.width,n.height=e.height,t.appendChild(n)})}function l(t,e){var n=t.reduce(function(t,e){return t.concat(e.textures)},[]).filter(Boolean);Promise.all(n.map(function(t){return new Promise(function(e){var n=new Image;y[t]=n,n.onload=e,n.loads=[],n.src=t})})).then(e)}function h(t){var e=Object.keys(m).map(function(t){return m[t]});return l(e,t)}n.__esModule=!0,n.render=i,n.renderUnit=r,n.renderMap=o,n.renderCursor=a,n.renderUnits=s,n.renderStats=f,n.renderPanel=c,n.preload=l,n.preloadAll=h;var d=t("./constants"),g=300,p=60,m=t("../objects"),y=[]},{"../objects":15,"./constants":4}],8:[function(t,e,n){"use strict";function i(t,e){return r(t,e)<0}function r(t,e){return l(e.x-t.x)+l(e.y-t.y)-l(t.config.range)}function o(t,e){var n=e.x-t.x,i=e.y-t.y,r=Math.atan(i/n);return 0>n&&(r=Math.PI+r),r}function a(t,e){var n=t.config?t.config.width/2:0,i=t.config?t.config.height/2:0;return t.x>=e.x-n&&t.x<e.x+e.config.width+n&&t.y>=e.y-i&&t.y<e.y+e.config.height+i}function s(t,e){return(t.x>=e.x&&t.x<e.x+e.config.width||t.x+t.config.width>e.x&&t.x+t.config.width<e.x+e.config.width)&&(t.y>=e.y&&t.y<e.y+e.config.height||t.y+t.config.height>e.y&&t.y+t.config.height<e.y+e.config.height)}function u(t,e){return l(t.x-e.x-e.config.width/2)+l(t.y-e.y-e.config.height/2)<l(t.config.splash)}function f(t,e){return Math.round(Math.random()*(e-t))+t}function c(t){var e=arguments.length<=1||void 0===arguments[1]?1:arguments[1];return t-t%e}n.__esModule=!0,n.inRange=i,n.inRangeDiff=r,n.getAngle=o,n.inObject=a,n.isOverlap=s,n.inSplash=u,n.random=f,n.round=c;var l=(Math.sqrt,function(t){return t*t})},{}],9:[function(t,e,n){"use strict";n.__esModule=!0,n["default"]={lives:3,gold:100,size:{width:20,height:10},spawn:{x:0,y:5},finish:{x:19,y:5},waves:[[1,3],[1,20]],map:"\n	11111111111111111111\n	11111111111111111111\n	11111111111111111111\n	11111111111111111111\n	11111111111111111111\n	11111111111111111111\n	11111111111111111111\n	11111111111111111111\n	11111111111111111111\n	11111111111111111111\n	"},e.exports=n["default"]},{}],10:[function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{"default":t}}function r(t){var e=t.map.split("\n").filter(Boolean).map(function(t){return t.trim().split("").map(Number).map(function(t){return l[t]})});return e[t.spawn.y][t.spawn.x]=c.spawn,e[t.finish.y][t.finish.x]=c.spawn,e}function o(t){return t.map(function(t){return{unit:h[t[0]],count:t[1]}})}function a(){var t=f["default"];return s({},t,{map:r(t),waves:o(t.waves)})}n.__esModule=!0;var s=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var i in n)Object.prototype.hasOwnProperty.call(n,i)&&(t[i]=n[i])}return t};n.getFirst=a;var u=t("./first"),f=i(u),c=t("../objects"),l={0:c.sand,1:c.grass,2:c.rock},h={1:c.unit}},{"../objects":15,"./first":9}],11:[function(t,e,n){"use strict";n.__esModule=!0,n["default"]={name:"Arrow Tower",type:"tower",textures:["images/tower_1_2.png"],width:32,height:32,movementSpeed:0,attackSpeed:2,price:10,range:250,shot:{textures:["images/shot_1.png"],damage:1,homing:!0,movementSpeed:4,width:10,height:10,death:{width:16,height:16,movementSpeed:0,corpse:0,fastAnimation:!0,textures:["images/explosion_1_1.png","images/explosion_1_2.png","images/explosion_1_3.png"]}}},e.exports=n["default"]},{}],12:[function(t,e,n){"use strict";n.__esModule=!0,n["default"]={name:"Cannon Tower",type:"tower",textures:["images/tower_2_1.png"],width:32,height:32,movementSpeed:0,attackSpeed:.3,price:60,range:250,shot:{textures:["images/shot_2.png"],damage:30,homing:!1,splash:30,movementSpeed:1.5,width:10,height:10,death:{width:18,height:18,movementSpeed:0,corpse:0,fastAnimation:!0,textures:["images/explosion_2_1.png","images/explosion_2_2.png","images/explosion_2_3.png"]}}},e.exports=n["default"]},{}],13:[function(t,e,n){"use strict";n.__esModule=!0,n["default"]={name:"Grass",textures:["images/grass_3.png"],width:32,height:32},e.exports=n["default"]},{}],14:[function(t,e,n){"use strict";n.__esModule=!0,n["default"]={name:"Ice Tower",type:"tower",textures:["images/tower_3_1.png"],width:32,height:32,movementSpeed:0,attackSpeed:1,price:30,range:100,shot:{textures:["images/shot_3_1.png"],damage:1,homing:!0,splash:50,movementSpeed:2,width:20,height:20,buff:{type:"debuff",name:"Ice slow",duration:3e3,progressColor:"#7BCDE8",effect:function(t){t.movementSpeed*=.5}},death:{width:32,height:32,movementSpeed:0,corpse:0,fastAnimation:!0,textures:["images/explosion_3_1.png","images/explosion_3_2.png","images/explosion_3_3.png"]}}},e.exports=n["default"]},{}],15:[function(t,e,n){"use strict";function i(t){return t&&t.__esModule?t:{"default":t}}n.__esModule=!0;var r=t("./grass"),o=i(r);n.grass=o["default"];var a=t("./sand"),s=i(a);n.sand=s["default"];var u=t("./rock"),f=i(u);n.rock=f["default"];var c=t("./spawn"),l=i(c);n.spawn=l["default"];var h=t("./unit"),d=i(h);n.unit=d["default"];var g=t("./arrowTower"),p=i(g);n.arrowTower=p["default"];var m=t("./cannonTower"),y=i(m);n.cannonTower=y["default"];var x=t("./iceTower"),v=i(x);n.iceTower=v["default"]},{"./arrowTower":11,"./cannonTower":12,"./grass":13,"./iceTower":14,"./rock":16,"./sand":17,"./spawn":18,"./unit":19}],16:[function(t,e,n){"use strict";n.__esModule=!0,n["default"]={name:"Rock",textures:["images/rock.png"],width:32,height:32},e.exports=n["default"]},{}],17:[function(t,e,n){"use strict";n.__esModule=!0,n["default"]={name:"Sand",textures:["images/sand.png"],width:32,height:32},e.exports=n["default"]},{}],18:[function(t,e,n){"use strict";n.__esModule=!0,n["default"]={name:"Spawn",textures:["images/spawn_1.png","images/spawn_2.png"],width:32,height:32},e.exports=n["default"]},{}],19:[function(t,e,n){"use strict";n.__esModule=!0,n["default"]={name:"Unit",type:"unit",textures:["images/unit_1_1.png","images/unit_1_2.png"],width:18,height:32,movementSpeed:.6,bounty:3,health:100,damage:0},e.exports=n["default"]},{}]},{},[1]);