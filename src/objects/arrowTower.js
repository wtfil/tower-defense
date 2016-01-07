export default {
	name: 'Arrow Tower',
	type: 'tower',
	textures: ['images/tower_1_2.png'],
	width: 32,
	height: 32,
	movementSpeed: 0,
	attackSpeed: 2,
	range: 250,
	shot: {
		textures: ['images/shot_1.png'],
		damage: 10,
		homing: true,
		movementSpeed: 4,
		width: 10,
		height: 10
	}
};
