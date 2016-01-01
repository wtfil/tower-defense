import first from './first';
import {sand, grass, rock} from '../objects';

const itemToObjectMap = {
	0: sand,
	1: grass,
	2: rock
};

function stToMap(st) {
	return st.split('\n').filter(Boolean).map(line => {
		return line.split('').map(Number).map(item => {
			return itemToObjectMap[item];
		});
	});
}
export function getFirst() {
	return stToMap(first);
}
