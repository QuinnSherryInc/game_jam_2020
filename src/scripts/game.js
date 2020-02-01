import 'phaser'
import '@babel/polyfill'

import MainScene from './scenes/mainScene'
import PreloadScene from './scenes/preloadScene'

const DEFAULT_WIDTH = 480
const DEFAULT_HEIGHT = 320

const config = {
  type: Phaser.AUTO,
  backgroundColor: '#00000',
  pixelArt: false,
  roundPixels: false,
  antialias: false,
  scale: {
    parent: 'phaser-game',
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT
  },
  scene: [PreloadScene, MainScene],
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
      gravity: { y: 1000 }
    }
  }
}

window.addEventListener('load', () => {
  const game = new Phaser.Game(config)
})
