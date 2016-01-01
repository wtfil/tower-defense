import {getFirst} from './maps';
import {unit, grass, tower} from './objects';
import render from './render';

const requestAnimationFrame = window.requestAnimationFrame ||
	window.webkitRequestAnimationFrame ||
	window.mozRequestAnimationFrame ||
	(cb => setTimeout(cb, 1000 / 60))


const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const SEGMENT = 32;
canvas.width = 640;
canvas.height = 480;

function renderMap(map) {
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

/*renderMap(getFirst())*/
/*render(tower, {x: 0, y: 0, layer: ctx});*/
/*render(tower, {x: 100, y: 100, layer: ctx});*/
/*render(unit, {x: 50, y: 50, layer: ctx});*/

function Unit(config) {
	this.config = config;
	this.frame = 0;
	this.x = 100;
	this.y = 10;
}
Unit.prototype.move = function () {
	this.frame ++;
	this.x ++;
	if (this.frame > this.config.textures.length - 1) {
		this.frame = 0;
	}
};
Unit.prototype.render = function () {
	render(this.config, {
		x: this.x,
		y: this.y,
		frame: this.frame,
		layer: ctx
	});
};
Unit.prototype.clear = function () {
	ctx.clearRect(this.x, this.y, this.config.width, this.config.height);
};
var u = new Unit(unit);

(function loop() {
	u.clear();
	u.move();
	u.render();
	requestAnimationFrame(loop);
}());
