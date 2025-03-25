import { useState, useEffect, useRef } from 'react';
import { FaXTwitter } from 'react-icons/fa6';
import useResponsive from '../hooks/useResponsive';
import { createGame } from '../game/config';

const Game = () => {
  const { isMobile } = useResponsive();
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('flappyPepeHighScore');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [showShareButtons, setShowShareButtons] = useState(false);
  
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const gameInstanceRef = useRef<Phaser.Game | null>(null);
  
  // Инициализируем игру при монтировании компонента
  useEffect(() => {
    if (!gameContainerRef.current || gameInstanceRef.current) return;
    
    // Используем ширину экрана для мобильных устройств, но не менее 320px
    // Сохраняем соотношение сторон 3:4 для высоты
    const mobileWidth = Math.max(window.innerWidth, 320);
    const canvasWidth = isMobile ? mobileWidth : 400;
    const canvasHeight = isMobile ? mobileWidth * 1.5 : 600;
    
    // Создаем игру с обработчиками событий
    gameInstanceRef.current = createGame('game-container', canvasWidth, canvasHeight, 
      // Обновление счета
      (newScore: number) => {
        setScore(newScore);
      },
      // Событие окончания игры
      (finalScore: number) => {
        setScore(finalScore);
        // Обновляем высший балл, если нужно
        if (finalScore > highScore) {
          setHighScore(finalScore);
          localStorage.setItem('flappyPepeHighScore', finalScore.toString());
        }
      }
    );
    
    // Обработчик события окончания игры
    const handleGameOver = () => {
      setShowShareButtons(true);
    };
    
    // Обработчик нажатия на кнопку Share в игре
    const handleShare = () => {
      shareScore('twitter');
    };
    
    window.addEventListener('flappyPepeGameOver', handleGameOver);
    window.addEventListener('flappyPepeShare', handleShare);
    
    // Очистка при размонтировании
    return () => {
      window.removeEventListener('flappyPepeGameOver', handleGameOver);
      window.removeEventListener('flappyPepeShare', handleShare);
      if (gameInstanceRef.current) {
        gameInstanceRef.current.destroy(true);
        gameInstanceRef.current = null;
      }
    };
  }, [isMobile, highScore]);
  
  // Функция для шеринга результата
  const shareScore = (platform: string) => {
    const text = `I scored ${score} points in Flappy Pepe! Can you beat my score?`;
    const url = window.location.href;
    
    let shareUrl = '';
    
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
    }
    
    window.open(shareUrl, '_blank');
  };
  
  // Скрыть кнопки шеринга при перезапуске игры
  useEffect(() => {
    if (!showShareButtons) return;
    
    const handleGameStart = () => {
      setShowShareButtons(false);
    };
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        handleGameStart();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    // Слушаем событие запуска игры от Phaser
    window.addEventListener('flappyPepeGameStart', handleGameStart);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('flappyPepeGameStart', handleGameStart);
    };
  }, [showShareButtons]);
  
  return (
    <div className="relative flex flex-col items-center justify-center">
      {/* Контейнер для игры Phaser */}
      <div 
        id="game-container" 
        ref={gameContainerRef}
        className="relative overflow-hidden" 
        style={isMobile ? 
          { width: '100%', height: 'auto', maxWidth: '100vw' } : 
          { width: '400px', height: '600px' }
        }
      ></div>
      
      <div className="mt-4 text-center">
        <p className="text-xs md:text-sm">
          {isMobile ? 'Tap to make Pepe jump. Avoid the pipes!' : 'Click or press SPACE to make Pepe jump. Avoid the pipes!'}
        </p>
      </div>
    </div>
  );
};

export default Game; 