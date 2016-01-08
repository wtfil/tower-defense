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
	var planned = {};
	var pathes = {};
	var score = {[getKey(start)]: 0};
	var width = map[0].length;
	var height = map.length;
	var i, x, y, current, currentScore, distance, key, neighbors, neighbor;
	while (toVisit.length) {
		current = toVisit.shift();
		if (current.x === end.x && current.y === end.y) {
			return createPath(start, end, pathes).reverse();
		}
		key = getKey(current);
		currentScore = score[key];
		visited[key] = true;

		neighbors = [
			{x: current.x - 1, y: current.y},
			{x: current.x + 1, y: current.y},
			{x: current.x, y: current.y - 1},
			{x: current.x, y: current.y + 1}
		];
		for (i = 0; i < 4; i ++) {
			neighbor = neighbors[i];
			key = getKey(neighbor);
			if (planned[key] || neighbor.x < 0 || neighbor.x >= width || neighbor.y < 0 || neighbor.y >= height  || map[neighbor.y][neighbor.x]) {
				continue;
			}
			distance = currentScore + 1;
			if (!(key in score) || distance < score[key]) {
				score[key] = distance;
				pathes[key] = current;
			}
			planned[key] = true;
			toVisit.push(neighbor);
		}
	}
	return null;
}
