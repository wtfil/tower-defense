import {getFirst} from '../maps';
const SEGMENT = 32;
const FONT_SCALES = {
	s: 1 / 4,
	m: 1 / 2,
	l: 1
};

class Config {
	constructor(config) {
		this.config = config;
	}
	preload() {
		this.config.textures.forEach((item, index) => {
			this.load.image(index, item);
		});
	}
}

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
	}
	addSprite(x, y, name) {
		var sprite = this.add.sprite(x, y, name);
		sprite.animations.add('walk');
		sprite.animations.play('walk', 4, true);
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
		var background = this.add.tileSprite(0, 0, width * SEGMENT, height * SEGMENT, 'grass');
		this.statsLabel = this.addLabel(5, 5, 'm');
		this.addSprite(spawn.x * SEGMENT, spawn.y * SEGMENT, 'spawn');
		this.addSprite(finish.x * SEGMENT, finish.y * SEGMENT, 'spawn');
	}

	update() {
		this.statsLabel.text = `
			Lives ${this.stats.lives}
			Wave  ${this.stats.wave + 1}
		`.trim();
	}
}
