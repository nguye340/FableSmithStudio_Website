import React from 'react';
import './PageBackground.css';

const PageBackground = ({ children, opacity = 0.08, brightness = 1, contrast = 1.1, className = '' }) => {
  return (
    <div className={`page-background ${className}`}>
      <div 
        className="background-image"
        style={{
          opacity,
          filter: `brightness(${brightness}) contrast(${contrast})`
        }}
      />
      <div className="content">
        {children}
      </div>
    </div>
  );
};

export default PageBackground;
