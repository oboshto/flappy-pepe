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
    
    // Добавляем фон
    const bgImage = this.textures.get('background').getSourceImage();
    this.add.tileSprite(0, 0, width, height, 'background')
      .setOrigin(0, 0)
      .setScrollFactor(0);
    
    // Добавляем "движущуюся" землю
    this.ground = this.add.tileSprite(
      0, 
      height - 112, 
      width, 
      112, 
      'ground'
    ).setOrigin(0, 0);
    
    // Добавляем Пепе в центр с фиксированным размером 36x36 пикселей
    this.pepe = this.add.sprite(width / 2, height / 2, 'pepe')
      .setDisplaySize(64, 64)
      .setOrigin(0.5, 0.5);
    
    // Включаем сглаживание для спрайта Пепе
    (this.pepe.texture.source[0] as any).scaleMode = Phaser.ScaleModes.LINEAR;
    
    // Создаем текст заголовка вместо изображения
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
    
    // Добавляем инструкции по игре
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
    
    // Отображаем лучший результат
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
    
    // Добавляем призыв к действию
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
    
    // Обрабатываем клик для перехода к игре
    this.input.on('pointerdown', () => {
      this.scene.start('GameScene');
    });
    
    // Создаем простую анимацию для Пепе
    this.time.addEvent({
      delay: 50,
      callback: this.animatePepe,
      callbackScope: this,
      loop: true
    });
  }
  
  update(): void {
    // Анимируем движение земли
    this.ground.tilePositionX += 1;
  }
  
  animatePepe(): void {
    // Простая анимация, заставляющая Пепе колебаться вверх-вниз
    this.pepeAnimPoint += 1;
    const offset = Math.sin(this.pepeAnimPoint * 0.3) * 5;
    this.pepe.y = this.scale.height / 2 + offset;
  }
} 