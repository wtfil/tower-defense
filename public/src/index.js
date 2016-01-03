import {getFirst} from './maps';
import {unit, arrowTower, cannonTower} from './objects';
import {renderCursor, renderMap, preloadAll} from './core/render';
import {round, random} from './core/utils';
import initUnits from './core/units';
import initMouse from './core/mouse';

const SEGMENT = 32; // TODO do not duplicate with render.js

const map = getFirst();
const requestAnimationFrame = window.requestAnimationFrame ||
	window.webkitRequestAnimationFrame ||
	window.mozRequestAnimationFrame ||
	(cb => setTimeout(cb, 1000 / 60))

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const mouse = initMouse(ctx);
canvas.width = 640;
canvas.height = 480;

var units = initUnits();
var isPause = false;
var towerToBuild = null;

setInterval(function () {
	var i;
	for (i = random(0, 4); i > 0; i --) {
		units.add(unit, {
			x: 0 + random(-20, 20),
			y: 300 + random(-20, 20),
			layer: ctx
		});
	}
}, 2000);

document.addEventListener('visibilitychange', e => isPause = document.hidden);
document.addEventListener('keyup', e => {
	switch (Number(e.keyCode)) {
		case 49: towerToBuild = arrowTower; break;
		case 50: towerToBuild = cannonTower; break;
		default: towerToBuild = null;
	}
});
canvas.addEventListener('click', e => {
	if (towerToBuild) {
		units.add(towerToBuild, {
			x: round(e.clientX, SEGMENT),
			y: round(e.clientY, SEGMENT),
			layer: ctx
		});
	}
});
function loop() {
	if (isPause) {
		return;
	}
	units.setTargets();
	units.fire();
	units.collision();
	units.get().forEach(item => {
		item.clear();
		item.move();
	});
	renderMap(map, {layer: ctx});
	units.get().forEach(item => {
		item.render();
	});
	renderCursor(towerToBuild, {
		layer: ctx,
		...mouse.get()
	});
	requestAnimationFrame(loop);
}

preloadAll(loop);
