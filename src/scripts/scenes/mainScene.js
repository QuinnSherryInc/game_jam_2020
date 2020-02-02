import PhaserLogo from '../objects/phaserLogo'
import FpsText from '../objects/fpsText'

export default class MainScene extends Phaser.Scene {
  fpsText

  constructor() {
    super({ key: 'MainScene' })
  }

  create(data) {
		
		data = data || {};
		this.level = data.level || 1;
		window.game.state.paused = false;
		
		var map = this.make.tilemap({ key: 'level' + this.level });
		
		this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
		this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
		
		var tileset = map.addTilesetImage('tileset_sample', 'stage_image');
		// bgLayer = map.createDynamicLayer('background', tileset, 0, 0);
		this.bg = this.add.image(0,0,'backround').setOrigin(0,0).setScrollFactor(0);
		this.hills3 = this.add.tileSprite(0, 0, 480, 320, 'hills3').setOrigin(0).setScrollFactor(0);
		this.hills2 = this.add.tileSprite(0, 0, 480, 320, 'hills2').setOrigin(0).setScrollFactor(0);
		this.hills1 = this.add.tileSprite(0, 0, 480, 320, 'hills1').setOrigin(0).setScrollFactor(0);
		this.clouds = this.add.tileSprite(0, 0, 480, 320, 'clouds').setOrigin(0).setScrollFactor(0);
		
		this.collisionSound = this.sound.add('collision');
		this.jumpSound = this.sound.add('jump');
		this.powerupSound = this.sound.add('power-up');
		this.explosionSound = this.sound.add('explosion')
		this.themeTune = this.sound.add('theme', { loop: true });
		this.themeTune.play();

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

			hasDoubleJump: false,
			hasSlide: false,
			hasDrill: false
		};
		
        this.cursors = this.input.keyboard.createCursorKeys();
		this.fireKey = this.input.keyboard.addKey('SPACE');  // Get key object
		
		this.cameras.main.startFollow(this.mm, true);
		this.groundLayer.setCollisionBetween(1,147);
		this.physics.add.collider(this.mm, this.groundLayer);
		//this.physics.add.overlap(this.mm, this.groundLayer);
		
		this.groundLayer.setTileIndexCallback([1,3,4,2,20], this.checkCollision, this);
		this.groundLayer.setTileIndexCallback([14,15,16], this.checkDrillingCollision, this);
		
		this.groundLayer.setTileIndexCallback(91, this.getSlidePowerUp, this);
		this.groundLayer.setTileIndexCallback(107, this.getSlidePowerUp, this);
		this.groundLayer.setTileIndexCallback(126, this.levelEnd, this);
		
		this.groundLayer.setTileIndexCallback(93, this.getDJPowerUp, this);
		this.groundLayer.setTileIndexCallback(109, this.getDJPowerUp, this);
		
		this.groundLayer.setTileIndexCallback(95, this.getDrillPowerUp, this);
		this.groundLayer.setTileIndexCallback(111, this.getDrillPowerUp, this);
		
		this.showReadyText("Level " + this.level,
			()=>{ this.showReadyText("Go!"); });
		
		//this.showDarkMode(true);
		
