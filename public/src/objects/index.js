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
function getAssets(config, key) {
	if (!config || !config.textures) {
		return [];
	}
	return config.textures.map((item, index) => {
		return [`${key}.${index}`, item];
	})
		.concat(getAssets(config.shot, key + '.shot'))
		.concat(getAssets(config.death, key + '.death'));

}
export const assets = Object.keys(objects).reduce((acc, key) => {
	return acc.concat(getAssets(objects[key], key));
}, []);
