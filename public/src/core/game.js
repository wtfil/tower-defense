import Unit from './Unit';
import {SEGMENT} from './constants';
import astar from './algorithms/astar';
import {random, round, inRange, getAngle, inObject, inSplash} from './utils';

export default function init(map) {
	var waveNumber = 0;
	var lives = map.lives;
	var gold = map.gold;
	var score = 0;
	var	unitsInWave = 0;
	var towers = [];
	var enemies = [];
	var shots = [];
	var diedObjects = [];
	var bounds = {x: 0, y: 0, config: {
		width: map.size.width * SEGMENT,
		height: map.size.height * SEGMENT
	}};
	var mapObjects = new Array(map.size.height).join().split(',').map(line => {
		return new Array(map.size.width).join().split(',').map(Number);
	});

	function coordsToGrid(point) {
		return {
			x: Math.floor(point.x / SEGMENT),
			y: Math.floor(point.y / SEGMENT)
		}
	}

	function setPathes() {
		enemies.forEach(item => {
			var path = astar(
				coordsToGrid(item),
				map.finish,
				mapObjects
			).slice(1).map(point => ({
				x: point.x * SEGMENT,
				y: point.y * SEGMENT
			}));
			item.setPath(path);
		});
	}

	function addUnit(config, opts) {
		var unit = new Unit(config, opts);
		var grid = coordsToGrid(opts);
		if (unit.isTower) {
			mapObjects[grid.y][grid.x] = 1;
			towers.push(unit);
			setPathes();
		} else {
			enemies.push(unit);
			setPathes();
		}
	}
	function getUnits() {
		return towers.concat(enemies).concat(shots).concat(diedObjects);
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
				target: tower.target,
				angle: getAngle(tower, tower.target)
			}));
		}
	}

	function collision() {
		var i, j, shot;
		for (i = 0; i < shots.length; i ++) {
			shot = shots[i];
			if (shot.config.homing && shot.target && inObject(shot, shot.target)) {
				attack(shot, shot.target);
				continue;
			}
			if (!shot.config.homing) {
				for (j = 0; j < enemies.length; j ++) {
					if (inObject(shot, enemies[j])) {
						attack(shot, enemies[j]);
						break;
					}
				}
			}
		}
		clearDeadObjects();
		for (i = 0; i < enemies.length; i ++) {
			if (!inObject(enemies[i], bounds)) {
				lives --;
				enemies[i].die();
			}
		}
		clearDeadObjects();
	}
	function attack(shot, target) {
		var i;
		if (shot.config.splash) {
			for (i = 0; i < enemies.length; i ++) {
				if (inSplash(shot, enemies[i])) {
					attackSingle(shot, enemies[i]);
				}
			}
		} else {
			attackSingle(shot, target);
		}
		shot.die();
		if (shot.config.death) {
			diedObjects.push(new Unit(shot.config.death, {
				x: shot.x,
				y: shot.y
			}));
		}
	}

	function attackSingle(shot, target) {
		target.takeDamage(shot.config.damage);
	}

	function clearDeadObjects() {
		var now = Date.now();
		var alive = [], i;
		for(i = 0; i < enemies.length; i ++) {
			if (enemies[i].alive) {
				alive.push(enemies[i]);
			} else {
				clearUnit(enemies[i]);
			}
		}
		shots = shots.filter(shot => shot.alive);
		diedObjects = diedObjects.filter(item => {
			return item.config.corpse ||
				((item.config.textures.length * 60 + item.createdAt) > now);
		});
		enemies = alive;
	}

	function clearUnit(target) {
		var i;
		for (i = 0; i < towers.length; i ++) {
			if (towers[i].target === target) {
				towers[i].setTarget(null);
			}
		}
		unitsInWave --;
		if (!unitsInWave) {
			waveNumber ++;
			setTimeout(runWave, 5000);
		}
	}

	function cursorGrid({x, y}) {
		x = round(x, SEGMENT);
		y = round(y, SEGMENT);
		var arr = enemies.concat(towers);
		var point = {x, y};
		var grid = coordsToGrid(point);
		var i, alowed, newMapObjexts;
		for (i = 0; i < arr.length; i ++) {
			if (inObject(point, arr[i])) {
				return {x, y, alowed: false};
			}
		}
		if (grid.x < 0 || grid.x >= map.size.width || grid.y < 0 || grid.y >= map.size.height) {
			return {x, y, alowed: false};
		}
		newMapObjexts = mapObjects.slice();
		newMapObjexts[grid.y] = mapObjects[grid.y].slice();
		newMapObjexts[grid.y][grid.x] = 1;
		alowed = !!astar(map.spawn, map.finish, newMapObjexts);

		return {x, y, alowed};
	}

	function runWave() {
		if (waveNumber >= map.waves.length) {
			return console.log('END GAME');
		}
		var wave = map.waves[waveNumber];
		var spawned = 0;
		var timeRange = 10000 / wave.count;
		unitsInWave = wave.count;
		function spawn () {
			if (spawned >= wave.count) {
				return;
			}
			addUnit(wave.unit, {
				x: map.spawn.x * SEGMENT,
				y: map.spawn.y * SEGMENT
			});
			spawned ++;
			setTimeout(spawn, random(timeRange, timeRange * 3));
		}
		spawn();
	}
	function run() {
		runWave();
	}
	function getStats() {
		return {wave: waveNumber + 1, lives, score, gold, unitsInWave};
	}

	return {
		addUnit, getUnits, setTargets, fire, collision,
		cursorGrid, run, getStats
	};
}
