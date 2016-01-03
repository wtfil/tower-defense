import Unit from './Unit';
import {inRange, getAngle, inObject, inSplash} from './utils';

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
				target: tower.target,
				angle: getAngle(tower, tower.target),
				layer: tower.layer
			}));
		}
	}

	function collision() {
		var i, j, shot;
		for (i = 0; i < shots.length; i ++) {
			shot = shots[i];
			if (shot.config.homing && inObject(shot, shot.target)) {
				attack(shot, shot.target);
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
		remove(shots, shot);
	}

	function attackSingle(shot, target) {
		target.takeDamage(shot.config.damage);
		if (!target.health) {
			remove(enemies, target);
			clearTarget(target);
		}
	}

	function remove(arr, item) {
		arr.splice(arr.indexOf(item), 1);
	}
	function clearTarget(target) {
		var i;
		for (i = 0; i < towers.length; i ++) {
			if (towers[i].target === target) {
				towers[i].setTarget(null);
			}
		}
	}

	return {add, get, setTargets, fire, collision};
}

