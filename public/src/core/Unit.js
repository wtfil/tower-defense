import Dynamic from './Dynamic';
import {distance2, getAngle} from './utils';

export default class Unit extends Dynamic {
	constructor(...args) {
		super(...args);
		this.health = this.config.health;

		this.healthBar = this.game.add.graphics(0, 0);
		this.healthBar.anchor = new Phaser.Point();
		this.addChild(this.healthBar);
	}
	update() {
		if (this.path && distance2(this, this.path[0]) < 10) {
			if (this.path.length > 1) {
				this.path = this.path.slice(1);
				this.angle = getAngle(this, this.path[0]);
			} else {
				this.path = null;
			}
		}

		const hp = this.health / this.config.health;
		const w = this.config.width;
		const ms = this.config.movementSpeed * 100;
		this.body.velocity.x = Math.cos(this.angle) * ms;
		this.body.velocity.y = Math.sin(this.angle) * ms;

		this.healthBar.clear();
		this.healthBar.lineStyle(2, 0x00ff00, 0.5);
		this.healthBar.drawRect(0, 0, w * hp, 2);
		this.healthBar.lineStyle(2, 0xff0000, 0.5);
		this.healthBar.drawRect(w * hp, 0, w * (1 - hp), 2);
	}
	takeDamage(bullet) {
		this.health -= bullet.config.damage;
		if (this.health <= 0) {
			this.kill();
		}
	}

	setPath(path) {
		this.path = path;
		this.angle = getAngle(this, path[0]);
	}
}
