import {assets} from './objects';
import TowerDefense from './core/TowerDefense';

/*
var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload, update, create });
function preload () {
	assets.forEach(item => {
		this.game.load.image(item[0], item[1]);
	});
}
function create () {
	this.game.add.sprite(0, 0, 'grass.0');
}
function update () {
}
*/
var game = new Phaser.Game(800, 320, Phaser.AUTO);
game.state.add('Game', TowerDefense, true);


/*
import {getFirst} from './maps';
import * as objects from './objects';
import {
	renderPanel,
	renderStats,
	renderUnits,
	renderCursor,
	renderUnitOptions,
	renderMap,
	preloadAll
} from './core/render';
import {round, random} from './core/utils';
import initGame from './core/game';
import initMouse from './core/mouse';
import {SEGMENT} from './core/constants';

const map = getFirst();
const requestAnimationFrame = window.requestAnimationFrame ||
	window.webkitRequestAnimationFrame ||
	window.mozRequestAnimationFrame ||
	(cb => setTimeout(cb, 1000 / 60))

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const mouse = initMouse(ctx);
const towers = Object.keys(objects).map(key => objects[key]).filter(item => item.type === 'tower');
ctx.imageSmoothingEnabled = false;
ctx.translate(0.5, 0.5);
canvas.width = 640;
canvas.height = 320;

var game = initGame(map);
var isPause = false;
var towerToBuild = null;
var selectedUnit = null;

game.run();
renderPanel(document.querySelector('[data-panel]'));
document.addEventListener('visibilitychange', e => isPause = document.hidden);
document.querySelector('[data-fullscreen]').addEventListener('click', e => {
	canvas.webkitRequestFullScreen();
});
canvas.addEventListener('contextmenu', e => {
	e.preventDefault();
	towerToBuild = null
});
towers.forEach(tower => {
	document.querySelector(`[data-tower="${tower.name}"]`).addEventListener('click', e => {
		towerToBuild = tower;
	});
});
canvas.addEventListener('click', e => {
	var point = mouse.get();
	var action;
	if (towerToBuild) {
		point = game.buildAtributes(towerToBuild, point);
		if (!point.alowed) {
			return;
		}
		game.buildTower(towerToBuild, point);
	} else {
		action = game.findUnderCursor(point);
		if (!action) {
			selectedUnit = null;
			return;
		}
		if (action.type === 'tower') {
			selectedUnit = action.tower;
			return;
		}
	}
});

function gameLoop() {
	var next = setTimeout.bind(null, gameLoop, 1000 / 60);
	if (isPause) {
		return next();
	}
	var stats = game.getStats();
	if (stats.lives <= 0) {
		game.destroy();
		game = initGame(map);
		game.run();
		return next();
	}
	game.setTargets();
	game.fire();
	game.collision();
	game.getUnits().forEach(item => {
		item.move();
	});
	next();
}

function renderLoop() {
	var renderOpts = {layer: ctx};
	ctx.clearRect(0, 0, 1000, 1000);
	renderMap(map.map, renderOpts);
	renderUnits(game.getUnits(), renderOpts);
	renderStats(game.getStats(), renderOpts);
	renderUnitOptions(selectedUnit, renderOpts);
	if (towerToBuild) {
		renderCursor(towerToBuild, {
			...renderOpts,
			...game.buildAtributes(towerToBuild, mouse.get())
		});
	}
	requestAnimationFrame(renderLoop);
}

preloadAll(() => {
	gameLoop();
	renderLoop();
});
*/
