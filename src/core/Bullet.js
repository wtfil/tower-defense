import Dynamic from './Dynamic';

export default class Bullet extends Dynamic {
    constructor(...args) {
        super(...args);
        this.anchor.set(0.5, 0.5);
    }
    update() {
        const ms = this.config.movementSpeed * 100;
        if (this.config.homing && this.target) {
            this.rotation = this.game.physics.arcade.angleBetweenCenters(this, this.target, true);
        }
        this.body.velocity.x = ms * Math.cos(this.rotation);
        this.body.velocity.y = ms * Math.sin(this.rotation);
    }

    clearTarget(unit) {
        if (this.target === unit) {
            this.target = null;
        }
    }

    setTarget(target) {
        this.target = target;
        this.rotation = this.game.physics.arcade.angleBetweenCenters(this, this.target, true);
    }
}
