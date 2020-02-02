import PhaserLogo from '../objects/phaserLogo'
import FpsText from '../objects/fpsText'

export default class MainScene extends Phaser.Scene {
  fpsText

  constructor() {
    super({ key: 'MainScene' })
  }
  
  preload() {
	  
    this.load.tilemapTiledJSON('stage', '../../assets/map/level1.json');
	this.load.image('stage_image', '../../assets/img/tileset_sample.png');
	
}

  create() {
	  
		var map = this.make.tilemap({ key: 'stage' });
		
		this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
		this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
		
		var tileset = map.addTilesetImage('tileset_sample', 'stage_image');
		// bgLayer = map.createDynamicLayer('background', tileset, 0, 0);
		this.bg = this.add.image(0,0,'backround').setOrigin(0,0).setScrollFactor(0);
		this.hills3 = this.add.tileSprite(0, 0, 480, 320, 'hills3').setOrigin(0).setScrollFactor(0);
		this.hills2 = this.add.tileSprite(0, 0, 480, 320, 'hills2').setOrigin(0).setScrollFactor(0);
		this.hills1 = this.add.tileSprite(0, 0, 480, 320, 'hills1').setOrigin(0).setScrollFactor(0);
		
		this.groundLayer = map.createDynamicLayer('foreground', tileset, 0, 0);

		
		this.mm = this.add.sprite(0, 100, 'mm');
		
		this.mm.anims.play('idle');
		
		this.physics.add.existing(this.mm);
		
		this.mm.body.setCollideWorldBounds(true);
		this.mm.body.setSize(48, 32);
		this.mm.body.setOffset(0, 0);
		
		this.mm.state = {
			jumping: true,
			drilling: false,
			canDrill: true,
			drillingST: -1,

			hasDoubleJump: true,
			hasSlide: true,
			hasDrill: true
		};
		
        this.cursors = this.input.keyboard.createCursorKeys();
		this.fireKey = this.input.keyboard.addKey('F');  // Get key object
		
		this.cameras.main.startFollow(this.mm, true);
		this.groundLayer.setCollisionBetween(1,147);
		this.physics.add.collider(this.mm, this.groundLayer);
		this.physics.add.overlap(this.mm, this.groundLayer);
		
		this.groundLayer.setTileIndexCallback([2,20], this.checkCollision, this);
		this.groundLayer.setTileIndexCallback(91, this.getSlidePowerUp, this);
		this.groundLayer.setTileIndexCallback(107, this.getSlidePowerUp, this);
		
		this.showReadyText("Get ready...",
			()=>{ this.showReadyText("Go!"); });
		
		//this.showDarkMode(true);
  }

  showDarkMode(show) {
	  if(show) {
		this.spotLight = this.make.sprite({
			x: this.mm.x, 
			y: this.mm.y,
			key: 'mask',
			add: false
		}).setScale(2);
		var bitmapMask = new Phaser.Display.Masks.BitmapMask(this, this.spotLight);
		this.cameras.main.setMask(bitmapMask);
		this.isDark = true;
	  }
	  else{
		  this.cameras.main.clearMask();
	  }
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
  
  getSlidePowerUp(sprite, tile){
	  
	  this.mm.state.hasSlide = true;
	  
	  this.removeQuadTile(tile);
	  
	this.showReadyText("Down key to slid!");
  }
  
  removeQuadTile(tile){
	  
	this.groundLayer.removeTileAt(tile.x, tile.y);
	this.groundLayer.removeTileAt(tile.x+1, tile.y);
	this.groundLayer.removeTileAt(tile.x, tile.y+1);
	this.groundLayer.removeTileAt(tile.x+1, tile.y+1);
	this.groundLayer.removeTileAt(tile.x, tile.y-1);
	this.groundLayer.removeTileAt(tile.x+1, tile.y-1);
	  
  }
  
  checkCollision(sprite, tile){
	  
	if(this.mm.state.drilling){
		
		var newExplosion = this.add.sprite(-50, 0, 'explosion').setScale(0.5);
		var newExplosion2 = this.add.sprite(-50, 0, 'explosion').setScale(0.5);
		
		newExplosion.on('animationcomplete', () => { newExplosion.destroy(); });
		newExplosion2.on('animationcomplete', () => { newExplosion2.destroy(); });
		
		newExplosion.setPosition(this.mm.x + 45, this.mm.y);
		newExplosion2.setPosition(this.mm.x + 45, this.mm.y - 16);
		
		newExplosion.play('explosion');
		newExplosion2.play('explosion');
		
		this.removeQuadTile(tile);
		
	} else {
		
		if(this.mm.getBounds().bottom > tile.pixelY){
			
			this.scene.restart();
			
		}
		
	}
	
	
    // Return true to exit processing collision of this tile vs the sprite - in this case, it
    // doesn't matter since the coin tiles are not set to collide.
    return false;
	
  }
  
  update(time) {
	  this.hills1.tilePositionX = this.cameras.main.scrollX/2;
	  this.hills2.tilePositionX = this.cameras.main.scrollX/4;
	  this.hills3.tilePositionX = this.cameras.main.scrollX/8;
	  
	  this.moving = true;
	  
	  if(time - this.mm.state.drillingST > 500 && this.mm.state.drilling){
		  
		  this.mm.state.drilling = false;
		  this.setMMAnimation('running');
		  
	  }
	  
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
		
		
		if (this.cursors.down.isDown && !this.mm.state.jumping && this.mm.state.hasSlide) {
			keyDown = true;
			this.mm.body.setSize(48, 16);
			this.mm.body.setOffset(0, 16);
		} else {
			this.mm.body.setSize(48, 32);
			this.mm.body.setOffset(0, 0);
		}

		if(this.fireKey.isDown){
			
			if(this.mm.state.hasDrill && this.mm.state.canDrill && !this.mm.state.drilling) {
				
				this.mm.state.drilling = true;
				this.mm.state.drillingST = time;
				this.mm.state.canDrill = false;
				
			}

		} else {
			
			this.mm.state.canDrill = true;
			
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
		  
			if (!this.cursors.up.isDown && this.mm.state.hasDoubleJump) {
				this.mm.state.doubleJumpReady = true;
			}

			if (!this.mm.state.doubleJump && this.mm.state.doubleJumpReady && this.cursors.up.isDown && this.mm.state.jumping) {
				keyDown = true;
				this.mm.state.doubleJump = true;
				this.setMMAnimation('jump');
				this.mm.body.setVelocityY(-250);
			}
	  }

	  if(this.isDark) {
		this.spotLight.x = this.mm.x - this.cameras.main.scrollX + this.mm.displayWidth;
		this.spotLight.y = this.mm.y;
	  }
	  
  }
  
	setMMAnimation(anim){
		if(this.mm.state.drilling)
			anim = anim + '-fire';
		
		if(this.cursors.down.isDown)
			anim = anim + '-duck';
		
		if(this.mm.anims.currentAnim.key != anim){
			
			this.mm.anims.play(anim);
			
		}
		
	}
}
