var objects = require('./objects');
var cache = [];

export function render(obj, {x, y, layer, frame = 0}) {
	function done() {
		layer.drawImage(img, x, y, obj.width, obj.height);
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
