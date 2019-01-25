import 'phaser'
import config from './config/config'
import BootScene from './scenes/BootScene'
import CreditsScene from './scenes/CreditsScene'
import GameScene from './scenes/GameScene'
import MenuScene from './scenes/MenuScene'

declare global {
    interface Window {
        game: Game
    }
}

class Game extends Phaser.Game {
    constructor() {
        super(config)
        this.scene.add('Boot', BootScene)
        this.scene.add('Menu', MenuScene)
        this.scene.add('Credits', CreditsScene)
        this.scene.add('Game', GameScene)
        this.scene.start('Boot')
    }
}

window.game = new Game()
