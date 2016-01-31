import Unit from './Unit';
import {SEGMENT} from './constants';
import astar from './algorithms/astar';
import {isOverlap, inRangeDiff, random, round, inRange, getAngle, inObject, inSplash} from './utils';

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
	var spawnTimer = null;
	var bounds = {x: 0, y: 0, config: {
		width: map.size.width * SEGMENT,
		height: map.size.height * SEGMENT
	}};
	var finish = {
		x: map.finish.x * SEGMENT,
		y: map.finish.y * SEGMENT,
		config: {width: SEGMENT, height: SEGMENT}
	};
	var mapObjects = new Array(map.size.height).fill().map(line => {
		return new Array(map.size.width).fill(0);
	});
	var cachedAstarGridResults = {};
	var buttons = [];

	function coordsToGrid(point) {
		return {
			x: Math.floor(point.x / SEGMENT),
			y: Math.floor(point.y / SEGMENT)
		}
	}

	function setPathes() {
		enemies.forEach(setPathToUnit);
	}

	function setPathToUnit(unit) {
		var path = astar(
			coordsToGrid(unit),
			map.finish,
			mapObjects
		).slice(1).map(point => ({
			x: point.x * SEGMENT,
			y: point.y * SEGMENT
		}));
		unit.setPath(path);
	}

	function buildTower(config, opts) {
		var grid = coordsToGrid(opts);
		towers.push(new Unit(config, opts));
		mapObjects[grid.y][grid.x] = 1;
		cachedAstarGridResults = {};
		gold -= config.price;
		setPathes();
	}

	function addUnit(config, opts) {
		var unit = new Unit(config, opts);
		enemies.push(unit);
		setPathToUnit(unit);
	}
	function getUnits() {
		return towers.concat(enemies).concat(shots).concat(diedObjects);
	}

	function setTargets() {
		var i, j, tower, enemy, closest, minRange, diff;
		for (i = 0; i < towers.length; i ++) {
			tower = towers[i];
			enemy = tower.target;
			if (enemy) {
				if (inRange(tower, enemy)) {
					continue;
				}
				tower.setTarget(null);
			}
			minRange = Infinity;
			closest = null;
			for (j = 0; j < enemies.length; j ++) {
				enemy = enemies[j];
				diff = inRangeDiff(tower, enemy);
				if (diff < 0 && diff < minRange) {
					closest = enemy;
					minRange = diff;
				}
				if (closest) {
					tower.setTarget(closest);
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
			if (inObject(enemies[i], finish)) {
				lives --;
				enemies[i].dieWithoutBounty();
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
		target.takeDamage(shot.config);
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

	function clearUnit(target, silent) {
		var arr = towers.concat(shots);
		var i;
		for (i = 0; i < arr.length; i ++) {
			if (arr[i].target === target) {
				arr[i].setTarget(null);
			}
		}
		if (silent) {
			return;
		}
		gold += target.bounty;
		unitsInWave --;
		if (!unitsInWave) {
			waveNumber ++;
			runWave();
		}
	}

	function cachedAstarGrid(grid) {
		var key = grid.x + ',' + grid.y;
		var newMapObjexts;
		if (cachedAstarGridResults[key]) {
			return cachedAstarGridResults[key];
		}
		newMapObjexts = mapObjects.slice();
		newMapObjexts[grid.y] = mapObjects[grid.y].slice();
		newMapObjexts[grid.y][grid.x] = 1;
		cachedAstarGridResults[key] = !!astar(map.spawn, map.finish, newMapObjexts);
		return cachedAstarGridResults[key];
	}

	function buildAtributes(config, point) {
		var arr = enemies.concat(towers);
		var grid = coordsToGrid(point);
		var x = grid.x * SEGMENT;
		var y = grid.y * SEGMENT;
		var tower = {x, y, config};
		var unit;
		var i;
		if (config.price > gold) {
			return {x, y, alowed: false};
		}
		for (i = 0; i < arr.length; i ++) {
			if (isOverlap(arr[i], tower)) {
				return {x, y, alowed: false};
			}
		}
		if (grid.x < 0 || grid.x >= map.size.width || grid.y < 0 || grid.y >= map.size.height) {
			return {x, y, alowed: false};
		}

		return {x, y, alowed: cachedAstarGrid(grid)};
	}

	function findUnderCursor(point) {
		var i;
		for (i = 0; i < towers.length; i ++) {
			if (inObject(point, towers[i])) {
				return {
					type: 'tower',
					tower: towers[i]
				};
			}
		}
		return null;
	}

	function runWave() {
		if (waveNumber >= map.waves.length) {
			return console.log('END GAME');
		}
		var wave = map.waves[waveNumber];
		var spawned = 0;
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
			spawnTimer = setTimeout(spawn, 2000);
		}
		spawnTimer = setTimeout(spawn, 5000);
	}
	function run() {
		runWave();
	}
	function destroy() {
		clearTimeout(spawnTimer);
		enemies.forEach(item => clearUnit(item, true));
		enemies = [];
		towers = [];
		shots = [];
		buttons = [];
	}
	function getStats() {
		return {
			wave: waveNumber + 1,
			totalWaves: map.waves.length,
			lives, score, gold, unitsInWave
		};
	}

	return {
		buildTower, addUnit, getUnits, setTargets, fire, collision,
		buildAtributes, run, getStats, destroy, findUnderCursor
	};
}
