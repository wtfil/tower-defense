import {getFirst} from './maps';
import {unit, arrowTower, cannonTower} from './objects';
import {renderStats, renderUnits, renderCursor, renderMap, preloadAll} from './core/render';
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
ctx.imageSmoothingEnabled = false;
canvas.width = 640;
canvas.height = 480;

var game = initGame(map, ctx);
var isPause = false;
var towerToBuild = null;

game.run();
document.addEventListener('visibilitychange', e => isPause = document.hidden);
document.addEventListener('keyup', e => {
	switch (Number(e.keyCode)) {
		case 49: towerToBuild = arrowTower; break;
		case 50: towerToBuild = cannonTower; break;
		default: towerToBuild = null;
	}
});
canvas.addEventListener('click', e => {
	var point;
	if (towerToBuild) {
		point = game.cursorGrid(mouse.get());
		if (!point.alowed) {
			return;
		}
		game.addUnit(towerToBuild, {
			...point,
			layer: ctx
		});
	}
});

function gameLoop() {
	if (isPause) {
		return setTimeout(gameLoop, 1000 / 60);
	}
	game.setTargets();
	game.fire();
	game.collision();
	game.getUnits().forEach(item => {
		item.move();
	});
	setTimeout(gameLoop, 1000 / 60);
}

function renderLoop() {
	var renderOpts = {layer: ctx};
	renderMap(map.map, renderOpts);
	renderUnits(game.getUnits(), renderOpts);
	renderStats(game.getStats(), renderOpts);
	renderCursor(towerToBuild, {
		...renderOpts,
		...game.cursorGrid(mouse.get())
	});
	requestAnimationFrame(renderLoop);
}

preloadAll(() => {
	gameLoop();
	renderLoop();
});
