import {getFirst} from './maps';
import {unit, tower} from './objects';
import {render, preloadAll} from './render';
import initUnits from './units';

const requestAnimationFrame = window.requestAnimationFrame ||
	window.webkitRequestAnimationFrame ||
	window.mozRequestAnimationFrame ||
	(cb => setTimeout(cb, 1000 / 60))

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const SEGMENT = 32;
canvas.width = 640;
canvas.height = 480;

function renderMap() {
	var map = getFirst();
	map.forEach((line, i) => {
		line.forEach((item, j) => {
			var opts = {
				x: SEGMENT * j,
				y: SEGMENT * i,
				layer: ctx
			};
			render(item, opts)
		});
	});
}

function random(from, to) {
	return Math.round(Math.random() * (to - from)) + from;
}

var units = initUnits();
units.add(unit, {
	x: 0,
	y: 300,
	layer: ctx
});

units.add(tower, {
	x: 300,
	y: 250,
	layer: ctx
});
units.add(tower, {
	x: 300,
	y: 350,
	layer: ctx
});

function loop() {
	units.setTargets();
	units.fire();
	units.get().forEach(item => {
		item.clear();
		item.move();
	});
	renderMap();
	units.get().forEach(item => {
		item.render();
	});
	requestAnimationFrame(loop);
}

preloadAll(loop);
