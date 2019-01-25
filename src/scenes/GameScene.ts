import 'phaser';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super('Game');
    }

    public init() {
        this.energyLevel = 0;
    }

    /**
     * Preload images.
     */
    public preload() {
        this.load.image('dude', 'assets/sprites/dude.png');
    }

    /**
     * Create game start.
     */
    public create() {
        // Add time left text
        const menuStyle = {
            fill: '#02c6c9',
            fontSize: '32px',
        };

        this.add.text(350, 32, 'Energy Level:', menuStyle);
        this.textEnergyLevel = this.add.text(700, 32, String(this.energyLevel), menuStyle);

        this.buildings = this.physics.add.group({});
        this.buildings.add(this.add.rectangle(100, 100, 200, 400, 0xff0000));
        this.buildings.add(this.add.rectangle(500, 20, 400, 200, 0x00ff00));

        this.player = this.physics.add.sprite(100, 450, 'dude');
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);

        this.cursors = this.input.keyboard.createCursorKeys();

        this.physics.add.collider(this.player, this.buildings);
    }

    /**
     * Update left game duration each tick and end game after time ends.
     *
     * @param {float} time Total game time in microseconds.
     * @param {float} delta Delta time in microseconds.
     */
    public update(time: number, delta: number) {
        this.textEnergyLevel.setText(String(this.energyLevel));

        if (this.cursors.left!.isDown) {
            this.player.setVelocityX(-160);
        } else if (this.cursors.right!.isDown) {
            this.player.setVelocityX(160);
        } else {
            this.player.setVelocityX(0);
        }

        if (this.cursors.up!.isDown) {
            this.player.setVelocityY(-160);
        } else if (this.cursors.down!.isDown) {
            this.player.setVelocityY(160);
        } else {
            this.player.setVelocityY(0);
        }
    }

    private textEnergyLevel: Phaser.GameObjects.Text = undefined as any;
    private energyLevel: number = undefined as any;
    private cursors: Phaser.Input.Keyboard.CursorKeys = undefined as any;
    private player: Phaser.Physics.Arcade.Sprite = undefined as any;
    private buildings: Phaser.GameObjects.Group = undefined as any;
}
