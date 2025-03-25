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
    
    // Добавляем фон
    this.add.tileSprite(0, 0, width, height, 'background')
      .setOrigin(0, 0)
      .setScrollFactor(0);
    
    // Добавляем землю
    this.add.tileSprite(0, height - 112, width, 112, 'ground')
      .setOrigin(0, 0);
    
    // Добавляем изображение Game Over
    this.add.image(width / 2, height / 3, 'gameover')
      .setScale(1.5)
      .setOrigin(0.5);
    
    // Получаем лучший результат
    const highScore = (window as any).gameData?.highScore || 0;
    
    // Добавляем тексты с результатами
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
    
    // Кнопка "Play Again"
    const playAgainButton = this.add
      .container(width / 2, height / 2 + 120)
      .setSize(240, 50)
      .setInteractive({ useHandCursor: true });
    
    // Создаем фон кнопки с градиентом
    const playBtnBg = this.add.graphics();
    playBtnBg.fillStyle(0x16a34a, 1); // Основной цвет - зеленый
    playBtnBg.fillRoundedRect(-120, -25, 240, 50, 12); // Скругленные углы
    
    // Добавляем эффект градиента сверху
    const playBtnHighlight = this.add.graphics();
    playBtnHighlight.fillStyle(0x22c55e, 1); // Светлее основного
    playBtnHighlight.fillRoundedRect(-120, -25, 240, 25, { tl: 12, tr: 12, bl: 0, br: 0 });
    
    // Тень для кнопки
    const playBtnShadow = this.add.graphics();
    playBtnShadow.fillStyle(0x065f46, 1); // Темнее основного
    playBtnShadow.fillRoundedRect(-117, -22, 234, 48, 10);
    
    // Текст кнопки
    const playText = this.add.text(0, 0, 'Play Again', {
      fontFamily: '"Press Start 2P"',
      fontSize: '20px',
      color: '#ffffff',
      align: 'center',
      stroke: '#065f46',
      strokeThickness: 2,
      shadow: { color: '#000', fill: true, offsetX: 1, offsetY: 1, blur: 2 }
    }).setOrigin(0.5);
    
    // Добавляем все элементы в контейнер кнопки
    playAgainButton.add([playBtnShadow, playBtnBg, playBtnHighlight, playText]);
    
    // Эффекты при наведении
    playAgainButton.on('pointerover', () => {
      playBtnBg.clear();
      playBtnHighlight.clear();
      
      playBtnBg.fillStyle(0x22c55e, 1); // Светлее при наведении
      playBtnBg.fillRoundedRect(-120, -25, 240, 50, 12);
      
      playBtnHighlight.fillStyle(0x4ade80, 1); // Еще светлее
      playBtnHighlight.fillRoundedRect(-120, -25, 240, 25, { tl: 12, tr: 12, bl: 0, br: 0 });
      
      // Анимация масштаба
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
      
      playBtnBg.fillStyle(0x16a34a, 1); // Возврат к основному цвету
      playBtnBg.fillRoundedRect(-120, -25, 240, 50, 12);
      
      playBtnHighlight.fillStyle(0x22c55e, 1); // Возврат к светлому оттенку
      playBtnHighlight.fillRoundedRect(-120, -25, 240, 25, { tl: 12, tr: 12, bl: 0, br: 0 });
      
      // Возврат к исходному масштабу
      this.tweens.add({
        targets: playAgainButton,
        scaleX: 1,
        scaleY: 1,
        duration: 100
      });
    });
    
    playAgainButton.on('pointerdown', () => {
      // Эффект нажатия
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
    
    // Кнопка "Share"
    const shareButton = this.add
      .container(width / 2, height / 2 + 190)
      .setSize(160, 50)
      .setInteractive({ useHandCursor: true });
    
    // Создаем фон кнопки Share с градиентом
    const shareBtnBg = this.add.graphics();
    shareBtnBg.fillStyle(0x3b82f6, 1); // Синий цвет для кнопки Share
    shareBtnBg.fillRoundedRect(-80, -25, 160, 50, 12);
    
    // Добавляем эффект градиента сверху
    const shareBtnHighlight = this.add.graphics();
    shareBtnHighlight.fillStyle(0x60a5fa, 1); // Светлее основного
    shareBtnHighlight.fillRoundedRect(-80, -25, 160, 25, { tl: 12, tr: 12, bl: 0, br: 0 });
    
    // Тень для кнопки Share
    const shareBtnShadow = this.add.graphics();
    shareBtnShadow.fillStyle(0x1e40af, 1); // Темнее основного
    shareBtnShadow.fillRoundedRect(-77, -22, 154, 48, 10);
    
    // Текст кнопки Share
    const shareText = this.add.text(0, 0, 'Share', {
      fontFamily: '"Press Start 2P"',
      fontSize: '20px',
      color: '#ffffff',
      align: 'center',
      stroke: '#1e40af',
      strokeThickness: 2,
      shadow: { color: '#000', fill: true, offsetX: 1, offsetY: 1, blur: 2 }
    }).setOrigin(0.5);
    
    // Добавляем все элементы в контейнер кнопки Share
    shareButton.add([shareBtnShadow, shareBtnBg, shareBtnHighlight, shareText]);
    
    // Эффекты при наведении для кнопки Share
    shareButton.on('pointerover', () => {
      shareBtnBg.clear();
      shareBtnHighlight.clear();
      
      shareBtnBg.fillStyle(0x60a5fa, 1); // Светлее при наведении
      shareBtnBg.fillRoundedRect(-80, -25, 160, 50, 12);
      
      shareBtnHighlight.fillStyle(0x93c5fd, 1); // Еще светлее
      shareBtnHighlight.fillRoundedRect(-80, -25, 160, 25, { tl: 12, tr: 12, bl: 0, br: 0 });
      
      // Анимация масштаба
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
      
      shareBtnBg.fillStyle(0x3b82f6, 1); // Возврат к основному цвету
      shareBtnBg.fillRoundedRect(-80, -25, 160, 50, 12);
      
      shareBtnHighlight.fillStyle(0x60a5fa, 1); // Возврат к светлому оттенку
      shareBtnHighlight.fillRoundedRect(-80, -25, 160, 25, { tl: 12, tr: 12, bl: 0, br: 0 });
      
      // Возврат к исходному масштабу
      this.tweens.add({
        targets: shareButton,
        scaleX: 1,
        scaleY: 1,
        duration: 100
      });
    });
    
    shareButton.on('pointerdown', () => {
      // Эффект нажатия
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

    // Обрабатываем нажатие на области Share в родительском компоненте
    const gameOverEvent = new CustomEvent('flappyPepeGameOver', {
      detail: { score: this.score }
    });
    window.dispatchEvent(gameOverEvent);
  }
} 