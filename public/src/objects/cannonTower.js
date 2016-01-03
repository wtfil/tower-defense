export default {
	name: 'Cannon Tower',
	type: 'tower',
	textures: ['images/tower_2_1.png'],
	width: 32,
	height: 32,
	movementSpeed: 0,
	attackSpeed: 1,
	range: 250,
	shot: {
		textures: ['images/shot_2.png'],
		damage: 30,
		homing: false,
		splash: 30,
		movementSpeed: 1.5,
		width: 10,
		height: 10
	}
};
