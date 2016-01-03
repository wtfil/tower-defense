import {render} from './render';
import {getAngle} from './utils';

function Unit(config, {x, y, layer, target}) {
	this.config = config;
	this.layer = layer;
	this.x = x;
	this.y = y;
	this.frame = 0;
	this.isTower = config.type === 'tower';
	this.health = config.health;
	this.target = target;
	this.angle = target ? getAngle(this, target) : 0;
	this.ready = true;
	if (config.textures.length > 1) {
		this.updateFrame();
	}
}
Unit.prototype.updateFrame = function () {
	this.frame = this.frame === this.config.textures.length - 1 ?
		0 : (this.frame + 1);
	this.frameTimer = setTimeout(this.updateFrame.bind(this), 300);
};
Unit.prototype.move = function () {
	if (this.config.homing && this.target) {
		this.angle = getAngle(this, this.target);
	}
	this.x += this.config.movementSpeed * Math.cos(this.angle);
	this.y += this.config.movementSpeed * Math.sin(this.angle);
};
Unit.prototype.render = function () {
	render(this.config, {
		x: this.x,
		y: this.y,
		frame: this.frame,
		layer: this.layer,
		health: this.health
	});
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
	if (!this.target || !this.ready) {
		return null;
	}
	this.ready = false;
	this.readyTimer = setTimeout(() => {
		this.ready = true;
	}, 1000 / this.config.attackSpeed);
	return true;
};
Unit.prototype.die = function () {
	clearTimeout(this.frameTimer);
	clearTimeout(this.readyTimer);
	this.health = 0;
};
Unit.prototype.clear = function () {
	// wtf constants??
	this.layer.clearRect(this.x - 1, this.y - 1, this.config.width + 1, this.config.height + 2);
};

export default Unit;
