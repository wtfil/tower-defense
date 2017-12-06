export default {
	name: 'Cannon Tower',
	type: 'tower',
	//textures: ['images/tower_2_1.png'],
	sprite: 'kenney-images/1x/towerDefense_tile227.png',
	width: 64,
	height: 64,
	movementSpeed: 0,
	attackSpeed: 0.3,
	price: 60,
	range: 250,
	shot: {
		//textures: ['images/shot_2.png'],
		sprite: 'kenney-images/1x/towerDefense_tile252.png',
		name: 'Cannon Tower Shot',
		damage: 30,
		homing: false,
		splash: 30,
		movementSpeed: 1.5,
		width: 64,
		height: 64,
		death: {
			width: 18,
			height: 18,
			movementSpeed: 0, // TODO remove
			corpse: 0,
			fastAnimation: true,
			textures: [
				'images/explosion_2_1.png',
				'images/explosion_2_2.png',
				'images/explosion_2_3.png'
			]
		}
	}
};
