import React, { useState, useEffect } from 'react';
import './ImageSlideshow.css';

const ImageSlideshow = ({ images, alt, interval = 5000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, interval);

    return () => clearInterval(timer);
  }, [images.length, interval]);

  const handleDotClick = (index) => {
    setCurrentIndex(index);
  };

  // Function to handle image paths - check if they start with '/' and prepend assets if needed
  const getImagePath = (path) => {
    if (path.startsWith('/')) {
      // Remove leading slash and prepend with assets path
      return require(`../assets${path}`);
    }
    return path;
  };

  return (
    <div className="image-slideshow">
      <div className="slideshow-container">
        {images.map((image, index) => (
          <div
            key={index}
            className={`slideshow-slide ${index === currentIndex ? 'active' : ''}`}
          >
            <img 
              src={getImagePath(image)} 
              alt={`${alt} - Slide ${index + 1}`} 
              className="slideshow-image" 
            />
          </div>
        ))}
      </div>
      
      <div className="slideshow-dots">
        {images.map((_, index) => (
          <span
            key={index}
            className={`slideshow-dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => handleDotClick(index)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default ImageSlideshow;
