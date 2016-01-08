import astar from '../public/src/core/algorithms/astar';

describe('A*', () => {

	it('simple', () => {
		const map = [
			[0, 0, 0],
			[0, 0, 0],
			[0, 0, 0]
		];
		const start = {x: 0, y: 1};
		const end = {x: 2, y: 1};
		const path = astar(start, end, map);
		path.should.be.deep.equal([{x: 0, y: 1}, {x: 1, y: 1}, {x: 2, y: 1}]);
	});
});
