import PhaserLogo from '../objects/phaserLogo'
import FpsText from '../objects/fpsText'

export default class MainScene extends Phaser.Scene {
  fpsText

  constructor() {
    super({ key: 'MainScene' })
  }
  
  preload() {
	  
    this.load.image('ship', '../../assets/img/fmship.png');
    this.load.tilemapTiledJSON('stage', '../../assets/stage.json');
    this.load.image('stage_image', '../../assets/img/stage.png');
	this.load.spritesheet('mm', '../../assets/img/64012.png', { frameWidth: 32, frameHeight: 40, margin: 0, spacing: 1 });
	
}

  create() {
	  
		this.cameras.main.setBounds(0, 0, 1920, 320);
		this.physics.world.setBounds(0, 0, 1920, 320);
		
		var map = this.make.tilemap({ key: 'stage' });
		var tileset = map.addTilesetImage('0x72_16x16DungeonTileset.v1', 'stage_image');
		var bgLayer = map.createDynamicLayer('background', tileset, 0, 0);
		var groundLayer = map.createDynamicLayer('ground', tileset, 0, 0);

        this.anims.create({
			key: 'idle',
			frames: this.anims.generateFrameNumbers('mm', { start: 0, end: 0 }),
			frameRate: 10,
			repeat: -1
		});
		
        this.anims.create({
			key: 'idle-fire',
			frames: this.anims.generateFrameNumbers('mm', { start: 10, end: 10 }),
			frameRate: 15,
			repeat: -1
		});
		
        this.anims.create({
			key: 'jump',
			frames: this.anims.generateFrameNumbers('mm', { start: 1, end: 1 }),
			frameRate: 15,
			repeat: -1
		});
		
        this.anims.create({
			key: 'jump-fire',
			frames: this.anims.generateFrameNumbers('mm', { start: 11, end: 11 }),
			frameRate: 15,
			repeat: -1
		});
		
        this.anims.create({
			key: 'running',
			frames: this.anims.generateFrameNumbers('mm', { start: 3, end: 9 }),
			frameRate: 15,
			repeat: -1
		});
		
        this.anims.create({
			key: 'running-fire',
			frames: this.anims.generateFrameNumbers('mm', { start: 12, end: 19 }),
			frameRate: 15,
			repeat: -1
		});
		
        this.anims.create({
			key: 'duck',
			frames: this.anims.generateFrameNumbers('mm', { start: 40, end: 40 }),
			frameRate: 15,
			repeat: -1
		});
		
		this.mm = this.add.sprite(50, 500, 'mm');
		
		this.mm.anims.play('idle');
		
		this.physics.add.existing(this.mm);
		
		this.mm.body.setCollideWorldBounds(true);
		this.mm.body.setSize(14, 32);
		this.mm.body.setOffset(10, 9);
		
		this.mm.state = { jumping: true };
		
        this.cursors = this.input.keyboard.createCursorKeys();
		this.firKey = this.input.keyboard.addKey('F');  // Get key object
		
		this.cameras.main.startFollow(this.mm, true);
		  groundLayer.setCollisionBetween(1,147);
		  this.physics.add.collider(this.mm, groundLayer);
		  
  }

  update() {
	  
	  this.moving = true;
	  
	  if(this.mm.body.onFloor()){
		  
		var keyDown = false;
		/*if (this.cursors.left.isDown) {
			keyDown = true;
			this.mm.setFlipX(true);
			
			this.setMMAnimation('running');
			
			this.mm.body.setVelocityX(-150);
		}
		
		else*/ if (this.moving) {
			keyDown = true;
			this.mm.setFlipX(false);
			
			this.setMMAnimation('running');
			
			this.mm.body.setVelocityX(150);
		}
		  
		if (this.cursors.up.isDown && !this.mm.state.jumping) {
			keyDown = true;
			this.mm.state.jumping = true;
			this.setMMAnimation('jump');
			this.mm.body.setVelocityY(-350);
		}

		if (!this.cursors.up.isDown) {
			this.mm.state.jumping = false;
		}
		
		
		if (this.cursors.down.isDown && !this.mm.state.jumping) {
			keyDown = true;
			this.setMMAnimation('duck');
			this.mm.body.setSize(14, 16);
			this.mm.body.setOffset(10, 25);
		} else {
			this.mm.body.setSize(14, 32);
			this.mm.body.setOffset(10, 9);
		}
		
		if(!keyDown) {
			
			this.setMMAnimation('idle');
			
			this.mm.body.setVelocityX(0);
			
		}
		
	  } else {

		
		  
		 	 this.setMMAnimation('jump');
		  
			/*if (this.cursors.left.isDown) {
				this.mm.setFlipX(true);
				this.mm.body.setVelocityX(-150);
			}
			
			else*/ if (this.moving) {
				this.mm.setFlipX(false);
				this.mm.body.setVelocityX(150);
			} else {
				
				this.mm.body.setVelocityX(0);
				
			}
		  
			if (this.mm.state.doubleJump && this.cursors.up.isDown && this.mm.state.jumping) {
				
				keyDown = true;
				this.setMMAnimation('jump');
				this.mm.body.setVelocityY(-200);

			}
	  }
	  
  }
  
  setMMAnimation(anim){
	  
	  if(this.firKey.isDown){
		  anim = anim + "-fire";
	  }
	  
	  if(this.mm.anims.currentAnim.key != anim){
		  
		  this.mm.anims.play(anim);
		  
	  }
	  
  }
}
