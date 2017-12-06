export default {
	name: 'Arrow Tower',
	type: 'tower',
	//textures: ['images/tower_1_2.png'],
	sprite: 'kenney-images/1x/towerDefense_tile203.png',
	width: 64,
	height: 64,
	movementSpeed: 0,
	attackSpeed: 5,
	price: 20,
	range: 250,
	shot: {
		name: 'Arrow Tower Ammo',
		//textures: ['images/shot_1.png'],
		sprite: 'kenney-images/1x/towerDefense_tile272.png',
		damage: 3,
		homing: true,
		movementSpeed: 3,
		width: 64,
		height: 64,
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
