import 'phaser';
 
export default class BootScene extends Phaser.Scene {
  constructor () {
    super('Boot');
  }
 
  /**
   * Preload some bigger assets here.
   */
  preload () {
    this.load.image('ggj-logo', 'assets/ggj-logo.png');
  }

  create () {
    // Background image
    const logo = this.add.image(400, 300, 'ggj-logo');
    logo.setScale(.5);
    this.time.delayedCall(3000, () => {this.scene.start('Menu');}, [], this);
  }
};
