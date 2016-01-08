const getKey = point => point.x + ',' + point.y;
const abs = Math.abs;

function createPath(start, end, pathes) {
	var next = pathes[getKey(end)];
	next = next.x === start.x && next.y === start.y ?
		next : createPath(start, next, pathes);
	return [end].concat(next);
}

export default function astar(start, end, map) {
	var toVisit = [start];
	var visited = {};
	var pathes = {};
	var score = {[getKey(start)]: 0};
	var i, x, y, minScore, point, current, pointScore, key, distance;

	while (toVisit.length) {
		current = toVisit[0];
		minScore = score[getKey(current)];
		for (i = 0; i < toVisit.length; i ++) {
			point = toVisit[i];
			pointScore = score[getKey(point)];
			if (pointScore < minScore) {
				minScore = pointScore;
				current = point;
			}
		}
		if (current.x === end.x && current.y === end.y) {
			return createPath(start, end, pathes).reverse();
		}

		key = getKey(current);
		toVisit.splice(toVisit.indexOf(current), 1);
		visited[key] = true;

		for (x = current.x - 1; x <= current.x + 1; x ++) {
			for (y = current.y - 1; y <= current.y + 1; y ++) {
				if ((abs(x - current.x) + abs(y - current.y) > 1) || !(y in map) || !(x in map[y])) {
					continue;
				}
				key = x + ',' + y;
				distance = minScore + (map[y][x] ? Infinity : 1);
				if (!score[key] || distance < score[key]) {
					score[key] = distance;
					pathes[key] = current;
				}
				if (!visited[key]) {
					toVisit.push({x, y});
				}
			}
		}

	}
	return null;
}
