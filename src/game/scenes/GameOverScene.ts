import Phaser from 'phaser';

export class GameOverScene extends Phaser.Scene {
  private score = 0;
  
  constructor() {
    super('GameOverScene');
  }
  
  init(data: { score: number }): void {
    this.score = data.score;
  }
  
  create(): void {
    const { width, height } = this.scale;
    
    // Add background
    this.add.tileSprite(0, 0, width, height, 'background')
      .setOrigin(0, 0)
      .setScrollFactor(0);
    
    // Add ground
    this.add.tileSprite(0, height - 112, width, 112, 'ground')
      .setOrigin(0, 0);
    
    // Add Game Over image
    this.add.image(width / 2, height / 3, 'gameover')
      .setScale(1.5)
      .setOrigin(0.5);
    
    // Get best score
    const highScore = (window as any).gameData?.highScore || 0;
    
    // Add score texts
    this.add.text(
      width / 2, 
      height / 2, 
      `Score: ${this.score}`, 
      {
        fontFamily: '"Press Start 2P"',
        fontSize: '28px',
        color: '#fff',
        stroke: '#000',
        strokeThickness: 6,
        shadow: { color: '#000', fill: true, offsetX: 2, offsetY: 2, blur: 8 }
      }
    ).setOrigin(0.5);
    
    this.add.text(
      width / 2, 
      height / 2 + 50, 
      `Best: ${highScore}`, 
      {
        fontFamily: '"Press Start 2P"',
        fontSize: '18px',
        color: '#fff',
        stroke: '#000',
        strokeThickness: 3,
        shadow: { color: '#000', fill: true, offsetX: 1, offsetY: 1, blur: 4 }
      }
    ).setOrigin(0.5);
    
    // "Play Again" button
    const playAgainButton = this.add
      .container(width / 2, height / 2 + 120)
      .setSize(240, 50)
      .setInteractive({ useHandCursor: true });
    
    // Create background gradient for button
    const playBtnBg = this.add.graphics();
    playBtnBg.fillStyle(0x16a34a, 1); // Main color - green
    playBtnBg.fillRoundedRect(-120, -25, 240, 50, 12); // Rounded corners
    
    // Add gradient effect on top
    const playBtnHighlight = this.add.graphics();
    playBtnHighlight.fillStyle(0x22c55e, 1); // Lighter than main
    playBtnHighlight.fillRoundedRect(-120, -25, 240, 25, { tl: 12, tr: 12, bl: 0, br: 0 });
    
    // Shadow for the button
    const playBtnShadow = this.add.graphics();
    playBtnShadow.fillStyle(0x065f46, 1); // Darker than main
    playBtnShadow.fillRoundedRect(-117, -22, 234, 48, 10);
    
    // Text for button
    const playText = this.add.text(0, 0, 'Play Again', {
      fontFamily: '"Press Start 2P"',
      fontSize: '20px',
      color: '#ffffff',
      align: 'center',
      stroke: '#065f46',
      strokeThickness: 2,
      shadow: { color: '#000', fill: true, offsetX: 1, offsetY: 1, blur: 2 }
    }).setOrigin(0.5);
    
    // Add all elements to button container
    playAgainButton.add([playBtnShadow, playBtnBg, playBtnHighlight, playText]);
    
    // Effects on hover
    playAgainButton.on('pointerover', () => {
      playBtnBg.clear();
      playBtnHighlight.clear();
      
      playBtnBg.fillStyle(0x22c55e, 1); // Lighter on hover
      playBtnBg.fillRoundedRect(-120, -25, 240, 50, 12);
      
      playBtnHighlight.fillStyle(0x4ade80, 1); // Even lighter
      playBtnHighlight.fillRoundedRect(-120, -25, 240, 25, { tl: 12, tr: 12, bl: 0, br: 0 });
      
      // Scale animation
      this.tweens.add({
        targets: playAgainButton,
        scaleX: 1.05,
        scaleY: 1.05,
        duration: 100
      });
    });
    
    playAgainButton.on('pointerout', () => {
      playBtnBg.clear();
      playBtnHighlight.clear();
      
      playBtnBg.fillStyle(0x16a34a, 1); // Return to main color
      playBtnBg.fillRoundedRect(-120, -25, 240, 50, 12);
      
      playBtnHighlight.fillStyle(0x22c55e, 1); // Return to lighter tone
      playBtnHighlight.fillRoundedRect(-120, -25, 240, 25, { tl: 12, tr: 12, bl: 0, br: 0 });
      
      // Return to original scale
      this.tweens.add({
        targets: playAgainButton,
        scaleX: 1,
        scaleY: 1,
        duration: 100
      });
    });
    
    playAgainButton.on('pointerdown', () => {
      // Click effect
      this.tweens.add({
        targets: playAgainButton,
        scaleX: 0.95,
        scaleY: 0.95,
        duration: 50,
        yoyo: true,
        onComplete: () => {
          this.scene.start('GameScene');
        }
      });
    });
    
    // "Share" button
    const shareButton = this.add
      .container(width / 2, height / 2 + 190)
      .setSize(160, 50)
      .setInteractive({ useHandCursor: true });
    
    // Create background for Share button with gradient
    const shareBtnBg = this.add.graphics();
    shareBtnBg.fillStyle(0x3b82f6, 1); // Blue color for Share button
    shareBtnBg.fillRoundedRect(-80, -25, 160, 50, 12);
    
    // Add gradient effect on top
    const shareBtnHighlight = this.add.graphics();
    shareBtnHighlight.fillStyle(0x60a5fa, 1); // Lighter than main
    shareBtnHighlight.fillRoundedRect(-80, -25, 160, 25, { tl: 12, tr: 12, bl: 0, br: 0 });
    
    // Shadow for Share button
    const shareBtnShadow = this.add.graphics();
    shareBtnShadow.fillStyle(0x1e40af, 1); // Darker than main
    shareBtnShadow.fillRoundedRect(-77, -22, 154, 48, 10);
    
    // Text for Share button
    const shareText = this.add.text(0, 0, 'Share', {
      fontFamily: '"Press Start 2P"',
      fontSize: '20px',
      color: '#ffffff',
      align: 'center',
      stroke: '#1e40af',
      strokeThickness: 2,
      shadow: { color: '#000', fill: true, offsetX: 1, offsetY: 1, blur: 2 }
    }).setOrigin(0.5);
    
    // Add all elements to Share button container
    shareButton.add([shareBtnShadow, shareBtnBg, shareBtnHighlight, shareText]);
    
    // Effects on hover for Share button
    shareButton.on('pointerover', () => {
      shareBtnBg.clear();
      shareBtnHighlight.clear();
      
      shareBtnBg.fillStyle(0x60a5fa, 1); // Lighter on hover
      shareBtnBg.fillRoundedRect(-80, -25, 160, 50, 12);
      
      shareBtnHighlight.fillStyle(0x93c5fd, 1); // Even lighter
      shareBtnHighlight.fillRoundedRect(-80, -25, 160, 25, { tl: 12, tr: 12, bl: 0, br: 0 });
      
      // Scale animation
      this.tweens.add({
        targets: shareButton,
        scaleX: 1.05,
        scaleY: 1.05,
        duration: 100
      });
    });
    
    shareButton.on('pointerout', () => {
      shareBtnBg.clear();
      shareBtnHighlight.clear();
      
      shareBtnBg.fillStyle(0x3b82f6, 1); // Return to main color
      shareBtnBg.fillRoundedRect(-80, -25, 160, 50, 12);
      
      shareBtnHighlight.fillStyle(0x60a5fa, 1); // Return to lighter tone
      shareBtnHighlight.fillRoundedRect(-80, -25, 160, 25, { tl: 12, tr: 12, bl: 0, br: 0 });
      
      // Return to original scale
      this.tweens.add({
        targets: shareButton,
        scaleX: 1,
        scaleY: 1,
        duration: 100
      });
    });
    
    shareButton.on('pointerdown', () => {
      // Click effect
      this.tweens.add({
        targets: shareButton,
        scaleX: 0.95,
        scaleY: 0.95,
        duration: 50,
        yoyo: true,
        onComplete: () => {
          const shareEvent = new CustomEvent('flappyPepeShare', {
            detail: { score: this.score }
          });
          window.dispatchEvent(shareEvent);
        }
      });
    });

    // Process click on Share area in parent component
    const gameOverEvent = new CustomEvent('flappyPepeGameOver', {
      detail: { score: this.score }
    });
    window.dispatchEvent(gameOverEvent);
  }
} 