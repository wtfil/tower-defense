import Dynamic from './Dynamic';
import {distance2, getAngle} from './utils';

const SEGMENT = 64;

class UnitSprite extends Dynamic {}

export default class Unit extends Phaser.Sprite {
	constructor(game, config, x, y) {
		super(game, x, y);

		const sx = 1 / this.scale.x;
		const sy = 1 / this.scale.y;

		this.startTime = Date.now();
		this.game = game;
		this.config = config;
		this.game.physics.startSystem(Phaser.Physics.ARCADE);
		this.game.add.existing(this);
		this.unit = new UnitSprite(game, config, 0, 0);

		this.addChild(this.unit);
		this.unit.anchor.set(0.5, 0.5);
		this.unit.width *= sx;
		this.unit.height *= sy;
		this.unit.x = sx * SEGMENT / 2;
		this.unit.y = sy * SEGMENT / 2;

		this.health = this.config.health;
		this.buffs = {};

		this.healthBar = this.game.add.graphics(0, 0);
		this.healthBar.width *= sx;
		this.healthBar.height *= sy;
		this.addChild(this.healthBar);

	}
	update() {
		if (this.path && distance2(this, this.path[0]) < 10) {
			if (this.path.length > 1) {
				this.path = this.path.slice(1);
				this.movingAngle = getAngle(this, this.path[0]);
			} else {
				this.path = null;
			}
		}
		this.applyBuffs();

		const hp = this.health / this.config.health;
		const ms = this.movementSpeed * 100;
		const w = SEGMENT;
		this.body.velocity.x = Math.cos(this.movingAngle) * ms;
		this.body.velocity.y = Math.sin(this.movingAngle) * ms;
		this.unit.angle = Math.sin((Date.now() - this.startTime) / 1000) * 360;

		this.healthBar.clear();
		this.healthBar.lineStyle(2, 0x00ff00, 0.5);
		this.healthBar.drawRect(0, 0, w * hp, 2);
		this.healthBar.lineStyle(2, 0xff0000, 0.5);
		this.healthBar.drawRect(w * hp, 0, w * (1 - hp), 2);
	}

	applyBuffs() {
		let key;
		this.movementSpeed = this.config.movementSpeed;
		for (key in this.buffs) {
			const buff = this.buffs[key];
			if (buff.startAt + buff.config.duration < Date.now()) {
				buff.sprite.kill();
			} else {
				buff.config.effect(this);
			}
		}
	}

	takeDamage(bullet) {
		this.health -= bullet.config.damage;
		if (this.health <= 0) {
			return this.kill();
		}
		const {buff} = bullet.config;
		if (!buff) {
			return;
		}
		if (!this.buffs[buff.name]) {
			const sprite = this.game.add.image(0, 4, buff.name);
			sprite.width = buff.width;
			sprite.height = buff.height;
			this.buffs[buff.name] = {config: buff, sprite};
			this.addChild(sprite);
		}
		this.buffs[buff.name].startAt = Date.now();
	}

	setPath(path) {
		this.path = path;
		this.movingAngle = getAngle(this, path[0]);
	}
}
