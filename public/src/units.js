import Unit from './Unit';
const sqrt = Math.sqrt;
const sqr = x => x * x;

function inRange(t, e) {
	return sqr(e.x - t.x) + sqr(e.y - t.y) < sqr(t.range);
}

export default function init() {
	var towers = [];
	var enemies = [];
	var shots = [];

	function add(config, opts) {
		var unit = new Unit(config, opts);
		if (unit.isTower) {
			towers.push(unit);
		} else {
			enemies.push(unit);
		}
	}
	function get() {
		return towers.concat(enemies).concat(shots);
	}

	function setTargets() {
		var i, j, tower, enemy;
		for (i = 0; i < towers.length; i ++) {
			tower = towers[i];
			enemy = tower.target;
			if (enemy) {
				if (inRange(tower, enemy)) {
					continue;
				}
				tower.setTarget(null);
			}
			for (j = 0; j < enemies.length; j ++) {
				enemy = enemies[j];
				if (inRange(tower, enemy)) {
					tower.setTarget(enemy);
				}
			}
		}
	}
	function fire() {
		var i, tower;
		for (i = 0; i < towers.length; i ++) {
			tower = towers[i];
			if (!tower.fire()) {
				continue;
			}
			shots.push(new Unit(tower.config.shot, {
				x: tower.x,
				y: tower.y,
				angle: getAngle(tower, tower.target),
				layer: tower.layer
			}));
		}
	}
	function getAngle(a, b) {
		var dx = b.x - a.x;
		var dy = b.y - a.y;
		var angle = Math.atan(dy / dx);
		if (dx < 0) {
			angle = Math.PI + angle;
		}
		return angle;
	}

	return {add, get, setTargets, fire};
}

