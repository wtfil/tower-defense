import {getFirst} from './maps';
import {unit, grass, tower, rock, sand} from './objects';
import {render, preload} from './render';
import Unit from './Unit';

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

var u1 = new Unit(unit, {
	x: 100,
	y: 10,
	layer: ctx
});
var u2 = new Unit(unit, {
	x: 110,
	y: 15,
	layer: ctx
});
var units = [u1, u2];

function loop() {
	units.forEach(item => {
		item.clear();
		item.move();
	});
	renderMap();
	render(tower, {x: 200, y: 10, layer: ctx});
	units.forEach(item => {
		item.render();
	});
	requestAnimationFrame(loop);
}

preload([grass, sand, rock, unit, tower], loop);
