import Phaser from 'phaser';

export class MenuScene extends Phaser.Scene {
  private ground!: Phaser.GameObjects.TileSprite;
  private titleText!: Phaser.GameObjects.Text;
  private instructionsText!: Phaser.GameObjects.Text;
  private pepe!: Phaser.GameObjects.Sprite;
  private pepeAnimPoint = 0;
  
  constructor() {
    super('MenuScene');
  }
  
  create(): void {
    const { width, height } = this.scale;
    
    // Add background
    const bgImage = this.textures.get('background').getSourceImage();
    this.add.tileSprite(0, 0, width, height, 'background')
      .setOrigin(0, 0)
      .setScrollFactor(0);
    
    // Add "moving" ground
    this.ground = this.add.tileSprite(
      0, 
      height - 112, 
      width, 
      112, 
      'ground'
    ).setOrigin(0, 0);
    
    // Add Pepe in the center with fixed size 64x64 pixels
    this.pepe = this.add.sprite(width / 2, height / 2, 'pepe')
      .setDisplaySize(64, 64)
      .setOrigin(0.5, 0.5);
    
    // Enable smoothing for Pepe sprite
    (this.pepe.texture.source[0] as any).scaleMode = Phaser.ScaleModes.LINEAR;
    
    // Create a title text instead of image
    this.titleText = this.add.text(
      width / 2, 
      height / 4, 
      'FLAPPY PEPE', 
      {
        fontFamily: '"Press Start 2P"',
        fontSize: '32px',
        color: '#fff',
        stroke: '#000',
        strokeThickness: 6,
        shadow: { color: '#000', fill: true, offsetX: 2, offsetY: 2, blur: 4 }
      }
    ).setOrigin(0.5, 0.5);
    
    // Add game instructions
    this.instructionsText = this.add.text(
      width / 2,
      height / 2 - 80,
      'TAP TO JUMP',
      {
        fontFamily: '"Press Start 2P"',
        fontSize: '16px',
        color: '#fff',
        stroke: '#000',
        strokeThickness: 4
      }
    ).setOrigin(0.5, 0.5);
    
    // Display best score
    const highScore = (window as any).gameData?.highScore || 0;
    
    this.add.text(
      width / 2, 
      height - 50, 
      `HIGH SCORE: ${highScore}`, 
      {
        fontFamily: '"Press Start 2P"',
        fontSize: '16px',
        color: '#fff'
      }
    ).setOrigin(0.5, 0.5);
    
    // Add call to action
    this.add.text(
      width / 2,
      height / 2 + 80,
      'CLICK TO START',
      {
        fontFamily: '"Press Start 2P"',
        fontSize: '18px',
        color: '#fff',
        stroke: '#3a3',
        strokeThickness: 4
      }
    ).setOrigin(0.5, 0.5);
    
    // Handle click to transition to game
    this.input.on('pointerdown', () => {
      this.scene.start('GameScene');
    });
    
    // Create simple animation for Pepe
    this.time.addEvent({
      delay: 50,
      callback: this.animatePepe,
      callbackScope: this,
      loop: true
    });
  }
  
  update(): void {
    // Animate ground movement
    this.ground.tilePositionX += 1;
  }
  
  animatePepe(): void {
    // Simple animation making Pepe bounce up and down
    this.pepeAnimPoint += 1;
    const offset = Math.sin(this.pepeAnimPoint * 0.3) * 5;
    this.pepe.y = this.scale.height / 2 + offset;
  }
} 