		this.emitter0 = this.add.particles('spark')
		.createEmitter({
			x: 0,
			y: 0, 
			speed: { min: -800, max: 800 },
			angle: { min: 0, max: 360 },
			scale: { start: 0.5, end: 0 },
			blendMode: 'SCREEN',
			//active: false,
			lifespan: 600,
			gravityY: 0,
			quantity: 20,
			active: false
		});
  }

  levelEnd (sprite, tile) {
	 
	if(!window.game.state.paused){
		
		window.game.state.paused = true;
		
		  if(this.game.state.level == 5){
			  
			  
				var transitionTexture = this.add.image(240, 160, "scene-transition")
					.setScrollFactor(0)
					.setOrigin(.5,.5)
					.setScale(0);
				this.tweens.add({
					
					targets: transitionTexture,
					
					scaleX: 15,
					scaleY: 15,
					angle: 1080,
					duration: 3000,
					delay: 2000,
					
					onComplete: ()=>{
						
						this.scene.switch("EndScene");
					}
				});
		  }
		  else if(this.game.state.level == 1){
			  
				if(!this.ak) {
					var meteor = this.add.image(this.mm.x + 200, this.mm.y - 300, 'meteorite').setScale(0.03);
					meteor.setAngle(150);
					this.tweens.add({
						targets: meteor,
						props: {
							x: this.mm.x + 15,
							y: this.mm.y - 10,
							scale: 0.3
						},
						duration: 2000,
						onComplete: () => {
							meteor.destroy();
							var newExplosion = this.add.sprite(this.mm.x, this.mm.y - 10, 'explosion');
							newExplosion.play('explosion-loop');
							
						}
					}, this);
					this.ak = true
				}
			
				this.showReadyText("Oh shit!");
				
				var transitionTexture = this.add.image(240, 160, "scene-transition")
					.setScrollFactor(0)
					.setOrigin(.5,.5)
					.setScale(0);
				this.tweens.add({
					
					targets: transitionTexture,
					
					scaleX: 15,
					scaleY: 15,
					angle: 1080,
					duration: 3000,
					delay: 2000,
					
					onComplete: ()=>{
						
						window.game.state.level++;
						this.scene.restart({ level: window.game.state.level });
					}
				});
			
			  
		  } else {
		
				this.showReadyText("Great job!");
			
				var transitionTexture = this.add.image(240, 160, "scene-transition")
					.setScrollFactor(0)
					.setOrigin(.5,.5)
					.setScale(0);
				
				this.tweens.add({
					
					targets: transitionTexture,
					
					scaleX: 15,
					scaleY: 15,
					angle: 1080,
					duration: 3000,
					delay: 2000,
					
					onComplete: ()=>{
						window.game.state.level++;
						this.scene.restart({ level: window.game.state.level });
					}
				});
			  
		  }
	}
	
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
	  this.powerupSound.play();
	  this.mm.state.hasSlide = true;
	  
	  this.removeQuadTile(tile);
		
		this.emitter0.active = true;
		this.emitter0.setPosition(tile.pixelX, tile.pixelY);
        this.emitter0.explode();
	  
	this.showReadyText("Down key to slide!");
  }
  
  getDJPowerUp(sprite, tile){
	  this.powerupSound.play();
	  this.mm.state.hasDoubleJump = true;
	  
	  this.removeQuadTile(tile);
	  
		this.emitter0.active = true;
		this.emitter0.setPosition(tile.pixelX, tile.pixelY);
        this.emitter0.explode();
		
	this.showReadyText("Up key to double jump!");
  }
  
  getDrillPowerUp(sprite, tile){
	  this.powerupSound.play();
	  this.mm.state.hasDrill = true;
	  
	  this.removeQuadTile(tile);
	  
		this.emitter0.active = true;
		this.emitter0.setPosition(tile.pixelX, tile.pixelY);
        this.emitter0.explode();
		
	this.showReadyText("Space bar to drill");
  }
  
  removeQuadTile(tile){
	  
	this.groundLayer.removeTileAt(tile.x, tile.y);
	this.groundLayer.removeTileAt(tile.x+1, tile.y);
	this.groundLayer.removeTileAt(tile.x, tile.y+1);
	this.groundLayer.removeTileAt(tile.x+1, tile.y+1);
	this.groundLayer.removeTileAt(tile.x, tile.y-1);
	this.groundLayer.removeTileAt(tile.x+1, tile.y-1);
	  
  }
  checkDrillingCollision(sprite, tile){
	  
	if(this.mm.state.drilling){
		
		var newExplosion = this.add.sprite(-50, 0, 'explosion').setScale(0.5);
		var newExplosion2 = this.add.sprite(-50, 0, 'explosion').setScale(0.5);
		
		newExplosion.on('animationcomplete', () => { newExplosion.destroy(); });
		newExplosion2.on('animationcomplete', () => { newExplosion2.destroy(); });
		
		newExplosion.setPosition(this.mm.x + 45, this.mm.y);
		newExplosion2.setPosition(this.mm.x + 45, this.mm.y - 16);
		
		newExplosion.play('explosion');
		newExplosion2.play('explosion');
		this.explosionSound.play();
		this.mm.state.drilling = false;
		this.removeQuadTile(tile);
		
	} else {
		
		this.scene.restart();
		
	}
  }
  
  checkCollision(sprite, tile){
	  
	if(this.mm.getBounds().bottom > tile.pixelY){
		this.collisionSound.play();
		this.scene.restart();
		
	}
	
    // Return true to exit processing collision of this tile vs the sprite - in this case, it
    // doesn't matter since the coin tiles are not set to collide.
    return false;
	
  }
  
  update(time) {
	  
	  this.clouds.tilePositionX += 1;
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
			this.jumpSound.play();
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
				this.jumpSound.play();
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
		
		if(this.cursors.down.isDown && this.mm.state.hasSlide)
			anim = anim + '-duck';
		
		if(this.mm.anims.currentAnim.key != anim){
			
			this.mm.anims.play(anim);
			
		}
		
	}
}
