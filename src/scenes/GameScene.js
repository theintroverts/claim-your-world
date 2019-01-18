import 'phaser';
 
export default class GameScene extends Phaser.Scene {
  constructor () {
    super('Game');
  }
 
  preload () {
    // load images
    this.load.image('logo', 'assets/logo.png');
    this.load.image('saw', 'assets/sprites/saw.png');
    this.load.image('blue', 'assets/particles/blue.png');
  }
 
  create () {
    this.add.image(400, 300, 'logo');
    this.matter.world.setBounds(0, 0, 800, 550);

    for (var i = 0; i < 256; i++)
    {
        var particle = this.matter.add.image(
            Phaser.Math.Between(0, 800),
            Phaser.Math.Between(0, 400),
            'blue', null,
            { shape: { type: 'polygon', radius: 18 }, ignorePointer: true }
        );

        particle.setScale(0.8);
        particle.setBlendMode('ADD');
        particle.setFriction(0.005);
        particle.setBounce(0.8);
        particle.setMass(1);
    }

    this.matter.add.image(400, 0, 'saw').setBounce(0.8).setMass(60);

    this.matter.add.mouseSpring();
  }
};
