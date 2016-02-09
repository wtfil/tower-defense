import Dynamic from './Dynamic';

export default class Bullet extends Dynamic {
	update() {
		this.body.velocity.x = this.config.movementSpeed * 100;
	}
}
