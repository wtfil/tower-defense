import {render} from './render';

function Unit(config, {x, y, layer, angle = 0}) {
	this.config = config;
	this.layer = layer;
	this.x = x;
	this.y = y;
	this.angle = angle;
	this.frame = 0;
	this.isTower = config.type === 'tower';
	this.health = config.health;
	this.range = this.config.range;
	this.target = null;
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
	this.x += this.config.movementSpeed * Math.cos(this.angle);
	this.y += this.config.movementSpeed * Math.sin(this.angle);
};
Unit.prototype.render = function () {
	render(this.config, {
		x: this.x,
		y: this.y,
		frame: this.frame,
		layer: this.layer
	});
};
Unit.prototype.setTarget = function (target) {
	this.target = target;
};
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
	console.log('die');
};
Unit.prototype.clear = function () {
	// wtf constants??
	this.layer.clearRect(this.x - 1, this.y - 1, this.config.width + 1, this.config.height + 2);
};

export default Unit;
