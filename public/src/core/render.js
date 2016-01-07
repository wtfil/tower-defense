import {SEGMENT} from './constants';

const ANIMATION_INTERVAL = 300;
var objects = require('../objects');
var cache = [];

export function render(obj, {x, y, layer, time = 0, health}) {
	function done() {
		var hp = health / obj.health;
		layer.imageSmoothingEnabled = false;
		layer.drawImage(img, x, y, obj.width, obj.height);
		layer.globalAlpha = 1;
		if ('health' in obj) {
			layer.fillStyle = '#00FF00';
			layer.fillRect(x, y, obj.width, 2);
			layer.fillStyle = '#FF0000';
			layer.fillRect(x + hp * obj.width, y, (1 - hp) * obj.width, 2);
		}
	}
	var frame = ~~((Date.now() - time) / ANIMATION_INTERVAL) % obj.textures.length;
	var url = obj.textures[frame];
	var img = cache[url];
	if (!img) {
		img = cache[url] = new Image();
		img.src = url;
		img.loads = [];
		img.onload = () => {
			img.loads.forEach(fn => fn());
		};
	}
	if (img.complete) {
		done();
	} else {
		img.loads.push(done);
	}
}

export function renderMap(map, {layer}) {
	map.forEach((line, i) => {
		line.forEach((item, j) => {
			var opts = {
				x: SEGMENT * j,
				y: SEGMENT * i,
				layer
			};
			render(item, opts)
		});
	});
}

export function renderCursor(obj, {x, y, layer, alowed}) {
	if (!obj) {
		return;
	}
	layer.globalAlpha = 0.4;
	layer.fillStyle = alowed ? '#00FF00' : '#FF0000';
	layer.fillRect(x, y, SEGMENT, SEGMENT);
	render(obj, {layer, x, y});
}

export function renderUnits(units, {layer}) {
	units.forEach(unit => {
		render(unit.config, {
			layer,
			x: unit.x,
			y: unit.y,
			health: unit.health,
			time: unit.createdAt
		});
	});
}

function renderText(text, {layer, x, y}) {
	layer.strokeStyle = 'black';
	layer.font = '16px monaco';
	layer.lineWidth = 4;
	layer.strokeText(text, x, y);
	layer.fillStyle = 'white';
	layer.fillText(text, x, y);
}
export function renderStats(stats, {layer}) {
	renderText(`wave:  ${stats.wave}`, {x: 10, y: 20, layer});
	renderText(`lives: ${stats.lives}`, {x: 10, y: 40, layer});
	renderText(`gold:  ${stats.gold}`, {x: 10, y: 60, layer});
	renderText(`score: ${stats.score}`, {x: 10, y: 80, layer});
	renderText(`use 1 or 2 to build the tower`, {x: 140, y: 20, layer});
}

export function preload(items, cb) {
	var textures = items
		.reduce((acc, item) => acc.concat(item.textures), [])
		.filter(Boolean);
	Promise.all(textures.map(url => {
		return new Promise(resolve => {
			var img = new Image();
			cache[url] = img;
			img.onload = resolve;
			img.loads = [];
			img.src = url;
		});
	})).then(cb);
}

export function preloadAll(cb) {
	var items = Object.keys(objects).map(key => objects[key]);
	return preload(items, cb);
}
