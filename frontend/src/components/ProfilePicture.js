import React, { useState, useEffect, useRef } from 'react';
import './ProfilePicture.css';

// Base path for assets - includes the basename for the app
const BASE_PATH = process.env.PUBLIC_URL || '';

// Sparkle GIF filenames
const sparkGifFilenames = [
  'spark-offWhite1.gif',
  'spark-orange1.gif',
  'spark-white1.gif',
  'spark1-orange.gif',
  'spark2-white.gif'
];

// Create full URLs for each GIF
const sparkGifs = sparkGifFilenames.map(filename => 
  `${BASE_PATH}/spark-gifs/${filename}`
);

// Log the paths for debugging
if (process.env.NODE_ENV === 'development') {
  console.log('Sparkle GIF paths:', sparkGifs);
}

// Preload images to ensure they're available
const preloadImages = (urls) => {
  urls.forEach(url => {
    try {
      const img = new Image();
      // Ensure we're not trying to preload empty or invalid URLs
      if (url && typeof url === 'string') {
        img.src = url;
        img.onload = () => {
          if (process.env.NODE_ENV === 'development') {
            console.log('Successfully loaded:', url);
          }
        };
        img.onerror = (e) => {
          console.warn(`Failed to load image: ${url}`, e);
        };
      }
    } catch (error) {
      console.warn('Error preloading image:', error);
    }
  });
};

// Only preload in browser environment
if (typeof window !== 'undefined') {
  // Use a small delay to ensure the app is fully loaded
  setTimeout(() => {
    preloadImages(sparkGifs);
  }, 1000);
}

const ProfilePicture = ({ src, alt, className = '' }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [sparks, setSparks] = useState([]);
  const containerRef = useRef(null);
  const sparkleTimer = useRef(null);
  const [isMounted, setIsMounted] = useState(false);

  // Set up hover effects and sparkle animation
  useEffect(() => {
    setIsMounted(true);
    
    // Clean up any existing timers on unmount
    return () => {
      if (sparkleTimer.current) {
        clearInterval(sparkleTimer.current);
        sparkleTimer.current = null;
      }
      setIsMounted(false);
    };
  }, []);

  // Handle mouse enter to start hover effects
  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  // Handle mouse leave to clean up hover effects
  const handleMouseLeave = () => {
    setIsHovered(false);
    if (sparkleTimer.current) {
      clearInterval(sparkleTimer.current);
      sparkleTimer.current = null;
    }
    setSparks([]);
  };

  const createSpark = () => {
    if (!containerRef.current || !isMounted) return;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const size = 30 + Math.random() * 20; // 30-50px
    const x = Math.random() * 100; // Percentage based positioning
    const y = Math.random() * 100; // Percentage based positioning
    const gif = sparkGifs[Math.floor(Math.random() * sparkGifs.length)];
    
    setSparks(prev => [
      ...prev.slice(-5), // Keep only the last 5 sparks for performance
      { 
        id: Date.now() + Math.random(),
        x, 
        y, 
        size,
        gif,
        opacity: 0.8 + Math.random() * 0.2 // 0.8-1 opacity
      }
    ]);
  };

  useEffect(() => {
    if (!isHovered) {
      setSparks([]);
      if (sparkleTimer.current) {
        clearInterval(sparkleTimer.current);
        sparkleTimer.current = null;
      }
      return;
    }

    // Create initial spark
    createSpark();
    
    // Set up interval for new sparks
    sparkleTimer.current = setInterval(createSpark, 500);

    return () => {
      if (sparkleTimer.current) {
        clearInterval(sparkleTimer.current);
      }
    };
  }, [isHovered]);

  // Clean up sparks after animation
  useEffect(() => {
    if (sparks.length > 0) {
      const timer = setTimeout(() => {
        setSparks(prev => prev.slice(1));
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [sparks]);

  return (
    <div 
      className={`profile-picture-container ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={containerRef}
      style={{
        position: 'relative',
        display: 'inline-block',
        width: '200px',
        height: '200px',
        margin: '10px'
      }}
    >
      <img 
        src={src} 
        alt={alt} 
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          position: 'relative',
          zIndex: 5,
          pointerEvents: 'none',
          transition: 'transform 0.3s ease',
          willChange: 'transform'
        }}
      />
      
      {isHovered && isMounted && (
        <div className="sparkle-overlay">
          {sparks.map(spark => (
            <div
              key={spark.id}
              style={{
                position: 'absolute',
                left: `${spark.x}%`,
                top: `${spark.y}%`,
                width: `${spark.size}px`,
                height: `${spark.size}px`,
                transform: 'translate(-50%, -50%)',
                zIndex: 10,
                pointerEvents: 'none',
                backgroundImage: `url(${spark.gif})`,
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                imageRendering: 'high-quality',
                opacity: spark.opacity,
                animation: `fadeOut ${1 + Math.random() * 0.5}s forwards`
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfilePicture;
