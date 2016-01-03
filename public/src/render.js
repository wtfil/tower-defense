var objects = require('./objects');
var cache = [];

const SEGMENT = 32;

export function render(obj, {x, y, layer, frame = 0, health}) {
	function done() {
		var hp = health / obj.health;
		layer.drawImage(img, x, y, obj.width, obj.height);
		if ('health' in obj) {
			layer.fillStyle = '#00FF00';
			layer.fillRect(x, y, obj.width, 2);
			layer.fillStyle = '#FF0000';
			layer.fillRect(x + hp * obj.width, y, (1 - hp) * obj.width, 2);
		}
	}
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
