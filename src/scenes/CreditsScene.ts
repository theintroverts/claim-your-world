import 'phaser'

export default class CreditsScene extends Phaser.Scene {
    constructor() {
        super('Credits')
    }

    public preload() {}

    /**
     * Dumps the credits.
     */
    public create() {
        const menuStyle = {
            fill: '#02c6c9',
            fontSize: '50px',
            align: 'center',
        }
        this.add.text(150, 140, 'Energy Level:', menuStyle)
        this.add.text(500, 140, String(this.registry.get('energyLevel')), menuStyle)
        const btnStartGame = this.add.text(
            100,
            270,
            'Thank you for playing\nClick on text to return\nto Mainmenu',
            menuStyle
        )
        btnStartGame.setInteractive()
        btnStartGame.on(
            'pointerdown',
            () => {
                this.scene.start('Menu')
            },
            this
        )
    }
}
