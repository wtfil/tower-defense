import {getAngle} from './utils';
import Dynamic from './Dynamic';

export default class Bullet extends Dynamic {
    constructor(...args) {
        super(...args);
        this.anchor.set(0.5, 0.5);
    }
    update() {
        const ms = this.config.movementSpeed * 100;
        if (this.config.homing && this.target) {
            this.movingAngle = getAngle(this, this.target, true);
            this.angle = this.movingAngle * 180 / Math.PI;
        }
        this.body.velocity.x = ms * Math.cos(this.movingAngle);
        this.body.velocity.y = ms * Math.sin(this.movingAngle);
    }

    clearTarget(unit) {
        if (this.target === unit) {
            this.target = null;
        }
    }

    setTarget(target) {
        this.target = target;
        this.movingAngle = getAngle(this, target, true);
        this.angle = this.movingAngle * 180 / Math.PI;
    }
}
