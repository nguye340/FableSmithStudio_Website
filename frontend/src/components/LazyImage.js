import React, { useState, useEffect, useRef } from 'react';
import './LazyImage.css';

const LazyImage = ({ src, alt, className, style }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '100px',
        threshold: 0.1
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (imgRef.current) {
        observer.disconnect();
      }
    };
  }, []);

  const handleImageLoad = () => {
    setIsLoaded(true);
  };

  return (
    <div
      ref={imgRef}
      className={`lazy-image-container ${className || ''}`}
      style={style}
    >
      {isInView && (
        <>
          <img
            src={src}
            alt={alt}
            className={`lazy-image ${isLoaded ? 'loaded' : ''}`}
            onLoad={handleImageLoad}
          />
          {!isLoaded && <div className="lazy-image-placeholder"></div>}
        </>
      )}
      {!isInView && <div className="lazy-image-placeholder"></div>}
    </div>
  );
};

export default LazyImage;
