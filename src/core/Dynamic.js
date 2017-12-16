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

		if (config.born) {
			this.game.add.audio(config.born.name).play();
		}
		if (this.config.death) {
		    this.events.onKilled.add(this.onKilled, this);
		}
	}
	onKilled() {
		return;
		const n = 2 + ~~(Math.random() * 5);
		const emitter = this.game.add.emitter(0, 0, 100);
		emitter.makeParticles(this.config.death.name);
		emitter.minParticleSpeed.setTo(-400, -400);
		emitter.maxParticleSpeed.setTo(400, 400);
		emitter.maxParticleScale = 0.3;
		emitter.minParticleScale = 0.3;
		emitter.gravity = 0;
		emitter.x = this.x;
		emitter.y = this.y;
		emitter.start(true, 200, null, n);
	}
}
