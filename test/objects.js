describe('objects', () => {
	var dir = __dirname + '/../public/src/objects';
	var objects = require(dir);
	var names = [];
	Object.keys(objects).forEach(key => {
		if (key === '__esModule') {
			return;
		}
		var item = objects[key];
		it(key, () => {
			item.should.have.property('name');
			item.should.have.property('width').be.an('number');
			item.should.have.property('height').be.an('number');
			item.should.have.property('textures').be.an('array');
			expect(names).to.not.include(item.name, `"${item.name}" is not unique`);
			names.push(item.name);
		});
	});


});
