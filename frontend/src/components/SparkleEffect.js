// src/components/SparkleEffect.js
import { useEffect, useRef, useState } from 'react';

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

const SparkleEffect = ({ isHovering, bounds }) => {
  const [sparks, setSparks] = useState([]);
  const sparkleTimer = useRef(null);

  useEffect(() => {
    if (!isHovering) {
      setSparks([]);
      if (sparkleTimer.current) {
        clearInterval(sparkleTimer.current);
        sparkleTimer.current = null;
      }
      return;
    }

    const createSpark = () => {
      if (!bounds) return;
      
      const size = 20 + Math.random() * 30; // Random size between 20-50px
      const x = Math.random() * bounds.width;
      const y = Math.random() * bounds.height;
      const gif = sparkGifs[Math.floor(Math.random() * sparkGifs.length)];
      
      setSparks(prev => [
        ...prev.slice(-10), // Keep only the last 10 sparks for performance
        { 
          id: Date.now() + Math.random(),
          x, 
          y, 
          size,
          gif,
          opacity: 0.7 + Math.random() * 0.3 // Random opacity between 0.7-1
        }
      ]);
    };

    // Create initial spark
    createSpark();
    
    // Set up interval for new sparks
    sparkleTimer.current = setInterval(createSpark, 300);

    return () => {
      if (sparkleTimer.current) {
        clearInterval(sparkleTimer.current);
      }
    };
  }, [isHovering, bounds]);

  if (!isHovering) return null;

  return (
    <div 
      className="sparkle-container" 
      style={{
        position: 'absolute',
        top: bounds?.top || 0,
        left: bounds?.left || 0,
        width: bounds?.width || 0,
        height: bounds?.height || 0,
        pointerEvents: 'none',
        overflow: 'visible',
        zIndex: 1000
      }}
    >
      {sparks.map(spark => (
        <img
          key={spark.id}
          src={spark.gif}
          alt=""
          style={{
            position: 'absolute',
            left: `${spark.x}px`,
            top: `${spark.y}px`,
            width: `${spark.size}px`,
            height: `${spark.size}px`,
            opacity: spark.opacity,
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
            transition: 'opacity 0.5s ease-out',
            animation: `fadeOut ${1 + Math.random() * 2}s forwards`
          }}
        />
      ))}
      <style jsx>{`
        @keyframes fadeOut {
          0% { opacity: 0.8; transform: translate(-50%, -50%) scale(1); }
          100% { opacity: 0; transform: translate(-50%, -50%) scale(1.5); }
        }
      `}</style>
    </div>
  );
};

export default SparkleEffect;