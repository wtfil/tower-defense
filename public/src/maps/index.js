import first from './first';
import {spawn, unit, sand, grass, rock} from '../objects';

const landscapes = {
	0: sand,
	1: grass,
	2: rock
};
const units = {
	1: unit
};

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
export function getFirst() {
	const config = first;
	return {
		...config,
		map: createMap(config),
		waves: createWaves(config.waves)
	};
}
