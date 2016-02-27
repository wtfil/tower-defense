import TowerDefense from './core/TowerDefense';

const game = new Phaser.Game(704, 320, Phaser.AUTO);
game.state.add('Game', TowerDefense, true);
