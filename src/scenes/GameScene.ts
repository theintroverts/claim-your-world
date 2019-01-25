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
        // load images
        this.load.image('saw', 'assets/sprites/saw.png')
        this.load.image('blue', 'assets/particles/blue.png')
    }

    /**
     * Create game start.
     */
    public create() {
        // Background image
        const logo = this.add.image(400, 300, 'ggj-logo')
        logo.setScale(0.5)

        // Add time left text
        const menuStyle = {
            fill: '#02c6c9',
            fontSize: '32px',
        }

        this.add.text(580, 32, 'Energy Level:', menuStyle)
        this.textEnergyLevel = this.add.text(700, 32, String(this.energyLevel), menuStyle)

        // Use physics
        this.matter.world.setBounds(0, 0, 800, 600)

        // Create particles and affect them by physics engine
        for (let i = 0; i < 200; i++) {
            const particle = this.matter.add.sprite(
                Phaser.Math.Between(0, 800),
                Phaser.Math.Between(400, 800),
                'blue',
                undefined,
                {
                    shape: { type: 'polygon', radius: 18 },
                    ignorePointer: true,
                    label: 'particle',
                }
            )

            particle.setScale(0.8)
            particle.setBlendMode('ADD')
            particle.setFriction(0.01)
            particle.setBounce(0.5)
            particle.setMass(5)
        }

        // Add saw and make it dragable by the mouse
        const saw = this.matter.add.sprite(400, 0, 'saw', undefined, {
            label: 'saw',
        })
        saw.setBounce(0)
        saw.setMass(20)
        saw.setScale(0.6)
        this.matter.add.mouseSpring({})

        // Collisiondetection between particles and saw to add points
        this.matter.world.on(
            'collisionend',
            function(this: GameScene, event: any) {
                for (const pair of event.pairs) {
                    const bodyA = pair.bodyA
                    const bodyB = pair.bodyB

                    if (
                        (bodyA.label === 'saw' && bodyB.label === 'particle') ||
                        (bodyB.label === 'saw' && bodyA.label === 'particle')
                    ) {
                        this.energyLevel++
                    }
                }
            },
            this
        )
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
