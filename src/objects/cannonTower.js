export default {
	name: 'Cannon Tower',
	type: 'tower',
	textures: ['images/tower_4/Tower_4.png'],
	width: 64,
	height: 64,
	movementSpeed: 0,
	attackSpeed: 0.3,
	price: 60,
	range: 250,
	shot: {
		name: 'Cannon Tower Shot',
		textures: ['images/tower_4/bullet1.png'],
		damage: 30,
		homing: false,
		splash: 30,
		movementSpeed: 1.5,
		width: 40,
		height: 40,
		death: {
			width: 18,
			height: 18,
			movementSpeed: 0, // TODO remove
			corpse: 0,
			fastAnimation: true,
			textures: ['images/tower_1/ParticleT1.png']
		}
	}
};
