import React, { useState, useEffect } from 'react';
import './ImageSlideshow.css';

// Debug function to log image loading
const logImageLoad = (src, success) => {
  console.log(`Image ${success ? 'loaded' : 'failed to load'}:`, src);
};

const ImageSlideshow = ({ images, alt, interval = 5000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Debug: Log props when component mounts
  useEffect(() => {
    console.log('ImageSlideshow mounted with props:', { 
      images, 
      alt, 
      interval,
      publicUrl: process.env.PUBLIC_URL
    });
    
    // Log each image's type and value
    if (images && Array.isArray(images)) {
      console.log('Images array details:');
      images.forEach((img, idx) => {
        console.log(`Image ${idx}:`, {
          type: typeof img,
          isObject: img && typeof img === 'object',
          hasDefault: img?.default !== undefined,
          value: img
        });
      });
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, interval);

    return () => clearInterval(timer);
  }, [images.length, interval]);

  const handleDotClick = (index) => {
    setCurrentIndex(index);
  };

  // Function to handle both imported images and path strings
  const getImagePath = (image) => {
    if (!image) {
      console.error('Image is undefined or null');
      return '';
    }
    
    console.log('Processing image:', image);
    
    // If it's a string path
    if (typeof image === 'string') {
      // If it's a full URL or data URL, use as is
      if (image.startsWith('http') || image.startsWith('data:') || image.startsWith('blob:')) {
        console.log('Using direct URL:', image);
        return image;
      }
      
      // If it's an absolute path (starts with /), use as is (browser will resolve from public URL)
      if (image.startsWith('/')) {
        console.log('Using absolute path:', image);
        return image;
      }
      
      // For relative paths, assume they're in the public folder
      const fullPath = `/${image}`;
      console.log('Using relative path from public folder:', fullPath);
      return fullPath;
    }
    
    // Handle imported image modules (Webpack/Loader syntax)
    if (typeof image === 'object') {
      // Check for default export (common with import/require)
      if (image.default) {
        console.log('Using default export:', image.default);
        return image.default;
      }
      
      // If it's a module with a __esModule flag
      if (image.__esModule && image.default) {
        console.log('Using ES module default export:', image.default);
        return image.default;
      }
      
      // If it's a direct object with src or url
      if (image.src) {
        console.log('Using image object with src:', image.src);
        return image.src;
      }
      
      if (image.url) {
        console.log('Using image object with url:', image.url);
        return image.url;
      }
    }
    
    console.error('Could not determine image source:', image);
    return '';
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
              onLoad={() => logImageLoad(getImagePath(image), true)}
              onError={(e) => {
                console.error('Error loading image:', getImagePath(image));
                logImageLoad(getImagePath(image), false);
              }}
              style={{
                display: 'block',
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
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
          />
        ))}
      </div>
    </div>
  );
};

export default ImageSlideshow;
