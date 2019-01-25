import 'phaser'

export default {
    type: Phaser.AUTO,
    parent: 'phaser-game',
    width: 800,
    height: 600,
    physics: {
        default: 'matter',
    },
}
