export default {
	name: 'Ice Tower',
	type: 'tower',
	textures: ['images/tower_3_1.png'],
	width: 32,
	height: 32,
	movementSpeed: 0,
	attackSpeed: 1,
	price: 30,
	range: 100,
	shot: {
		textures: ['images/shot_3_1.png'],
		name: 'Ice Tower Shot',
		damage: 5,
		homing: true,
		splash: 50,
		movementSpeed: 2,
		width: 20,
		height: 20,
		buff: {
			type: 'debuff',
			name: 'Ice Slow',
			duration: 2000,
			textures: ['images/ice_debuf.png'],
			effect(unit) {
				unit.movementSpeed *= 0.5;
			}
		},
		death: {
			width: 32,
			height: 32,
			movementSpeed: 0, // TODO remove
			corpse: 0,
			fastAnimation: true,
			textures: [
				'images/explosion_3_1.png',
				'images/explosion_3_2.png',
				'images/explosion_3_3.png'
			]
		}
	}
};
