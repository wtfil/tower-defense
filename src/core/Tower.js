import Dynamic from './Dynamic';
import Bullet from './Bullet';
import {inRangeDiff, inRange, getAngle} from './utils';

export default class Tower extends Dynamic {
	constructor(...args) {
		super(...args);
		this.fireInterval = 1000 / this.config.attackSpeed;
		this.lastShotAt = 0;
		this.anchor.set(0.5, 0.5);
	}

	update() {
		if (this.target) {
			this.angle = getAngle(this, this.target) * 180 / Math.PI + 90;
		}
	}

	setTarget(units) {
		if (this.target && inRange(this, this.target)) {
			return;
		}
		var minDiff = Infinity;
		var i = 0;
		var target, diff;
		for (; i < units.children.length; i ++) {
			if (!units.children[i].exists) {
				continue;
			}
			diff = inRangeDiff(this, units.children[i]);
			if (diff <= 0 && diff < minDiff) {
				minDiff = diff;
				target = units.children[i];
			}
		}
		this.target = target || null;
	}

	clearTarget(unit) {
		if (this.target === unit) {
			this.target = null;
		}
	}

	fire(group) {
		var now = Date.now();
		if (!this.target) {
			return;
		}
		if (this.lastShotAt + this.fireInterval > now) {
			return null;
		}
		const bullet = new Bullet(this.game, this.config.shot, this.x, this.y);
		bullet.setTarget(this.target);
		group.add(bullet);
		this.lastShotAt = now;
	}
}
