export default class WelcomeScene extends Phaser.Scene {
  constructor() {
    super({ key: 'WelcomeScene' })
  }

  preload() {
		this.load.image('start-button', 'assets/img/start.png');
  }

  create() {
	  
		this.bg = this.add.image(0,0,'backround').setOrigin(0,0).setScrollFactor(0);
		this.hills3 = this.add.image(0,0,'hills3').setOrigin(0,0).setScrollFactor(0);
		this.hills2 = this.add.image(0,0,'hills2').setOrigin(0,0).setScrollFactor(0);
		this.hills1 = this.add.image(0,0,'hills1').setOrigin(0,0).setScrollFactor(0);
		
		this.mm = this.add.sprite(240, 100, 'mm').setScale(3);
		this.mm.anims.play('running');
		
	  this.add.sprite(240,220, 'start-button');

	
	  this.add.image(240,220, 'start-button').setInteractive().on("pointerup", ()=>{
		  
		  this.scene.switch("MainScene");
		  
	  });

  }
}
