import PhaserLogo from '../objects/phaserLogo'
import FpsText from '../objects/fpsText'

export default class MainScene extends Phaser.Scene {
  fpsText

  constructor() {
    super({ key: 'MainScene' })
  }
  
  preload() {
	  
    this.load.tilemapTiledJSON('stage', '../../assets/map/level2.json');
    this.load.image('stage_image', '../../assets/img/tileset_sample.png');
}

  create() {
	  
		var map = this.make.tilemap({ key: 'stage' });
		
		this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
		this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
		
		var tileset = map.addTilesetImage('tileset_sample', 'stage_image');
		var bgLayer = map.createDynamicLayer('background', tileset, 0, 0);
		this.groundLayer = map.createDynamicLayer('foreground', tileset, 0, 0);

		
		this.mm = this.add.sprite(0, 100, 'mm');
		
		this.mm.anims.play('idle');
		
		this.physics.add.existing(this.mm);
		
		this.mm.body.setCollideWorldBounds(true);
		this.mm.body.setSize(48, 32);
		this.mm.body.setOffset(0, 0);
		
		this.mm.state = { jumping: true };
		
        this.cursors = this.input.keyboard.createCursorKeys();
		this.fireKey = this.input.keyboard.addKey('F');  // Get key object
		
		this.cameras.main.startFollow(this.mm, true);
		this.groundLayer.setCollisionBetween(1,147);
		this.physics.add.collider(this.mm, this.groundLayer);
		
		this.groundLayer.setTileIndexCallback(17, this.checkCollision, this);
		this.groundLayer.setTileIndexCallback(18, this.checkCollision, this);
		this.groundLayer.setTileIndexCallback(19, this.checkCollision, this);

		// power ups
		this.mm.powerUp = {
			hasDoubleJump: true,
			hasSlide: true,
			hasDrill: true
		}
	
		this.showReadyText("Get ready...",
			()=>{ this.showReadyText("Go!"); });
  }
  
  showReadyText(text, cb){
	  
       var readyText = this.add.dynamicBitmapText(240, 150, 'ice', text, 32).setScrollFactor(0).setOrigin(.5,.5);
		
		this.tweens.add({
			
			targets: readyText,
			
			alpha: 0,
			
			duration: 0,
			
			delay: 50,
			
			hold: 50,
			
			loop: 10,
			
			yoyo: true,
			
			onComplete: ()=>{ readyText.destroy(); if(cb) cb(); }
		});
  }
  
  checkCollision(sprite, tile){
	
	if(this.fireKey.isDown){
		
		var newExplosion = this.add.sprite(-50, 0, 'explosion');
		newExplosion.on('animationcomplete', () => {
			newExplosion.destroy();
		});
		newExplosion.setPosition(tile.pixelX + 25, tile.pixelY);
		newExplosion.play('explosion')
		this.groundLayer.removeTileAt(tile.x, tile.y);
	
		
	}
    // Return true to exit processing collision of this tile vs the sprite - in this case, it
    // doesn't matter since the coin tiles are not set to collide.
    return false;
	
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
			this.mm.state.doubleJump = false;
			this.mm.state.doubleJumpReady = false;
		}
		
		
		if (this.cursors.down.isDown && !this.mm.state.jumping && this.mm.powerUp.hasSlide) {
			keyDown = true;
			this.setMMAnimation('duck');
			this.mm.body.setSize(48, 16);
			this.mm.body.setOffset(0, 16);
		} else {
			this.mm.body.setSize(48, 32);
			this.mm.body.setOffset(0, 0);
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
		  
			if (!this.cursors.up.isDown && this.mm.powerUp.hasDoubleJump) {
				this.mm.state.doubleJumpReady = true;
			}

			if (!this.mm.state.doubleJump && this.mm.state.doubleJumpReady && this.cursors.up.isDown && this.mm.state.jumping) {
				keyDown = true;
				this.mm.state.doubleJump = true;
				this.setMMAnimation('jump');
				this.mm.body.setVelocityY(-250);
			}
	  }
	  
  }
  
  setMMAnimation(anim){
	  
	  if(this.fireKey.isDown){
		  anim = anim + "-fire";
	  }
	  
	  if(this.mm.anims.currentAnim.key != anim){
		  
		  this.mm.anims.play(anim);
		  
	  }
	  
  }
}
