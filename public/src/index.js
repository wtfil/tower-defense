import {getFirst} from './maps';
import {unit, arrowTower, cannonTower} from './objects';
import {render, renderMap, preloadAll} from './core/render';
import {random} from './core/utils';
import initUnits from './core/units';

const map = getFirst();
const requestAnimationFrame = window.requestAnimationFrame ||
	window.webkitRequestAnimationFrame ||
	window.mozRequestAnimationFrame ||
	(cb => setTimeout(cb, 1000 / 60))

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
canvas.width = 640;
canvas.height = 480;

var units = initUnits();
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

units.add(arrowTower, {
	x: 300,
	y: 250,
	layer: ctx
});
units.add(arrowTower, {
	x: 350,
	y: 250,
	layer: ctx
});
units.add(cannonTower, {
	x: 260,
	y: 350,
	layer: ctx
});
units.add(cannonTower, {
	x: 300,
	y: 350,
	layer: ctx
});
units.add(arrowTower, {
	x: 400,
	y: 350,
	layer: ctx
});

function loop() {
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
	requestAnimationFrame(loop);
}

preloadAll(loop);
