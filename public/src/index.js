import {getFirst} from './maps';
import {grass} from './objects';

const requestAnimationFrame = window.requestAnimationFrame ||
	window.webkitRequestAnimationFrame ||
	window.mozRequestAnimationFrame ||
	function(callback) {
		setTimeout(callback, 1000 / 60);
	};

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const SEGMENT = 32;
canvas.width = SEGMENT * 20; // 640
canvas.height = SEGMENT * 15; // 480

function render(obj, {x, y, layer}) {
	var img = new Image();
	img.width = SEGMENT;
	img.height = SEGMENT;
	img.onload = () => {
		layer.drawImage(img, x, y);
	};
	img.src = obj.texture;
}

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

renderMap(getFirst())
