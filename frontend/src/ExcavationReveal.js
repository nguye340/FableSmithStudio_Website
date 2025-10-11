import React, { useState, useEffect, useRef } from 'react';
import './ExcavationReveal.css';

const ExcavationReveal = ({ title, subtitle }) => {
  const [isVisible, setIsVisible] = useState(false);
  const componentRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1,
      }
    );

    if (componentRef.current) {
      observer.observe(componentRef.current);
    }

    return () => {
      if (componentRef.current) {
        observer.unobserve(componentRef.current);
      }
    };
  }, []);

  return (
    <div 
      ref={componentRef} 
      className={`excavation-reveal ${isVisible ? 'visible' : ''}`}
    >
      <h1 className="excavation-title">{title}</h1>
      {subtitle && <p className="excavation-subtitle">{subtitle}</p>}
    </div>
  );
};

export default ExcavationReveal;
