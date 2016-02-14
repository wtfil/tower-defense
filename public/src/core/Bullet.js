import {getAngle} from './utils';
import Dynamic from './Dynamic';

export default class Bullet extends Dynamic {
	update() {
		const ms = this.config.movementSpeed * 100;
		if (this.config.homing && this.target) {
			this.angle = getAngle(this, this.target);
		}
		this.body.velocity.x = ms * Math.cos(this.angle);
		this.body.velocity.y = ms * Math.sin(this.angle);
	}

	clearTarget(unit) {
		if (this.target === unit) {
			this.target = null;
		}
	}

	setTarget(target) {
		this.target = target;
		this.angle = getAngle(this, target);
	}
}
