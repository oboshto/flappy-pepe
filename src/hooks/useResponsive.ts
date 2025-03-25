import { useState, useEffect } from 'react';

export const useResponsive = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkDeviceType = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
      setIsDesktop(width >= 1024);
    };

    // Initial check
    checkDeviceType();

    // Add event listener
    window.addEventListener('resize', checkDeviceType);

    // Clean up
    return () => {
      window.removeEventListener('resize', checkDeviceType);
    };
  }, []);

  return { isMobile, isTablet, isDesktop };
};

export default useResponsive; 