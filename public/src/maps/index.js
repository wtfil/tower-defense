import first from './first';
function stToMap(st) {
	return st.split('\n').filter(Boolean).map(line => {
		return line.split('');
	});
}
export function getFirst() {
	return stToMap(first);
}
