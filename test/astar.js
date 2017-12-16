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
        expect(path).to.deep.equal([{x: 0, y: 1}, {x: 1, y: 1}, {x: 2, y: 1}]);
    });

    it('with wall', () => {
        const map = [
            [0, 0, 0],
            [0, 1, 0],
            [0, 0, 0]
        ];
        const start = {x: 0, y: 1};
        const end = {x: 2, y: 1};
        const path = astar(start, end, map);
        expect(path).to.deep.equal([{x: 0, y: 1}, {x: 0, y: 0}, {x: 1, y: 0}, {x: 2, y: 0}, {x: 2, y: 1}]);
    });

    it('with no path', () => {
        const map = [
            [0, 1, 0],
            [0, 1, 0],
            [0, 1, 0]
        ];
        const start = {x: 0, y: 1};
        const end = {x: 2, y: 1};
        const path = astar(start, end, map);
        expect(path).to.be.null;
    });

    it('with zigzag', () => {
        const map = [
            [0, 0, 0, 0, 0],
            [1, 1, 1, 0, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 1, 1, 1],
            [0, 0, 0, 0, 0]
        ];
        const start = {x: 0, y: 0};
        const end = {x: 4, y: 4};
        const path = astar(start, end, map);
        expect(path).to.be.deep.equal([
            {x: 0, y: 0},
            {x: 1, y: 0},
            {x: 2, y: 0},
            {x: 3, y: 0},
            {x: 3, y: 1},
            {x: 3, y: 2},
            {x: 2, y: 2},
            {x: 1, y: 2},
            {x: 1, y: 3},
            {x: 1, y: 4},
            {x: 2, y: 4},
            {x: 3, y: 4},
            {x: 4, y: 4}
        ]);
    });

    it('with zigzag and hole', () => {
        const map = [
            [0, 0, 0, 0, 0],
            [1, 1, 1, 1, 0],
            [0, 0, 0, 0, 0],
            [0, 0, 1, 0, 1],
            [0, 0, 0, 0, 0]
        ];
        const start = {x: 0, y: 0};
        const end = {x: 4, y: 4};
        const path = astar(start, end, map);
        expect(path).to.be.deep.equal([
            {x: 0, y: 0},
            {x: 1, y: 0},
            {x: 2, y: 0},
            {x: 3, y: 0},
            {x: 4, y: 0},
            {x: 4, y: 1},
            {x: 4, y: 2},
            {x: 3, y: 2},
            {x: 3, y: 3},
            {x: 3, y: 4},
            {x: 4, y: 4}
        ]);
    });

    it('two ways', () => {
        const map = [
            [0, 0, 0, 1, 0, 0],
            [0, 0, 0, 1, 0, 0],
            [0, 1, 0, 1, 0, 0],
            [0, 1, 0, 1, 0, 0],
            [0, 1, 0, 1, 0, 0],
            [0, 1, 0, 1, 0, 0],
            [0, 0, 0, 0, 0, 0]
        ];
        const start = {x: 0, y: 3};
        const end = {x: 5, y: 3};
        const path = astar(start, end, map);
        expect(path).to.be.deep.equal([
            {x: 0, y: 3},
            {x: 0, y: 4},
            {x: 0, y: 5},
            {x: 0, y: 6},
            {x: 1, y: 6},
            {x: 2, y: 6},
            {x: 3, y: 6},
            {x: 4, y: 6},
            {x: 5, y: 6},
            {x: 5, y: 5},
            {x: 5, y: 4},
            {x: 5, y: 3}
        ]);
    });

    describe('should work fast even with big map', () => {
        const width = 20;
        const height = 20;
        const map = new Array(height).join().split(',').map(line => {
            return new Array(width).join().split(',').map(Number);
        });
        const start = {x: 0, y: 0};
        const end = {x: width - 1, y: height - 1};
        const time = Date.now();
        const path = astar(start, end, map);
        const dt = Date.now() - time;
        it(dt + ' ms ', () => {
            expect(dt).to.below(10);
        });
    });
});
