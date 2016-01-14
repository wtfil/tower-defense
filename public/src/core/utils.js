const sqrt = Math.sqrt;
const sqr = x => x * x;

export function inRange(t, e) {
	return sqr(e.x - t.x) + sqr(e.y - t.y) < sqr(t.config.range);
}
export function inRangeDiff(t, e) {
	return sqr(e.x - t.x) + sqr(e.y - t.y) - sqr(t.config.range);
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
	var aw2 = a.config ? a.config.width / 2 : 0;
	var ah2 = a.config ? a.config.height / 2 : 0;
	return a.x >= b.x - aw2 &&
		a.x < b.x + b.config.width + aw2 &&
		a.y >= b.y - ah2 &&
		a.y < b.y + b.config.height + ah2;
}

export function inSplash(shot, target) {
	return sqr(shot.x - target.x - target.config.width / 2) +
		sqr(shot.y - target.y - target.config.height / 2) <
		sqr(shot.config.splash);
}

export function random(from, to) {
	return Math.round(Math.random() * (to - from)) + from;
}

export function round(num, accuracy = 1) {
	return num - num % accuracy;
}
