export default class WelcomeScene extends Phaser.Scene {
  constructor() {
    super({ key: 'WelcomeScene' })
  }

  preload() {
		this.load.image('start-button', 'assets/img/start.png');
  }

  create() {
	  
		
		this.mm = this.add.sprite(240, 100, 'mm').setScale(3);
		this.mm.anims.play('running');
		
	  this.add.sprite(240,220, 'start-button');

	
	  this.add.image(240,220, 'start-button').setInteractive().on("pointerup", ()=>{
		  
		  this.scene.switch("MainScene");
		  
	  });

  }
}
