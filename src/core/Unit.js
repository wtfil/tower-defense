import {getAngle, round} from './utils';

function Unit(config, {x, y, target}) {
	this.config = config;
	this.x = x;
	this.y = y;
	this.createdAt = Date.now();
	this.lastShotAt = 0;
	this.alive = true;
	this.health = config.health;
	this.target = target || null;
	this.path = null;
	this.buffs = {};
	this.angle = target ? getAngle(this, target) : 0;
	this.applyBuffs();
}
Unit.prototype.applyBuffs = function () {
	var name, buff;
	this.movementSpeed = this.config.movementSpeed;
	for (name in this.buffs) {
		buff = this.buffs[name];
		if (buff.duration + buff.startAt < Date.now()) {
			delete this.buffs[name];
			continue;
		}
		this.buffs[name].effect(this);
	}

};
Unit.prototype.move = function () {
	this.applyBuffs();
	if (this.config.homing && this.target) {
		this.angle = getAngle(this, this.target);
	} else if (this.path) {
		this.angle = getAngle(this, this.path[0]);
		if (!round(this.x - this.path[0].x, 5) && !round(this.y - this.path[0].y, 5)) {
			this.path = this.path.slice(1);
			if (!this.path.length) {
				this.path = null;
			}
		}
	}
	this.x += this.movementSpeed * Math.cos(this.angle);
	this.y += this.movementSpeed * Math.sin(this.angle);
};
Unit.prototype.setPath = function (path) {
	this.path = path;
};
Unit.prototype.setTarget = function (target) {
	this.target = target;
};
Unit.prototype.takeDamage = function (config) {
	this.health -= config.damage;
	if (config.buff) {
		this.buffs[config.buff.name] = {
			...config.buff,
			startAt: Date.now()
		};
		this.applyBuffs();
	}
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
	this.bounty = this.config.bounty;
};
Unit.prototype.dieWithoutBounty = function () {
	this.alive = false;
	this.health = 0;
	this.bounty = 0;
};

export default Unit;
