import 'phaser'

export default class MenuScene extends Phaser.Scene {
    constructor() {
        super('Menu')
    }

    public preload() {}

    /**
     * Create main menu.
     */
    public create() {
        // GGJ logo
        const logo = this.add.image(170, 430, 'ggj-logo')
        logo.setScale(0.25)
        const menuStyle = {
            fill: '#02c6c9',
            fontSize: '64px',
        }
        const btnStartGame = this.add.text(200, 150, 'Start Game', menuStyle)
        btnStartGame.setInteractive()
        btnStartGame.on(
            'pointerdown',
            () => {
                this.scene.start('Game')
            },
            this
        )

        // Will be read in the GameScene
        // Starting point for creating an Options menu.
        this.registry.set('GameDuration', 20)
    }
}
