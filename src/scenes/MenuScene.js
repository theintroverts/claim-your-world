import 'phaser';

export default class MenuScene extends Phaser.Scene {
  constructor() {
    super('Menu');
  }

  preload() {
  }

  create() {
    const menuStyle = {
      fill: '#0f0',
      fontSize: '64px'
    };
    const btnStartGame = this.add.text(200, 100, 'Start Game', menuStyle);
    const btnOptions = this.add.text(200, 200, 'Options', menuStyle);
    btnStartGame.setInteractive();
    btnStartGame.on('pointerdown', () => {
      this.scene.start('Game');
    }, this);
  }

};
