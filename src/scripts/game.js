import 'phaser'
import '@babel/polyfill'

import MainScene from './scenes/mainScene'
import WelcomeScene from './scenes/welcomeScene'
import PreloadScene from './scenes/preloadScene'
import EndScene from './scenes/endScene'

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
  scene: [PreloadScene, WelcomeScene, MainScene, EndScene],
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
      gravity: { y: 1000 }
    }
  }
}

window.addEventListener('load', () => {
  window.game = new Phaser.Game(config);
  
  window.game.state = {
	  
	  paused: false,
	  level: 1
  };
})
