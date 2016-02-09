import Dynamic from './Dynamic';
import Bullet from './Bullet';

export default class Tower extends Dynamic {
	constructor(...args) {
		super(...args);
		this.fireInterval = 1000 / this.config.attackSpeed;
		this.lastShotAt = 0;
	}

	fire(group) {
		var now = Date.now();
		if (this.lastShotAt + this.fireInterval > now) {
			return null;
		}
		this.lastShotAt = now;
		const bullet = new Bullet(this.game, this.config.shot, this.x, this.y);
		group.add(bullet);
	}
}

