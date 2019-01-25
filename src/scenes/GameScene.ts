import 'phaser'

export default class GameScene extends Phaser.Scene {
    constructor() {
        super('Game')
    }


    public init() {
        this.energyLevel = 0
    }

    /**
     * Preload images.
     */
    public preload() {
        }

    /**
     * Create game start.
     */
    public create() {
        // Add time left text
        const menuStyle = {
            fill: '#02c6c9',
            fontSize: '32px',
        }

        this.add.text(350, 32, 'Energy Level:', menuStyle)
        this.textEnergyLevel = this.add.text(700, 32, String(this.energyLevel), menuStyle)

        // Use physics
        this.matter.world.setBounds(0, 0, 800, 600)

    }

    /**
     * Update left game duration each tick and end game after time ends.
     *
     * @param {float} time Total game time in microseconds.
     * @param {float} delta Delta time in microseconds.
     */
    public update(time: number, delta: number) {

        this.textEnergyLevel.setText(String(this.energyLevel))
    }

    private textEnergyLevel: Phaser.GameObjects.Text = undefined as any
    private energyLevel: number = undefined as any
}
