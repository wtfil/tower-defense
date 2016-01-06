import {render} from './render';
import {getAngle} from './utils';

function Unit(config, {x, y, target}) {
	this.config = config;
	this.x = x;
	this.y = y;
	this.createdAt = Date.now();
	this.lastShotAt = 0;
	this.alive = true;
	this.isTower = config.type === 'tower';
	this.health = config.health;
	this.target = target;
	this.angle = target ? getAngle(this, target) : 0;
}
Unit.prototype.move = function () {
	if (this.config.homing && this.target) {
		this.angle = getAngle(this, this.target);
	}
	this.x += this.config.movementSpeed * Math.cos(this.angle);
	this.y += this.config.movementSpeed * Math.sin(this.angle);
};
Unit.prototype.setTarget = function (target) {
	this.target = target;
};
Unit.prototype.takeDamage = function (damage) {
	this.health -= damage;
	if (this.health <= 0) {
		this.die();
	}
}
Unit.prototype.fire = function () {
	var interval = 1000 / this.config.attackSpeed;
	var now = Date.now();
	if (!this.target || !(this.lastShotAt + interval < now)) {
		return null;
	}
	this.lastShotAt = now;
	return true;
};
Unit.prototype.die = function () {
	this.alive = false;
	this.health = 0;
};

export default Unit;
