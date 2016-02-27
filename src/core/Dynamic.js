export default class Dynamic extends Phaser.Sprite {
	constructor(game, config, x, y) {
		super(game, x, y, config.name);
		this.config = config;
		this.width = config.width;
		this.height = config.height;

		this.game.physics.startSystem(Phaser.Physics.ARCADE);
		this.game.add.existing(this);
		this.animations.add('move');
		this.animations.play('move', 4, true);
		this.checkWorldBounds = true;
		this.outOfBoundsKill = true;
	}
}
