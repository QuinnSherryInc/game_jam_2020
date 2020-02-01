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
	this.originalTime = new Date();
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
		
		this.mm.state = {
			jumping: true,

			hasDoubleJump: false,
			hasSlide: false,
			hasDrill: true,
			hasTorch: false
		};
		
        this.cursors = this.input.keyboard.createCursorKeys();
		this.fireKey = this.input.keyboard.addKey('F');  // Get key object
		
		this.cameras.main.startFollow(this.mm, true);
		this.groundLayer.setCollisionBetween(1,147);
		this.physics.add.collider(this.mm, this.groundLayer);
		
		this.groundLayer.setTileIndexCallback(9, this.checkCollision, this);
		this.groundLayer.setTileIndexCallback(91, this.getSlidePowerUp, this);
		this.groundLayer.setTileIndexCallback(107, this.getSlidePowerUp, this);
	
		this.showReadyText("Get ready...",
			()=>{ this.showReadyText("Go!"); });

		this.showDarkMode(true);
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
	  
  }
  
  removeQuadTile(tile){
	  
	this.groundLayer.removeTileAt(tile.x, tile.y);
	this.groundLayer.removeTileAt(tile.x+1, tile.y);
	this.groundLayer.removeTileAt(tile.x, tile.y+1);
	this.groundLayer.removeTileAt(tile.x+1, tile.y+1);
	this.groundLayer.removeTileAt(tile.x, tile.y-1);
	this.groundLayer.removeTileAt(tile.x+1, tile.y-1);
	  
  }

  removeDrilledTiles(tile) {
	this.groundLayer.removeTileAt(tile.x, tile.y);
	this.groundLayer.removeTileAt(tile.x, tile.y+1);
  }
  
  checkCollision(sprite, tile){

	if(this.fireKey.isDown && this.mm.state.hasDrill){

		this.removeDrilledTiles(tile);
		
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
		
		
		if (this.cursors.down.isDown && !this.mm.state.jumping && this.mm.state.hasSlide) {
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

		if(this.fireKey.isDown){
			
			if(this.mm.state.hasDrill) {
				var newExplosion = this.add.sprite(-50, 0, 'explosion').setScale(0.5);
				newExplosion.on('animationcomplete', () => {
					newExplosion.destroy();
				});
				newExplosion.setPosition(this.mm.x + 25, this.mm.y);
				newExplosion.play('explosion');
			}

			this.fired();

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
		
		if(this.fireKey.isDown){
			anim = anim + "-fire";
		}
		
		if(this.mm.anims.currentAnim.key != anim){
			
			this.mm.anims.play(anim);
			
		}
		
	}

	fired() {

		var newTime = new Date();

		if(newTime > this.originalTime) {

			var timeDifference  = newTime - this.originalTime;

			if((timeDifference/1000) > 1) {
				this.mm.state.hasDrill = true;
				this.originalTime = newTime;
			} else {
				this.mm.state.hasDrill = false;
			}

		}
	}
}
