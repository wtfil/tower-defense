import {SEGMENT} from './constants';

const ANIMATION_INTERVAL = 300;
const FAST_ANIMATION_INTERVAL = 60;
var objects = require('../objects');
var cache = [];

export function render(obj, {x, y, layer, time = 0, health}) {
	function done() {
		layer.imageSmoothingEnabled = false;
		layer.drawImage(img, x, y, obj.width, obj.height);
		layer.globalAlpha = 1; // TODO wtf?
	}
	var interval = obj.fastAnimation ? FAST_ANIMATION_INTERVAL: ANIMATION_INTERVAL;
	var frame = ~~((Date.now() - time) / interval) % obj.textures.length;
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

export function renderUnit(unit, {layer}) {
	var config = unit.config;
	var hp = unit.health / config.health;
	var c = 0;
	var r = 4;
	var name, buff, duration;
	render(config, {
		layer,
		x: unit.x,
		y: unit.y,
		time: unit.createdAt
	});
	if ('health' in config) {
		layer.fillStyle = '#00FF00';
		layer.fillRect(unit.x, unit.y, config.width, 2);
		layer.fillStyle = '#FF0000';
		layer.fillRect(unit.x + hp * config.width, unit.y, (1 - hp) * config.width, 2);
	}
	for (name in unit.buffs) {
		buff = unit.buffs[name];
		duration = (Date.now() - buff.startAt) / buff.duration;
		layer.beginPath();
		layer.arc(unit.x + r * (c + 1), unit.y + 2 + r, r, (2 * duration - 0.5) * Math.PI, 1.5 * Math.PI);
		layer.lineTo(unit.x + r * (c + 1), unit.y + 2 + r);
		layer.fillStyle = buff.progressColor;
		layer.fill();
		c ++;
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
	layer.globalAlpha = 0.4;
	layer.fillStyle = alowed ? '#00FF00' : '#FF0000';
	layer.fillRect(x, y, SEGMENT, SEGMENT);
	render(obj, {layer, x, y});
}

export function renderUnits(units, opts) {
	units.forEach(unit => renderUnit(unit, opts));
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
	renderText(`Wave   ${stats.wave} / ${stats.totalWaves}`, {x: 10, y: 20, layer});
	renderText(`Lives  ${stats.lives}`, {x: 10, y: 40, layer});
	renderText(`Gold   ${stats.gold}`, {x: 10, y: 60, layer});
}

export function renderPanel(elem) {
	Object.keys(objects)
		.map(key => objects[key])
		.filter(item => item.type === 'tower')
		.forEach(item => {
			var node = document.createElement('img');
			node.src = item.textures[0];
			node.classList.add('panel-tower');
			node.dataset.tower = item.name;
			node.width = item.width;
			node.height = item.height;
			elem.appendChild(node);
		});
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
