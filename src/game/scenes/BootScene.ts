import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload(): void {
    // Загрузка изображений с высоким качеством
    this.load.image('background', '/src/assets/sprites/background-day.png');
    this.load.image('ground', '/src/assets/sprites/base.png');
    this.load.image('pipe', '/src/assets/sprites/pipe-green.png');
    this.load.image('pepe', '/src/assets/pepe.png');
    this.load.image('gameover', '/src/assets/sprites/gameover.png');
    // Удаляем загрузку message.png, так как используем собственный текст
    
    // Отображаем прогресс загрузки
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