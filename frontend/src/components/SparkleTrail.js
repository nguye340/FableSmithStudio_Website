import React, { useEffect, useState, useRef } from 'react';
import './SparkleTrail.css';

const SPARKLE_GIFS = [
  'spark-offWhite1.gif',
  'spark-orange1.gif',
  'spark-white1.gif',
  'spark1-orange.gif',
  'spark2-white.gif'
];

const SparkleTrail = ({ count = 20, size = 30, enabled = true }) => {
  const [sparkles, setSparkles] = useState([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const trailRef = useRef([]);
  const rafRef = useRef();
  const lastTime = useRef(0);
  const trailLength = count;

  // Handle mouse movement
  useEffect(() => {
    if (!enabled) return;

    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [enabled]);

  // Animation loop
  useEffect(() => {
    if (!enabled) return;

    const updateTrail = (timestamp) => {
      // Add new position to trail
      trailRef.current = [
        { x: mousePos.x, y: mousePos.y, time: timestamp },
        ...trailRef.current.slice(0, trailLength - 1)
      ];

      // Update sparkles based on trail
      const newSparkles = trailRef.current
        .filter((_, i) => i % Math.ceil(trailLength / count) === 0)
        .map((pos, i) => ({
          id: i,
          x: pos.x - size / 2,
          y: pos.y - size / 2,
          size: size * (0.5 + (i / count) * 0.5), // Vary size along the trail
          opacity: 1 - i / count, // Fade out along the trail
          gif: SPARKLE_GIFS[i % SPARKLE_GIFS.length]
        }));

      setSparkles(newSparkles);
      lastTime.current = timestamp;
      rafRef.current = requestAnimationFrame(updateTrail);
    };

    rafRef.current = requestAnimationFrame(updateTrail);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [mousePos, count, size, enabled, trailLength]);

  if (!enabled) return null;

  return (
    <div className="sparkle-trail">
      {sparkles.map((sparkle) => (
        <div
          key={sparkle.id}
          className="sparkle"
          style={{
            position: 'fixed',
            left: `${sparkle.x}px`,
            top: `${sparkle.y}px`,
            width: `${sparkle.size}px`,
            height: `${sparkle.size}px`,
            opacity: sparkle.opacity,
            pointerEvents: 'none',
            zIndex: 9999,
            backgroundImage: `url('/FableSmithStudio_Website/spark-gifs/${sparkle.gif}')`,
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            transform: `rotate(${Math.random() * 360}deg)`,
            transition: 'transform 0.2s ease-out',
            willChange: 'transform, opacity'
          }}
          aria-hidden="true"
        />
      ))}
    </div>
  );
};

export default SparkleTrail;
