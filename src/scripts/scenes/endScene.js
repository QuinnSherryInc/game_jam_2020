export default class EndScene extends Phaser.Scene {
  constructor() {
    super({ key: 'EndScene' })
  }

  preload() {
		this.load.image('end', 'assets/img/end.png');
  }

  create() {
	  
		this.bg = this.add.image(0,0,'end').setOrigin(0,0).setScrollFactor(0);

  }
}
