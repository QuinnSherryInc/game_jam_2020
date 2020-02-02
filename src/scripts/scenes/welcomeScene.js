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
    
    this.add.image(240, 180, 'title-1');
    this.add.image(240, 180, 'title-rover')
    
	  this.add.sprite(240,220, 'start-button');

    this.add.text(400, 50 + 60, 'Game Controls', {
      fontSize: '16px',
      color: 'black',
      fontFamily: 'Courier'
    }).setOrigin(0.5, 0.5);

    var style = {
      fontSize: '10px',
      color: 'black',
      fontFamily: 'Courier'
    };
    this.add.text(330, 130, 'Jump: ', style).setOrigin(0, 0.5);
    this.add.image(400, 130, 'up-key').setOrigin(0, .5);

    this.add.text(330, 150, 'Slide: ', style).setOrigin(0, 0.5);
    this.add.image(400, 150, 'down-key').setOrigin(0, 0.5);

    this.add.text(330, 170, 'Drill: ', style).setOrigin(0, 0.5);
    this.add.image(400, 170, 'space-bar').setOrigin(0, 0.5);

    this.add.text(330, 190, 'Double Jump: ', style).setOrigin(0, 0.5);
    this.add.image(420, 190, 'up-key').setOrigin(0, 0.5);
    this.add.text(440, 190, '+', style).setOrigin(0, 0.5);
    this.add.image(450, 190, 'up-key').setOrigin(0, 0.5);
	
	  this.add.image(240,220, 'start-button').setInteractive().on("pointerup", ()=>{
		  
		  this.scene.switch("MainScene");
		  
	  });

  }
}
