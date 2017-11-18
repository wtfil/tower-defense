describe('objects', () => {
	var dir = __dirname + '/../public/src/objects';
	var objects = require(dir);
	var names = [];
	Object.keys(objects).forEach(key => {
		if (key === '__esModule' || Array.isArray(objects[key])) {
			return;
		}
		var item = objects[key];

		describe(key, () => {
			it('mandatory props', () => {
				item.should.have.property('width').be.an('number');
				item.should.have.property('height').be.an('number');
				item.should.have.property('name');
				expect(names).to.not.include(item.name, `"${item.name}" is not unique`);
				names.push(item.name);
			});
			if (item.type === 'unit') {
				it('unit props', () => {
					item.should.have.property('movementSpeed').be.an('number');
					item.should.have.property('bounty').be.an('number');
					item.should.have.property('health').be.an('number');
				});
			}

		});

	});

});
