export default {
	name: 'Ice Tower',
	type: 'tower',
	textures: ['images/tower_2/Tower_2.png'],
	width: 64,
	height: 64,
	movementSpeed: 0,
	attackSpeed: 1,
	price: 30,
	range: 100,
	shot: {
		textures: ['images/tower_2/Bullet.png'],
		name: 'Ice Tower Shot',
		damage: 5,
		homing: true,
		splash: 50,
		movementSpeed: 2,
		width: 64,
		height: 64,
		buff: {
			type: 'debuff',
			name: 'Ice Slow',
			duration: 2000,
			width: 32,
			height: 32,
			textures: ['images/tower_2/SpellFreeze_Active.png'],
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
			textures: ['images/tower_2/Particle.png']
		}
	}
};
