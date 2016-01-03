export default function (layer) {
	var x = 0;
	var y = 0;
	layer.canvas.addEventListener('mousemove', e => {
		x = e.clientX;
		y = e.clientY;
	});

	return {
		get() {
			return {x, y};
		}
	};
}
