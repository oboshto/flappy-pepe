import Phaser from 'phaser';

interface Pipe {
  top: Phaser.Physics.Arcade.Sprite;
  bottom: Phaser.Physics.Arcade.Sprite;
  scored: boolean;
}

export class GameScene extends Phaser.Scene {
  private pepe!: Phaser.Physics.Arcade.Sprite;
  private ground!: Phaser.GameObjects.TileSprite;
  private pipes: Pipe[] = [];
  private pipeGroup!: Phaser.Physics.Arcade.Group;
  private pipeInterval = 1500;
  private nextPipeTime = 0;
  private score = 0;
  private scoreText!: Phaser.GameObjects.Text;
  private isGameOver = false;
  private groundHeight = 112;
  private floorCollider!: Phaser.Physics.Arcade.Collider;
  
  // Константы игры
  private readonly JUMP_VELOCITY = -350;
  private readonly PIPE_SPEED = 200;
  private readonly PIPE_SPACING = 120;
  
  constructor() {
    super('GameScene');
  }
  
  create(): void {
    const { width, height } = this.scale;
    
    // Сбросить состояние игры
    this.score = 0;
    this.pipes = [];
    this.isGameOver = false;
    
    // Включаем физику
    this.physics.world.setBounds(0, 0, width, height);
    
    // Добавляем фон - настраиваем его на всю высоту экрана
    this.add.tileSprite(0, 0, width, height, 'background')
      .setOrigin(0, 0)
      .setScrollFactor(0);
    
    // Создаем группу для труб
    this.pipeGroup = this.physics.add.group();
    
    // Добавляем "движущуюся" землю
    this.ground = this.add.tileSprite(
      0, 
      height - this.groundHeight, 
      width, 
      this.groundHeight, 
      'ground'
    ).setOrigin(0, 0);
    
    // Добавляем статическое тело для земли - создаем невидимый прямоугольник
    const groundBody = this.physics.add.staticGroup();
    const floor = groundBody.create(
      width / 2, 
      height - this.groundHeight/2, 
      'ground'
    ) as Phaser.Physics.Arcade.Sprite;
    
    // Настраиваем размер и видимость пола
    floor.setVisible(false)
      .setDisplaySize(width, this.groundHeight)
      .refreshBody();
    
    this.pepe = this.physics.add.sprite(80, height / 2, 'pepe')
      .setDisplaySize(62, 64)
      .setOrigin(0.5, 0.5)
      .setBounce(0.1)
      .setCollideWorldBounds(false)
      .setGravityY(1000);
    
    this.pepe.setSize(145, 155);
    if (this.pepe.body) {
      this.pepe.body.setOffset(10, 10);
    }
    
    // Включаем сглаживание для спрайта
    this.pepe.setTexture('pepe');
    (this.pepe.texture.source[0] as any).scaleMode = Phaser.ScaleModes.LINEAR;
    
    // Добавляем счет
    this.scoreText = this.add.text(width / 2, 50, 'Score: 0', {
      fontFamily: '"Press Start 2P"',
      fontSize: '24px',
      color: '#fff',
      stroke: '#000',
      strokeThickness: 5,
      shadow: { color: '#000', fill: true, offsetX: 2, offsetY: 2, blur: 4 }
    }).setOrigin(0.5);
    
    // Обработка прыжка при нажатии
    this.input.on('pointerdown', this.jump, this);
    
    // Добавляем обработчик клавиши пробел
    this.input.keyboard?.on('keydown-SPACE', this.jump, this);
    
    // Проверка столкновений c землей
    this.floorCollider = this.physics.add.collider(this.pepe, floor, this.gameOver, undefined, this);
    
    // Проверка столкновений с трубами
    this.physics.add.collider(this.pepe, this.pipeGroup, this.gameOver, undefined, this);
    
    // Инициализируем время для первой трубы
    this.nextPipeTime = this.time.now + this.pipeInterval;
  }
  
  update(time: number): void {
    if (this.isGameOver) return;
    
    // Анимируем движение земли
    this.ground.tilePositionX += 2;
    
    // Вращаем Пепе в зависимости от скорости падения
    if (this.pepe.body) {
      this.pepe.rotation = Phaser.Math.Clamp(
        this.pepe.body.velocity.y / 800, 
        -0.5, 
        Math.PI / 2
      );
    }
    
    // Создаем новые трубы
    if (time > this.nextPipeTime) {
      this.createPipes();
      this.nextPipeTime = time + this.pipeInterval;
    }
    
    // Обновляем трубы
    this.updatePipes();
    
    // Проверка столкновения ТОЛЬКО с нижней границей (земля)
    // Убираем проверку this.pepe.y < 0, чтобы разрешить вылетать за верхнюю границу экрана
    if (this.pepe.y > this.scale.height - this.groundHeight) {
      this.gameOver();
    }
  }
  
