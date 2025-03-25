import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene';
import { GameScene } from './scenes/GameScene';
import { MenuScene } from './scenes/MenuScene';
import { GameOverScene } from './scenes/GameOverScene';

export const gameConfig = (parent: string, width = 400, height = 600): Phaser.Types.Core.GameConfig => {
  return {
    type: Phaser.AUTO,
    width,
    height,
    parent,
    backgroundColor: '#70c5ce',
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 0, x: 0 },
        debug: false
      }
    },
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: width,
      height: height,
      parent: parent,
      expandParent: false
    },
    scene: [BootScene, MenuScene, GameScene, GameOverScene],
    pixelArt: false,
    roundPixels: false,
    canvasStyle: 'display: block; width: 100%; height: 100%;'
  };
};

export const createGame = (
  containerId: string, 
  width: number, 
  height: number, 
  onScoreUpdate?: (score: number) => void,
  onGameOver?: (score: number) => void,
  isMobile?: boolean
): Phaser.Game => {
  const config = gameConfig(containerId, width, height);
  const game = new Phaser.Game(config);
  
  // Global game data
  (window as any).gameData = {
    onScoreUpdate,
    onGameOver,
    highScore: Number(localStorage.getItem('flappyPepeHighScore') || '0'),
    isMobile: isMobile || false
  };
  
  return game;
}; 