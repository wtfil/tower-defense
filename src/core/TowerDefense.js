import {getFirst} from '../maps';
import {units, towers} from '../objects';
import {scale, round, inSplash, isOverlap} from './utils';
import astar from './algorithms/astar';
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
	}
	preload() {
		this.load.image('grass', 'images/grass_3.png');
		this.load.image('font', 'images/PressStart2P.png');
		this.load.spritesheet('spawn', 'images/spawn.png', SEGMENT, SEGMENT);
		units.concat(towers).reduce((arr, item) => {
			return arr.concat(item).concat(item.shot).concat(item.shot && item.shot.buff);
		}, []).filter(Boolean).forEach(item => {
			if (!item.name) {
				console.warn('Name is missing', item);
			}
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
		var fontScale = FONT_SCALES[size] || 1;
		image.scale.setTo(fontScale, fontScale);
		label.multiLine = true;
		return label;
	}

	create() {
		const {size: {width, height}, spawn, finish} = this.map;
		this.stats = {
			lives: this.map.lives,
			gold: this.map.gold,
			unitsToKill: 0,
			wave: 0
		};
		this.physics.startSystem(Phaser.Physics.ARCADE);
		this.stage.backgroundColor = 0xffffff;
		this.add.tileSprite(0, 0, width * SEGMENT, height * SEGMENT, 'grass');
		this.statsLabel = this.addLabel(5, 5, 'm');
		this.start = this.addSprite(spawn.x * SEGMENT, spawn.y * SEGMENT, 'spawn');
		this.finish = this.addSprite(finish.x * SEGMENT, finish.y * SEGMENT, 'spawn');
		this.game.physics.arcade.enable(this.finish);

		this.towers = this.add.group();
		this.units = this.add.physicsGroup();
		this.bullets = this.add.physicsGroup();

		this.towerAllowedPlacesCache = {};
		this.mapObjects = new Array(this.map.size.height).fill()
			.map(_ => new Array(this.map.size.width).fill(0));


		this.cursor = this.add.sprite();
		this.cursor.tint = 0xff0000;
		this.cursor.visible = false;

		towers.forEach((tower, index) => {
			var button = this.add.button(640, SEGMENT * index, tower.name, () => this.selectTowerToBuild(tower));
			button.width = SEGMENT;
			button.height = SEGMENT;
		});

		this.esc = this.game.input.keyboard.addKey(Phaser.Keyboard.ESC);
		this.runWave();
	}

	runWave() {
		this.stats.unitsToKill = this.map.waves[this.stats.wave].count;
		this.time.events.repeat(2000, this.stats.unitsToKill, ::this.spawnUnit);
	}

	spawnUnit() {
		const config = this.map.waves[this.stats.wave].unit;
		const {x, y} = scale(this.map.spawn, SEGMENT);
		const unit = new Unit(this.game, config, x, y);
		this.units.add(unit);
		this.updatePath(unit);
	}

	updatePath(unit) {
		const path = astar(
			scale(unit, 1 / SEGMENT),
			this.map.finish,
			this.mapObjects
		).slice(1).map(point => scale(point, SEGMENT));
		unit.setPath(path);
	}

	spawnTower(x, y) {
		if (!this.isAllowToBuild(x, y)) {
			return;
		}
		this.towers.add(new Tower(this.game, this.towerToBuild, x, y));
		this.stats.gold -= this.towerToBuild.price;
		this.mapObjects[y / SEGMENT][x / SEGMENT] = 1;
		this.towerAllowedPlacesCache = {};
		this.units.forEachExists(::this.updatePath);
	}

	isAllowToBuild(x, y) {
		if (this.towerToBuild.price > this.stats.gold) {
			return false;
		}
		const objects = this.units.children.concat(this.towers.children);
		const tower = {config: this.towerToBuild, x, y};
		var i;

		for (i = 0; i < objects.length; i ++) {
			if (objects[i].exists && isOverlap(objects[i], tower)) {
				return false;
			}
		}

		x /= SEGMENT;
		y /= SEGMENT;

		const key = x + ',' + y;
		if (key in this.towerAllowedPlacesCache) {
			return this.towerAllowedPlacesCache[key];
		}
		const mapObjectsCopy = this.mapObjects.slice();
		mapObjectsCopy[y] = this.mapObjects[y].slice();
		mapObjectsCopy[y][x] = 1;
		const path = astar(this.map.spawn, this.map.finish, mapObjectsCopy);
		return (this.towerAllowedPlacesCache[key] = Boolean(path));
	}

	update() {
		const {worldX, worldY} = this.input.mousePointer;
		const x = round(worldX, SEGMENT);
		const y = round(worldY, SEGMENT);
		this.statsLabel.text = `
			Gold  ${this.stats.gold}
			Lives ${this.stats.lives}
			Wave  ${this.stats.wave + 1} / ${this.map.waves.length}
		`.trim();

		this.towers.callAll('setTarget', null, this.units);
		this.towers.callAll('fire', null, this.bullets);
		this.physics.arcade.overlap(this.bullets, this.units, ::this.attackUnits);
		this.physics.arcade.overlap(this.finish, this.units, ::this.unitFinish);

		this.cursor.position.set(x, y);
		if (this.esc.isDown) {
			this.cursor.visible = false;
			this.towerToBuild = null;
		}
		if (this.towerToBuild) {
			this.cursor.tint = this.isAllowToBuild(x, y) ?
				0x00ff00 : 0xff0000;
		}
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
		if (!unit.exists) {
			this.stats.gold += unit.config.bounty;
			this.removeUnit(unit);
		}
	}

	unitFinish(_, unit) {
		unit.kill();
		this.removeUnit(unit);
		this.stats.lives --;
		if (this.stats.lives < 0) {
			this.game.state.start('Game');
		}
	}

	removeUnit(unit) {
		this.towers.callAll('clearTarget', null, unit);
		this.bullets.callAll('clearTarget', null, unit);
		this.stats.unitsToKill --;
		if (this.stats.unitsToKill === 0) {
			this.stats.wave ++;
			if (this.stats.wave >= this.map.waves.length) {
				return this.game.state.start('Game');
			}
			this.game.time.events.add(5000, ::this.runWave).autoDestroy = true;
		}
	}

	attackUnits(bullet, unit) {
		if (!bullet.config.splash) {
			return this.attackUnit(bullet, unit);
		}
		this.units.forEach(unit => {
			if (inSplash(bullet, unit)) {
				this.attackUnit(bullet, unit);
			}
		});
	}

}