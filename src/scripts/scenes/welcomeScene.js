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

    this.add.text(100, 50, 'Game Controls', {
      fontSize: '16px',
      color: 'black',
      fontFamily: 'Courier'
    }).setOrigin(0.5, 0.5);

    var style = {
      fontSize: '10px',
      color: 'black',
      fontFamily: 'Courier'
    };
    this.add.text(30, 70, 'Jump: ', style).setOrigin(0, 0.5);
    this.add.image(100, 70, 'up-key').setOrigin(0, .5);

    this.add.text(30, 90, 'Slide: ', style).setOrigin(0, 0.5);
    this.add.image(100, 90, 'down-key').setOrigin(0, 0.5);

    this.add.text(30, 110, 'Drill: ', style).setOrigin(0, 0.5);
    this.add.image(100, 110, 'space-bar').setOrigin(0, 0.5);

    this.add.text(30, 130, 'Double Jump: ', style).setOrigin(0, 0.5);
    this.add.image(120, 130, 'up-key').setOrigin(0, 0.5);
    this.add.text(140, 130, '+', style).setOrigin(0, 0.5);
    this.add.image(150, 130, 'up-key').setOrigin(0, 0.5);
	
	  this.add.image(240,220, 'start-button').setInteractive().on("pointerup", ()=>{
		  
		  this.scene.switch("MainScene");
		  
	  });

  }
}
