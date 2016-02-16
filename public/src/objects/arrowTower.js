export default {
	name: 'Arrow Tower',
	type: 'tower',
	textures: ['images/tower_1_2.png'],
	width: 32,
	height: 32,
	movementSpeed: 0,
	attackSpeed: 5,
	price: 20,
	range: 250,
	shot: {
		name: 'Arrow Tower Ammo',
		textures: ['images/shot_1.png'],
		damage: 1,
		homing: true,
		movementSpeed: 3,
		width: 10,
		height: 10,
		death: {
			width: 16,
			height: 16,
			movementSpeed: 0, // TODO remove
			corpse: 0,
			fastAnimation: true,
			textures: [
				'images/explosion_1_1.png',
				'images/explosion_1_2.png',
				'images/explosion_1_3.png'
			]
		}
	}
};
