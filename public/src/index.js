import {getFirst} from './maps';
import {unit, arrowTower, cannonTower} from './objects';
import {renderCursor, renderMap, preloadAll} from './core/render';
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
function loop() {
	if (isPause) {
		return;
	}
	game.setTargets();
	game.fire();
	game.collision();
	game.getUnits().forEach(item => {
		item.clear();
		item.move();
	});
	renderMap(map.map, {layer: ctx});
	game.getUnits().forEach(item => {
		item.render();
	});
	renderCursor(towerToBuild, {
		layer: ctx,
		...game.cursorGrid(mouse.get())
	});
	requestAnimationFrame(loop);
}

preloadAll(loop);