  jump(): void {
    if (this.isGameOver) return;
    
    // Устанавливаем вертикальную скорость для прыжка
    this.pepe.setVelocityY(this.JUMP_VELOCITY);
  }
  
  createPipes(): void {
    const { width, height } = this.scale;
    
    // Высота случайного отверстия
    const holeHeight = this.PIPE_SPACING;
    const holePosition = Phaser.Math.Between(
      150, 
      height - this.groundHeight - 150 - holeHeight
    );
    
    // Создаем верхнюю трубу
    const topPipe = this.pipeGroup.create(
      width + 50, 
      holePosition, 
      'pipe'
    ) as Phaser.Physics.Arcade.Sprite;
    
    // Поворачиваем и позиционируем верхнюю трубу
    topPipe.setOrigin(0.5, 1)
      .setFlipY(true)
      .setVelocityX(-this.PIPE_SPEED)
      .setImmovable(true);
    
    // Создаем нижнюю трубу
    const bottomPipe = this.pipeGroup.create(
      width + 50, 
      holePosition + holeHeight, 
      'pipe'
    ) as Phaser.Physics.Arcade.Sprite;
    
    // Позиционируем нижнюю трубу
    bottomPipe.setOrigin(0.5, 0)
      .setVelocityX(-this.PIPE_SPEED)
      .setImmovable(true);
    
    // Добавляем трубы в массив для отслеживания
    this.pipes.push({
      top: topPipe,
      bottom: bottomPipe,
      scored: false
    });
  }
  
  updatePipes(): void {
    // Проверяем прохождение труб и удаляем старые
    for (let i = 0; i < this.pipes.length; i++) {
      const pipe = this.pipes[i];
      
      // Проверяем, прошел ли Пепе трубу
      if (!pipe.scored && pipe.top.x < this.pepe.x) {
        pipe.scored = true;
        this.increaseScore();
      }
      
      // Удаляем трубы, которые вышли за левый край экрана
      if (pipe.top.x < -50) {
        pipe.top.destroy();
        pipe.bottom.destroy();
        this.pipes.splice(i, 1);
        i--;
      }
    }
  }
  
  increaseScore(): void {
    this.score++;
    this.scoreText.setText(`Score: ${this.score}`);
    
    // Передаем счет внешнему обработчику, если он есть
    if ((window as any).gameData?.onScoreUpdate) {
      (window as any).gameData.onScoreUpdate(this.score);
    }
  }
  
  gameOver(): void {
    if (this.isGameOver) return;
    
    this.isGameOver = true;
    
    // Останавливаем трубы
    this.pipeGroup.setVelocityX(0);
    
    // Останавливаем движение земли
    this.ground.tilePositionX = this.ground.tilePositionX;
    
    // Если коллайдер существует, удаляем его
    if (this.floorCollider) {
      this.floorCollider.destroy();
    }
    
    // Настраиваем поведение Пепе
    if (this.pepe.body) {
      // Проверяем, столкнулся ли Пепе с землей
      const hitGround = this.pepe.y > this.scale.height - this.groundHeight - this.pepe.displayHeight / 2;
      
      if (hitGround) {
        // Если уже на земле, просто останавливаем
        this.pepe.y = this.scale.height - this.groundHeight - this.pepe.displayHeight / 2;
        this.pepe.setVelocity(0, 0);
        this.pepe.setGravityY(0);
        this.pepe.setImmovable(true);
      } else {
        // Если столкнулся с трубой, позволяем падать под увеличенной гравитацией
        this.pepe.setVelocityX(0);
        this.pepe.setGravityY(2000); // Увеличиваем гравитацию для быстрого падения
        
        // Создаем новый коллайдер для определения момента падения на землю
        const floorHitbox = this.physics.add.staticGroup().create(
          this.scale.width / 2, 
          this.scale.height - this.groundHeight/2, 
          'ground'
        );
        
        floorHitbox.setVisible(false)
          .setDisplaySize(this.scale.width, this.groundHeight)
          .refreshBody();
          
        this.physics.add.collider(this.pepe, floorHitbox, () => {
          // Останавливаем Пепе при приземлении
          this.pepe.setVelocity(0, 0);
          this.pepe.setGravityY(0);
          this.pepe.setImmovable(true);
        });
      }
    }
    
    // Коллизия произошла, переходим к окончанию игры
    if ((window as any).gameData?.onGameOver) {
      (window as any).gameData.onGameOver(this.score);
    }
    
    // Сохраняем лучший результат
    const highScore = (window as any).gameData?.highScore || 0;
    if (this.score > highScore) {
      (window as any).gameData.highScore = this.score;
      localStorage.setItem('flappyPepeHighScore', this.score.toString());
    }
    
    // Задержка перед переходом к GameOver сцене
    this.time.delayedCall(1000, () => {
      this.scene.start('GameOverScene', { score: this.score });
    });
  }
} 