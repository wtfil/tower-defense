import Dynamic from './Dynamic';

export default class Unit extends Dynamic {
	constructor(...args) {
		super(...args);
		this.health = this.config.health;

		this.healthBar = this.game.add.graphics(0, 0);
		this.healthBar.anchor = new Phaser.Point();
		this.addChild(this.healthBar);
	}
	update() {
		this.body.velocity.x = this.config.movementSpeed * 100;

		const hp = this.health / this.config.health;
		const w = this.config.width;
		this.healthBar.clear();
		this.healthBar.lineStyle(2, 0x00ff00, 0.5);
		this.healthBar.drawRect(0, 0, w * hp, 2);
		this.healthBar.lineStyle(2, 0xff0000, 0.5);
		this.healthBar.drawRect(w * hp, 0, w * (1 - hp), 2);
	}
	takeDamage(bullet) {
		this.health -= bullet.config.damage;
		if (this.health < 0) {
			this.kill();
		}
	}
}
