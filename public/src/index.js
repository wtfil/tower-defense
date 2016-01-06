import {getFirst} from './maps';
import {unit, arrowTower, cannonTower} from './objects';
import {renderUnits, renderCursor, renderMap, preloadAll} from './core/render';
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
	var units = game.getUnits();
	var renderOpts = {layer: ctx};
	if (isPause) {
		return;
	}
	game.setTargets();
	game.fire();
	game.collision();
	units.forEach(item => {
		item.move();
	});
	renderMap(map.map, renderOpts);
	renderUnits(units, renderOpts);
	renderCursor(towerToBuild, {
		...renderOpts,
		...game.cursorGrid(mouse.get())
	});
	requestAnimationFrame(loop);
}

preloadAll(loop);
