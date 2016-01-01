import {getFirst} from './maps';
import {unit, grass, tower} from './objects';
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
			render(grass, opts)
		});
	});
}

var u = new Unit(unit, ctx);

function loop() {
	u.clear();
	u.move();
	renderMap();
	u.render();
	requestAnimationFrame(loop);
}

preload([grass, unit], loop);
