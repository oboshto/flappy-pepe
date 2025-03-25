import Phaser from 'phaser';
// Import assets
import backgroundImg from '../../assets/sprites/background-day.png';
import groundImg from '../../assets/sprites/base.png';
import pipeImg from '../../assets/sprites/pipe-green.png';
import pepeImg from '../../assets/pepe.png';
import gameoverImg from '../../assets/sprites/gameover.png';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload(): void {
    // Loading high-quality images
    this.load.image('background', backgroundImg);
    this.load.image('ground', groundImg);
    this.load.image('pipe', pipeImg);
    this.load.image('pepe', pepeImg);
    this.load.image('gameover', gameoverImg);
    // Remove message.png loading, as we use custom text
    
    // Display loading progress
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    
    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(width / 2 - 160, height / 2 - 25, 320, 50);
    
    const loadingText = this.make.text({
      x: width / 2,
      y: height / 2 - 50,
      text: 'Loading...',
      style: {
        font: '20px monospace',
        color: '#ffffff'
      }
    });
    loadingText.setOrigin(0.5, 0.5);
    
    this.load.on('progress', (value: number) => {
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      progressBar.fillRect(width / 2 - 150, height / 2 - 15, 300 * value, 30);
    });
    
    this.load.on('complete', () => {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
      
      this.scene.start('MenuScene');
    });
  }
} 