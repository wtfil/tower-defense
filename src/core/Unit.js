import Dynamic from './Dynamic';
import {distance2} from './utils';

const SEGMENT = 64;

const periodic = x => Math.cos(x) + Math.sin(x * 1.5 + Math.PI / 3);

class UnitSprite extends Dynamic {}

export default class Unit extends Phaser.Sprite {
    constructor(game, config, x, y) {
        super(game, x, y, 'none');

        this.startTime = ~~(Math.random() * 1e6);
        this.game = game;
        this.config = config;
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.add.existing(this);
        this.unit = new UnitSprite(game, config, SEGMENT / 2, SEGMENT / 2);
        this.addChild(this.unit);
        this.unit.anchor.set(0.5, 0.5);

        this.health = this.config.health;
        this.buffs = {};

        this.healthBar = this.game.add.graphics(0, 0);
        this.addChild(this.healthBar);
    }
    update() {
        if (this.path && distance2(this, this.path[0]) < 10) {
            if (this.path.length > 1) {
                this.path = this.path.slice(1);
                this.movingAngle = this.game.physics.arcade.angleBetween(this, this.path[0]);
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
        this.unit.angle = periodic((Date.now() - this.startTime) / 2000) * 360;

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
        this.movingAngle = this.game.physics.arcade.angleBetween(this, path[0]);
    }
}
