import {getFirst} from '../maps';
import {units, towers} from '../objects';
import {round} from './utils';
import Unit from './Unit';
import Tower from './Tower';

const SEGMENT = 32;
const FONT_SCALES = {
	s: 1 / 4,
	m: 1 / 2,
	l: 1
};

export default class TowerDefense {
	constructor() {
		this.map = getFirst();
		this.stats = {
			lives: this.map.lives,
			gold: this.map.gold,
			wave: 0
		};
	}
	preload() {
		this.load.image('grass', 'images/grass_3.png');
		this.load.image('font', 'images/PressStart2P.png');
		this.load.spritesheet('spawn', 'images/spawn.png', SEGMENT, SEGMENT);
		units.concat(towers).reduce((arr, item) => {
			return arr.concat(item).concat(item.shot);
		}, []).filter(Boolean).forEach(item => {
			if (item.sprite) {
				this.load.spritesheet(item.name, item.sprite, SEGMENT, SEGMENT);
			} else {
				this.load.image(item.name, item.textures[0]);
			}
		});
	}
	addSprite(x, y, name) {
		var sprite = this.add.sprite(x, y, name);
		sprite.animations.add('spin');
		sprite.animations.play('spin', 4, true);
		return sprite;
	}
	addLabel(x, y, size) {
		var label = this.add.retroFont('font', 32, 32, Phaser.RetroFont.TEXT_SET1);
		var image = this.add.image(x, y, label);
		var scale = FONT_SCALES[size] || 1;
		image.scale.setTo(scale, scale);
		label.multiLine = true;
		return label;
	}

	create() {
		const {size: {width, height}, spawn, finish} = this.map;
		this.physics.startSystem(Phaser.Physics.ARCADE);
		this.stage.backgroundColor = 0xffffff;
		this.add.tileSprite(0, 0, width * SEGMENT, height * SEGMENT, 'grass');
		this.statsLabel = this.addLabel(5, 5, 'm');
		this.addSprite(spawn.x * SEGMENT, spawn.y * SEGMENT, 'spawn');
		this.addSprite(finish.x * SEGMENT, finish.y * SEGMENT, 'spawn');

		this.towers = this.add.group();
		this.units = this.add.physicsGroup();
		this.bullets = this.add.physicsGroup();

		this.cursor = this.add.sprite();
		this.cursor.visible = false;
		towers.forEach((tower, index) => {
			var button = this.add.button(640, SEGMENT * index, tower.name, () => this.selectTowerToBuild(tower));
			button.width = SEGMENT;
			button.height = SEGMENT;
		});

		this.time.events.repeat(2000, 10, ::this.spawnUnit);
	}

	spawnUnit() {
		const config = units[0];
		const x = this.map.spawn.x * SEGMENT;
		const y = this.map.spawn.y * SEGMENT;
		this.units.add(new Unit(this.game, config, x, y));
	}

	spawnTower(x, y) {
		this.towers.add(new Tower(this.game, this.towerToBuild, x, y));
		this.towerToBuild = null;
		this.cursor.visible = false;
	}

	update() {
		const {worldX, worldY} = this.input.mousePointer;
		const x = round(worldX, SEGMENT);
		const y = round(worldY, SEGMENT);
		this.statsLabel.text = `
			Lives ${this.stats.lives}
			Wave  ${this.stats.wave + 1}
		`.trim();
		this.towers.callAll('fire', null, this.bullets);
		this.physics.arcade.overlap(this.bullets, this.units, this.attackUnit.bind(this));
		this.cursor.position.set(x, y);

		if (this.input.activePointer.isDown && this.towerToBuild) {
			this.spawnTower(x, y);
		}
	}

	selectTowerToBuild(tower) {
		this.towerToBuild = tower;
		this.cursor.loadTexture(tower.name);
		this.cursor.width = SEGMENT;
		this.cursor.height = SEGMENT;
		this.cursor.visible = true;
	}

	attackUnit(bullet, unit) {
		unit.takeDamage(bullet);
		bullet.kill();
	}
}
