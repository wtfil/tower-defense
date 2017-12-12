export default {
	name: 'Arrow Tower',
	type: 'tower',
	textures: ['images/tower_1/Tower_1.png'],
	width: 64,
	height: 64,
	movementSpeed: 0,
	attackSpeed: 5,
	price: 20,
	range: 250,
	shot: {
		name: 'Arrow Tower Ammo',
		born: {
			name: 'Arrow Shot',
			audio: ['audio/cannon_shoot.wav'],
		},
		textures: ['images/tower_1/BulletT1.png'],
		damage: 3,
		homing: true,
		movementSpeed: 3,
		width: 20,
		height: 20,
		death: {
			width: 16,
			height: 16,
			movementSpeed: 0, // TODO remove
			corpse: 0,
			fastAnimation: true,
			textures: ['images/tower_1/ParticleT1.png'],
		}
	}
};
