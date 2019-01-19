import 'phaser';
 
export default class GameScene extends Phaser.Scene {
  constructor () {
    super('Game');
  }

  init() {
    this.timeLeft = this.registry.get('GameDuration');
  }
 
  /**
   * Preload images.
   */
  preload () {
    // load images
    this.load.image('saw', 'assets/sprites/saw.png');
    this.load.image('blue', 'assets/particles/blue.png');
  }
 
  /**
   * Create game start.
   */
  create () {
    // Background image
    const logo = this.add.image(400, 300, 'ggj-logo');
    logo.setScale(.5);

    // Add time left text
    const menuStyle = {
      fill: '#02c6c9',
      fontSize: '32px'
    };
    this.add.text(32, 32, 'Time left:', menuStyle);
    this.textTimeLeft = this.add.text(200, 32, this.timeLeft, menuStyle);

    // Use physics
    this.matter.world.setBounds(0, 0, 800, 600);

    // Create particles and affect them by physics engine
    for (var i = 0; i < 200; i++)
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

    // Add saw and make it dragable by the mouse
    this.matter.add.image(400, 0, 'saw').setBounce(0.8).setMass(60);
    this.matter.add.mouseSpring();
  }

  /**
   * Update left game duration each tick and end game after time ends.
   *
   * @param {float} time Total game time in microseconds.
   * @param {float} delta Delta time in microseconds.
   */
  update (time, delta)
  {
      this.timeLeft = this.timeLeft - (delta / 1000);

      if (this.timeLeft < 0) {
        this.scene.start('Credits');
      }

      this.textTimeLeft.setText(Math.ceil(this.timeLeft));
  }
};
