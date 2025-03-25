import { useState, useEffect, useRef } from 'react';
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
  
  // Initialize game on component mount
  useEffect(() => {
    if (!gameContainerRef.current || gameInstanceRef.current) return;
    
    // Use screen width for mobile devices, but not less than 320px
    // Maintain 3:4 aspect ratio for height
    const mobileWidth = Math.max(window.innerWidth, 320);
    const canvasWidth = isMobile ? mobileWidth : 400;
    const canvasHeight = isMobile ? mobileWidth * 1.5 : 600;
    
    // Create game with event handlers
    gameInstanceRef.current = createGame('game-container', canvasWidth, canvasHeight, 
      // Update score
      (newScore: number) => {
        setScore(newScore);
      },
      // Game over event
      (finalScore: number) => {
        setScore(finalScore);
      }
    );
    
    // Game over event handler
    const handleGameOver = () => {
      setShowShareButtons(true);
    };
    
    // Share button handler in game
    const handleShare = () => {
      shareScore('twitter');
    };
    
    window.addEventListener('flappyPepeGameOver', handleGameOver);
    window.addEventListener('flappyPepeShare', handleShare);
    
    // Cleanup on unmount
    return () => {
      window.removeEventListener('flappyPepeGameOver', handleGameOver);
      window.removeEventListener('flappyPepeShare', handleShare);
      if (gameInstanceRef.current) {
        gameInstanceRef.current.destroy(true);
        gameInstanceRef.current = null;
      }
    };
  }, [isMobile, highScore]);
  
  // Function to share result
  const shareScore = (platform: string) => {
    const text = `I scored ${score} points in Flappy Pepe! Can you beat my score?`;
    const url = window.location.href;
    
    let shareUrl = '';
    
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
    }
    
    // For iOS Safari, use location.href instead of window.open
    if (isMobile && /iPhone|iPad|iPod/i.test(navigator.userAgent) && /Safari/i.test(navigator.userAgent)) {
      window.location.href = shareUrl;
    } else {
      window.open(shareUrl, '_blank');
    }
  };
  
  // Hide share buttons when restarting game
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
    
    // Listen for game start event from Phaser
    window.addEventListener('flappyPepeGameStart', handleGameStart);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('flappyPepeGameStart', handleGameStart);
    };
  }, [showShareButtons]);
  
  return (
    <div className="relative flex flex-col items-center justify-center">
      {/* Container for Phaser game */}
      <div 
        id="game-container" 
        ref={gameContainerRef}
        className="relative overflow-hidden" 
        style={isMobile ? 
          { width: '100%', height: 'auto', maxWidth: '100vw', aspectRatio: '2/3', minHeight: '300px' } : 
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