export grass from './grass';
export sand from './sand';
export rock from './rock';
export spawn from './spawn';

export peasant from './peasant';
export recruit from './recruit';

export arrowTower from './arrowTower';
export cannonTower from './cannonTower';
export iceTower from './iceTower';

import * as objects from '.';

export const towers = Object.keys(objects)
	.map(key => objects[key])
	.filter(Boolean)
	.filter(item => item.type === 'tower');

export const units = Object.keys(objects)
	.map(key => objects[key])
	.filter(Boolean)
	.filter(item => item.type === 'unit');

export const decorations = Object.keys(objects)
	.map(key => objects[key])
	.filter(Boolean)
	.filter(item => item.type === 'decoration');
