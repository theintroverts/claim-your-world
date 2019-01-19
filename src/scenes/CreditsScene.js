import 'phaser';
 
export default class CreditsScene extends Phaser.Scene {
  constructor () {
    super('Credits');
  }
 
  preload () {
  }
 
  create () {
    const menuStyle = {
      fill: '#0f0',
      fontSize: '50px',
      align: 'center'
    };
    const btnStartGame = this.add.text(100, 170, 'Made by DerMaddin <3\nThank you for playing\nClick on text to return\nto Mainmenu', menuStyle);
    btnStartGame.setInteractive();
    btnStartGame.on('pointerdown', () => {
      this.scene.start('Menu');
    }, this);
  }
};
