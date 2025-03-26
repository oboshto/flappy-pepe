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

  // Sound effects
  private jumpSound!: Phaser.Sound.BaseSound;
  private deathSound!: Phaser.Sound.BaseSound;
  private passPipeSound!: Phaser.Sound.BaseSound;
  private newHighscoreSound!: Phaser.Sound.BaseSound;
  private achievementSound!: Phaser.Sound.BaseSound;
  private achievementPlayed = false;

  // Constants of the game
  private readonly JUMP_VELOCITY = -350;
  private readonly PIPE_SPEED = 200;
  private readonly PIPE_SPACING = 120;

  constructor() {
    super('GameScene');
  }

  create(): void {
    const { width, height } = this.scale;

    // Reset game state
    this.score = 0;
    this.pipes = [];
    this.isGameOver = false;
    this.achievementPlayed = false;

    // Load sounds
    this.jumpSound = this.sound.add('jump');
    this.deathSound = this.sound.add('death');
    this.passPipeSound = this.sound.add('pass-pipe');
    this.newHighscoreSound = this.sound.add('new-highscore');
    this.achievementSound = this.sound.add('achievement');

    // Enable physics
    this.physics.world.setBounds(0, 0, width, height);

    // Add background - set it to full screen height
    this.add.tileSprite(0, 0, width, height, 'background').setOrigin(0, 0).setScrollFactor(0);

    // Create pipe group
    this.pipeGroup = this.physics.add.group();

    // Add "moving" ground
    this.ground = this.add.tileSprite(0, height - this.groundHeight, width, this.groundHeight, 'ground').setOrigin(0, 0);

    // Add static body for ground - create invisible rectangle
    const groundBody = this.physics.add.staticGroup();
    const floor = groundBody.create(width / 2, height - this.groundHeight / 2, 'ground') as Phaser.Physics.Arcade.Sprite;

    // Configure size and visibility of the floor
    floor.setVisible(false).setDisplaySize(width, this.groundHeight).refreshBody();

    this.pepe = this.physics.add
      .sprite(80, height / 2, 'pepe')
      .setDisplaySize(62, 64)
      .setOrigin(0.5, 0.5)
      .setBounce(0.1)
      .setCollideWorldBounds(false)
      .setGravityY(1000);

    this.pepe.setSize(145, 155);
    if (this.pepe.body) {
      this.pepe.body.setOffset(10, 10);
    }

    // Enable smoothing for sprite
    this.pepe.setTexture('pepe');
    (this.pepe.texture.source[0] as any).scaleMode = Phaser.ScaleModes.LINEAR;

    // Add score
    this.scoreText = this.add
      .text(width / 2, 50, 'Score: 0', {
        fontFamily: '"Press Start 2P"',
        fontSize: '24px',
        color: '#fff',
        stroke: '#000',
        strokeThickness: 5,
        shadow: { color: '#000', fill: true, offsetX: 2, offsetY: 2, blur: 4 },
      })
      .setOrigin(0.5);

    // Handle jump on tap/click
    this.input.on('pointerdown', this.jump, this);

    // Add spacebar handler
    this.input.keyboard?.on('keydown-SPACE', this.jump, this);

    // Check collisions with ground
    this.floorCollider = this.physics.add.collider(this.pepe, floor, this.gameOver, undefined, this);

    // Check collisions with pipes
    this.physics.add.collider(this.pepe, this.pipeGroup, this.gameOver, undefined, this);

    // Initialize time for first pipe
    this.nextPipeTime = this.time.now + this.pipeInterval;
  }

  update(time: number): void {
    if (this.isGameOver) return;

    // Animate ground movement
    this.ground.tilePositionX += 2;

    // Rotate Pepe based on falling speed
    if (this.pepe.body) {
      this.pepe.rotation = Phaser.Math.Clamp(this.pepe.body.velocity.y / 800, -0.5, Math.PI / 2);
    }

    // Create new pipes
    if (time > this.nextPipeTime) {
      this.createPipes();
      this.nextPipeTime = time + this.pipeInterval;
    }

    // Update pipes
    this.updatePipes();

    // Check collision with lower boundary (ground)
    if (this.pepe.y > this.scale.height - this.groundHeight) {
      this.gameOver();
    }

    // Check collision with pipes manually when Pepe flies very high
    if (this.pepe.y < 0) {
      for (const pipe of this.pipes) {
        // Check if Pepe is horizontally aligned with a pipe
        if (
          this.pepe.x + this.pepe.width / 2 > pipe.top.x - pipe.top.displayWidth / 2 &&
          this.pepe.x - this.pepe.width / 2 < pipe.top.x + pipe.top.displayWidth / 2
        ) {
          // Even if Pepe is flying very high, it should collide with pipes
          this.gameOver();
          break;
        }
      }
    }
  }

  jump(): void {
    if (this.isGameOver) return;

    // Set vertical speed for jump
    this.pepe.setVelocityY(this.JUMP_VELOCITY);

    // Play jump sound
    this.jumpSound.play();
  }

  createPipes(): void {
    const { width, height } = this.scale;

    // Height of random hole
    const holeHeight = this.PIPE_SPACING;
    const holePosition = Phaser.Math.Between(150, height - this.groundHeight - 150 - holeHeight);

    // Create top pipe
    const topPipe = this.pipeGroup.create(width + 50, holePosition, 'pipe') as Phaser.Physics.Arcade.Sprite;

    // Rotate and position top pipe
    topPipe.setOrigin(0.5, 1).setFlipY(true).setVelocityX(-this.PIPE_SPEED).setImmovable(true);

    // Create bottom pipe
    const bottomPipe = this.pipeGroup.create(width + 50, holePosition + holeHeight, 'pipe') as Phaser.Physics.Arcade.Sprite;

    // Position bottom pipe
    bottomPipe.setOrigin(0.5, 0).setVelocityX(-this.PIPE_SPEED).setImmovable(true);

    // Add pipes to array for tracking
    this.pipes.push({
      top: topPipe,
      bottom: bottomPipe,
      scored: false,
    });
  }

  updatePipes(): void {
    // Check for pipe passage and remove old ones
    for (let i = 0; i < this.pipes.length; i++) {
      const pipe = this.pipes[i];

      // Check if Pepe passed the pipe
      if (!pipe.scored && pipe.top.x < this.pepe.x) {
        pipe.scored = true;
        this.increaseScore();
      }

      // Remove pipes that went out of left screen edge
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

    // Play pass-pipe sound
    this.passPipeSound.play();

    // Play achievement sound when score > 10
    if (this.score === 10 && !this.achievementPlayed) {
      this.achievementSound.play();
      this.achievementPlayed = true;
    }

    // Pass score to external handler if it exists
    if ((window as any).gameData?.onScoreUpdate) {
      (window as any).gameData.onScoreUpdate(this.score);
    }
  }

  gameOver(): void {
    if (this.isGameOver) return;

    this.isGameOver = true;

    // Play death sound
    this.deathSound.play();

    // Stop pipes
    this.pipeGroup.setVelocityX(0);

    // Stop ground movement
    this.ground.tilePositionX = this.ground.tilePositionX;

    // If collider exists, remove it
    if (this.floorCollider) {
      this.floorCollider.destroy();
    }

    // Configure Pepe behavior
    if (this.pepe.body) {
      // Check if Pepe hit ground
      const hitGround = this.pepe.y > this.scale.height - this.groundHeight - this.pepe.displayHeight / 2;

      if (hitGround) {
        // If already on ground, just stop
        this.pepe.y = this.scale.height - this.groundHeight - this.pepe.displayHeight / 2;
        this.pepe.setVelocity(0, 0);
        this.pepe.setGravityY(0);
        this.pepe.setImmovable(true);
      } else {
        // If hit by pipe, allow falling under increased gravity
        this.pepe.setVelocityX(0);
        this.pepe.setGravityY(2000); // Increase gravity for fast falling

        // Create new collider for ground hit detection
        const floorHitbox = this.physics.add
          .staticGroup()
          .create(this.scale.width / 2, this.scale.height - this.groundHeight / 2, 'ground');

        floorHitbox.setVisible(false).setDisplaySize(this.scale.width, this.groundHeight).refreshBody();

        this.physics.add.collider(this.pepe, floorHitbox, () => {
          // Stop Pepe when hitting ground
          this.pepe.setVelocity(0, 0);
          this.pepe.setGravityY(0);
          this.pepe.setImmovable(true);
        });
      }
    }

    // Collision happened, go to GameOver scene
    if ((window as any).gameData?.onGameOver) {
      (window as any).gameData.onGameOver(this.score);
    }

    // Save best result
    const highScore = (window as any).gameData?.highScore || 0;
    if (this.score > highScore) {
      // Play new highscore sound
      this.newHighscoreSound.play();

      (window as any).gameData.highScore = this.score;
      localStorage.setItem('flappyPepeHighScore', this.score.toString());
    }

    // Delay before going to GameOver scene
    this.time.delayedCall(1000, () => {
      this.scene.start('GameOverScene', { score: this.score });
    });
  }
}
