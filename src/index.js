import Phaser from 'imports?exports=>undefined&this=>window!phaser';
import TowerDefense from './core/TowerDefense';

const game = new Phaser.Game(1408, 640, Phaser.AUTO);
game.state.add('Game', TowerDefense, true);
