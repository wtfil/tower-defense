const sqrt = Math.sqrt;
const sqr = x => x * x;

export function inRange(t, e) {
    return inRangeDiff(t, e) < 0;
}
export function inRangeDiff(t, e) {
    return sqr(e.x - t.x) + sqr(e.y - t.y) - sqr(t.config.range);
}

export function distance2(a, b) {
    return sqr(a.x - b.x) + sqr(a.y - b.y);
}

export function scale(point, n) {
    return {
        x: Math.floor(point.x * n),
        y: Math.floor(point.y * n)
    };
}

export function inObject(a, b) {
    var aw2 = a.config ? a.config.width / 2 : 0;
    var ah2 = a.config ? a.config.height / 2 : 0;
    return a.x >= b.x - aw2 &&
        a.x < b.x + b.config.width + aw2 &&
        a.y >= b.y - ah2 &&
        a.y < b.y + b.config.height + ah2;
}

export function isOverlap(a, b) {
    return (
        a.x >= b.x && a.x < b.x + b.config.width ||
        a.x + a.config.width > b.x && a.x + a.config.width < b.x + b.config.width
    ) && (
        a.y >= b.y && a.y < b.y + b.config.height ||
        a.y + a.config.height > b.y && a.y + a.config.height < b.y + b.config.height
    );
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
