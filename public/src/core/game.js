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
	var bounds = {x: 0, y: 0, config: {
		width: map.size.width * SEGMENT,
		height: map.size.height * SEGMENT
	}};

	function setPathes() {
		enemies.forEach(item => {
			item.setPath([
				{x: SEGMENT * 5, y: SEGMENT * 7},
				{x: SEGMENT * 5, y: SEGMENT * 4},
				{x: SEGMENT * 20, y: SEGMENT * 4}
			]);
		});
	}

	function addUnit(config, opts) {
		var unit = new Unit(config, opts);
		if (unit.isTower) {
			towers.push(unit);
		} else {
			enemies.push(unit);
			setPathes();
		}
	}
	function getUnits() {
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
	}

	function attackSingle(shot, target) {
		target.takeDamage(shot.config.damage);
	}

	function clearDeadObjects() {
		var alive = [], i;
		for(i = 0; i < enemies.length; i ++) {
			if (enemies[i].alive) {
				alive.push(enemies[i]);
			} else {
				clearUnit(enemies[i]);
			}
		}
		shots = shots.filter(shot => shot.alive);
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
		var i;
		for (i = 0; i < arr.length; i ++) {
			if (inObject(point, arr[i])) {
				return {x, y, alowed: false};
			}
		}
		return {x, y, alowed: true};
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
