export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' })
  }

  preload() {
    this.load.spritesheet('explosion', 'assets/img/Explosion.png', { frameWidth: 96, frameHeight: 96});
    this.load.bitmapFont('ice', 'assets/font/iceicebaby.png', 'assets/font/iceicebaby.xml');
	this.load.spritesheet('mm', 'assets/img/rover.png', { frameWidth: 48, frameHeight: 32, margin: 0, spacing: 0 });
  }

  create() {
        this.anims.create({
			key: 'idle',
			frames: this.anims.generateFrameNumbers('mm', { start: 0, end: 0 }),
			frameRate: 10,
			repeat: -1
		});
		
        this.anims.create({
			key: 'idle-fire',
			frames: this.anims.generateFrameNumbers('mm', { start: 0, end: 0 }),
			frameRate: 15,
			repeat: -1
		});
		
        this.anims.create({
			key: 'jump',
			frames: this.anims.generateFrameNumbers('mm', { start: 2, end: 2 }),
			frameRate: 15,
			repeat: -1
		});
		
        this.anims.create({
			key: 'jump-fire',
			frames: this.anims.generateFrameNumbers('mm', { start: 2, end: 2 }),
			frameRate: 15,
			repeat: -1
		});
		
        this.anims.create({
			key: 'running',
			frames: this.anims.generateFrameNumbers('mm', { start: 0, end: 1 }),
			frameRate: 15,
			repeat: -1
		});
		
        this.anims.create({
			key: 'running-fire',
			frames: this.anims.generateFrameNumbers('mm', { start: 0, end: 1 }),
			frameRate: 15,
			repeat: -1
		});
		
        this.anims.create({
			key: 'duck',
			frames: this.anims.generateFrameNumbers('mm', { start: 4, end: 5 }),
			frameRate: 15,
			repeat: -1
		});

		this.anims.create({
			key: 'explosion',
			frames: this.anims.generateFrameNumbers('explosion', {start: 0, end: 10}),
			frameRate: 10
		});
    this.scene.start('WelcomeScene')

  }
}
