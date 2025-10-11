import React from 'react';
import './MouseSparkleEffect.css';

const { useState, useEffect, useCallback, useRef } = React;

const sparkGifs = [
  '/spark-gifs/spark-offWhite1.gif',
  '/spark-gifs/spark-orange1.gif',
  '/spark-gifs/spark-white1.gif',
  '/spark-gifs/spark1-orange.gif',
  '/spark-gifs/spark2-white.gif',
  '/spark-gifs/spark3-offwhite.gif',
  '/spark-gifs/spark3-white.gif',
  '/spark-gifs/spark3-white1.gif',
  '/spark-gifs/spark4-white.gif',
  '/spark-gifs/spark4-yellow.gif'
];

const MouseSparkleEffect = () => {
  const [sparks, setSparks] = useState([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const animationFrameId = useRef();
  const lastSparkTime = useRef(0);

  const handleMouseMove = useCallback((e) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [handleMouseMove]);

  const animate = useCallback(() => {
    const now = Date.now();
    
    // Create new sparkles at a controlled rate
    if (now - lastSparkTime.current > 50) { // Adjust timing for more/less frequent sparkles
      const angle = Math.random() * Math.PI * 2;
      const distance = 20 + Math.random() * 50; // Distance from cursor
      const size = 15 + Math.random() * 25; // Size of sparkle
      
      setSparks(prev => [
        ...prev,
        {
          id: now + Math.random(),
          x: mousePosition.x + Math.cos(angle) * distance,
          y: mousePosition.y + Math.sin(angle) * distance,
          size,
          gif: sparkGifs[Math.floor(Math.random() * sparkGifs.length)],
          opacity: 0.7 + Math.random() * 0.3,
          rotation: Math.random() * 360,
          scale: 0.5 + Math.random() * 0.5,
          velocity: 0.1 + Math.random() * 0.2
        }
      ].slice(-20)); // Keep only the last 20 sparkles for performance
      
      lastSparkTime.current = now;
    }

    // Update existing sparkles
    setSparks(prev => 
      prev
        .map(spark => ({
          ...spark,
          y: spark.y - spark.velocity, // Float upward
          opacity: spark.opacity - 0.01, // Fade out
          scale: spark.scale * 0.99 // Shrink slightly
        }))
        .filter(spark => spark.opacity > 0.1) // Remove invisible sparkles
    );

    animationFrameId.current = requestAnimationFrame(animate);
  }, [mousePosition]);

  useEffect(() => {
    animationFrameId.current = requestAnimationFrame(animate);
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [animate]);

  return (
    <div className="mouse-sparkle-container">
      {sparks.map(spark => (
        <div
          key={spark.id}
          className="sparkle"
          style={{
            position: 'fixed',
            left: `${spark.x - spark.size / 2}px`,
            top: `${spark.y - spark.size / 2}px`,
            width: `${spark.size}px`,
            height: `${spark.size}px`,
            opacity: spark.opacity,
            transform: `scale(${spark.scale}) rotate(${spark.rotation}deg)`,
            pointerEvents: 'none',
            zIndex: 9999,
            transition: 'transform 0.1s ease-out, opacity 0.5s ease-out',
            backgroundImage: `url(${spark.gif})`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            willChange: 'transform, opacity'
          }}
        />
      ))}
    </div>
  );
};

export default MouseSparkleEffect;
