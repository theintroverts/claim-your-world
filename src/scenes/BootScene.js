import 'phaser';
 
export default class BootScene extends Phaser.Scene {
  constructor () {
    super('Boot');
  }
 
  preload () {
  }
   
  create () {
    this.scene.start('Menu');
  }
};
