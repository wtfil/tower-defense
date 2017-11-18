import first from './first';
import second from './second';
import {spawn, recruit, peasant, sand, grass, rock} from '../objects';

const landscapes = {
	0: sand,
	1: grass,
	2: rock
};
const units = {
	1: peasant,
	2: recruit
};
const maps = {first, second};

function createMap(config) {
	var map = config.map.split('\n').filter(Boolean).map(line => {
		return line.trim().split('').map(Number).map(item => {
			return landscapes[item];
		});
	});
	map[config.spawn.y][config.spawn.x] = spawn;
	map[config.finish.y][config.finish.x] = spawn;
	return map;
}
function createWaves(waves) {
	return waves.map(item => {
		return {
			unit: units[item[0]],
			count: item[1]
		};
	});
}

export function getMap(name) {
	const map = maps[name];
	if (!map) {
		throw new Error(`There is not map with name "${name}"`);
	}
	return {
		...map,
		map: createMap(map),
		waves: createWaves(map.waves)
	};
}
