import {getFirst} from './maps';
import * as objects from './objects';
import {renderPanel, renderStats, renderUnits, renderCursor, renderMap, preloadAll} from './core/render';
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
canvas.width = 640;
canvas.height = 320;

var game = initGame(map);
var isPause = false;
var towerToBuild = null;

game.run();
renderPanel(document.querySelector('[data-panel]'));
document.addEventListener('visibilitychange', e => isPause = document.hidden);
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
	var point;
	if (towerToBuild) {
		point = game.buildAtributes(towerToBuild, mouse.get());
		if (!point.alowed) {
			return;
		}
		game.buildTower(towerToBuild, point);
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
