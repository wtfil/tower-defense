import {getFirst} from '../maps';
import {units, towers} from '../objects';
import {round} from './utils';
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
		units.concat(towers).forEach(item => {
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

		this.cursor = this.add.sprite();
		this.cursor.visible = false;
		towers.forEach((tower, index) => {
			var button = this.add.button(640, SEGMENT * index, tower.name, () => this.selectTowerToBuild(tower));
			button.width = SEGMENT;
			button.height = SEGMENT;
		});

		this.units = this.add.physicsGroup();
		this.towers = this.add.group();
		this.ammo = this.add.group();

		this.time.events.repeat(2000, 10, ::this.spawnUnit);
	}

	spawnUnit() {
		var config = units[0];
		var unit = this.units.create(this.map.spawn.x * SEGMENT, this.map.spawn.y * SEGMENT, config.name);
		unit.body.velocity.x = config.movementSpeed * 100;
		unit.animations.add('move');
		unit.animations.play('move', 4, true);
	}

	spawnTower(config, x, y) {
		var tower = this.towers.create(x, y, config.name);
		tower.width = SEGMENT;
		tower.height = SEGMENT;
		this.towerToBuild = null;
		this.cursor.visible = false;
		return tower;
	}

	update() {
		const {worldX, worldY} = this.input.mousePointer;
		const x = round(worldX, SEGMENT);
		const y = round(worldY, SEGMENT);
		this.statsLabel.text = `
			Lives ${this.stats.lives}
			Wave  ${this.stats.wave + 1}
		`.trim();
		this.physics.arcade.overlap(this.ammo, this.units, this.attackUnit.bind(this));
		this.cursor.position.set(round(worldX, SEGMENT), round(worldY, SEGMENT));

		if (this.input.activePointer.isDown && this.towerToBuild) {
			this.spawnTower(this.towerToBuild, x, y);
		}
	}

	selectTowerToBuild(tower) {
		this.towerToBuild = tower;
		this.cursor.loadTexture(tower.name);
		this.cursor.width = SEGMENT;
		this.cursor.height = SEGMENT;
		this.cursor.visible = true;
	}

	attackUnit() {
		console.log(arguments);
	}
}
