import {render} from './render';

function Unit(config, opts) {
	this.config = config;
	this.layer = opts.layer;
	this.x = opts.x;
	this.y = opts.y;
	this.frame = 0;
	this.updateFrame();
}
Unit.prototype.updateFrame = function () {
	this.frame = this.frame === this.config.textures.length - 1 ?
		0 : (this.frame + 1);
	this.frameTimer = setTimeout(this.updateFrame.bind(this), 300);
};
Unit.prototype.move = function () {
	this.x ++;
};
Unit.prototype.render = function () {
	render(this.config, {
		x: this.x,
		y: this.y,
		frame: this.frame,
		layer: this.layer
	});
};
Unit.prototype.clear = function () {
	// wtf constants??
	this.layer.clearRect(this.x - 1, this.y - 1, this.config.width + 1, this.config.height + 2);
};

export default Unit;
