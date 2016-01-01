var cache = [];

export default function render(obj, {x, y, layer, frame = 0}) {
	var url = obj.textures[frame];
	var img = cache[url];
	if (!img) {
		img = cache[url] = new Image();
		img.src = url;
	}
	img.onload = () => {
		layer.drawImage(img, x, y, obj.width, obj.height);
	};
	if (img.complete) {
		img.onload();
	}
}

function preload(objects, cb) {
	var textures = objects.reduce((acc, item) => acc.concat(item.textures), []);
	Promise.all(textures.map(url => {
		return new Promise(resolve => {
			var img = new Image();
			img.onload = resolve;
			img.src = url;
		});
	})).then(cb);
}

