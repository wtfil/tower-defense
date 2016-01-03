const sqrt = Math.sqrt;
const sqr = x => x * x;

export function inRange(t, e) {
	return sqr(e.x - t.x) + sqr(e.y - t.y) < sqr(t.range);
}

export function getAngle(a, b) {
	var dx = b.x - a.x;
	var dy = b.y - a.y;
	var angle = Math.atan(dy / dx);
	if (dx < 0) {
		angle = Math.PI + angle;
	}
	return angle;
}

export function inObject(a, b) {
	return a.x >= b.x - a.config.width / 2 &&
		a.x <= b.x + b.config.width + a.config.width / 2 &&
		a.y >= b.y - a.config.height / 2 &&
		a.y <= b.y + b.config.height + a.config.height / 2;
}