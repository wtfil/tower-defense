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
		damage: 1,
		homing: true,
		splash: 50,
		movementSpeed: 2,
		width: 20,
		height: 20,
		buff: {
			type: 'debuff',
			name: 'Ice slow',
			duration: 3000,
			progressColor: '#7BCDE8',
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
