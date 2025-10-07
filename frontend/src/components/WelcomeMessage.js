import React, { useState, useEffect, useCallback, useMemo, lazy, Suspense, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './WelcomeMessage.css';
import nextButtonImage from '../assets/cursor/nextButton2-rb.png';
import underlineImage from '../assets/cursor/underline2.png';

// Lazy load heavy components with dynamic imports
const BlurText = lazy(() => import(/* webpackPrefetch: true */ './BlurText'));
// Load GSAP and ScrollTrigger first
const gsapPromise = import('gsap');
const ScrollTriggerPromise = import('gsap/ScrollTrigger');

const ScrollReveal = lazy(async () => {
  // Wait for both GSAP and ScrollTrigger to be loaded
  const [gsap, ScrollTrigger] = await Promise.all([gsapPromise, ScrollTriggerPromise]);
  
  // Register ScrollTrigger plugin
  if (gsap && gsap.registerPlugin) {
    gsap.registerPlugin(ScrollTrigger.default || ScrollTrigger);
  }
  
  // Now import the ScrollReveal component
  return import(/* webpackPrefetch: true */ './ScrollReveal');
});

// Font loading is now handled via CSS @import for better performance

const WelcomeMessage = () => {
  const navigate = useNavigate();
  const [isClicked, setIsClicked] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [colorIndex, setColorIndex] = useState(0);
  const welcomeRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);
  
  // Handle mouse move for gradient effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setMousePosition({ x, y });
        
        // Update CSS variables for gradient position
        containerRef.current.style.setProperty('--mouse-x', `${x}%`);
        containerRef.current.style.setProperty('--mouse-y', `${y}%`);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Handle click on the Adventurer text specifically
  const handleTextClick = useCallback((e) => {
    e.stopPropagation(); // Prevent triggering the document click event
    setIsClicked(true);
    setColorIndex(prevIndex => (prevIndex + 1) % 6);
    const timer = setTimeout(() => setIsClicked(false), 1000);
    return () => clearTimeout(timer);
  }, [setIsClicked, setColorIndex]);
  
  // Handle global click for color cycling
  useEffect(() => {
    const handleGlobalClick = () => {
      setIsClicked(true);
      setColorIndex(prevIndex => (prevIndex + 1) % 6);
      const timer = setTimeout(() => setIsClicked(false), 1000);
      return () => clearTimeout(timer);
    };

    document.addEventListener('click', handleGlobalClick);
    return () => document.removeEventListener('click', handleGlobalClick);
  }, []);

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (welcomeRef.current) {
      observer.observe(welcomeRef.current);
    }

    return () => {
      if (welcomeRef.current) {
        observer.unobserve(welcomeRef.current);
      }
    };
  }, []);


  const handleAnimationComplete = () => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Welcome message animation completed!');
    }
  };

  const messageLines = [
    <div key="welcome-container" style={{ marginBottom: '0.5rem' }}>
      <span className="welcome-text">Welcome, </span>
    </div>,
    <div key="poem" style={{ marginTop: '0' }}>
      <div className="poem-line">You stand at FableSmiths' forge,</div>
      <div className="poem-line">where every tale awaits like iron in the fire.</div>
      <div className="poem-line">Stay a while, listen to the embers, dream.</div>
      <div className="poem-line empty-line"></div>
      <div className="poem-line">Perhaps a spark will find you.</div>
      <div className="poem-line">Or, if you already carry one,</div>
      <div className="poem-line" style={{ marginTop: '1.5rem' }}>
        <span className="highlight-text" style={{fontFamily: 'Cormorant Garamond'}}>Tell me friend, which fire shall I set upon the anvil for you?</span>
      </div>
    </div>
  ];

  // Style for the poem text
  const poemStyle = {
    fontFamily: '"Cinzel", serif',
    fontSize: '1.4rem',
    lineHeight: '1.8',
    color: '#e0e0e0',
    marginTop: '1.5rem',
    maxWidth: '800px',
    textAlign: 'center',
    margin: '0 auto',
    padding: '0 1rem'
  };

  // Memoize the message lines to prevent unnecessary re-renders
  const { title, signature, bodyText } = useMemo(() => {
    const bodyContent = messageLines.slice(1, -1).filter(Boolean).join(' ');
    
    return {
      title: (
        <h1 className="welcome-title" aria-label="Welcome, Adventurer">
          <span className="welcome-text">Welcome, </span>
          <span 
            className={`adventurer-text color-${colorIndex} ${isClicked ? 'glow' : ''}`}
            onClick={handleTextClick}
            style={{ cursor: 'pointer' }}
          >
            Adventurer.
          </span>
        </h1>
      ),
      bodyText: bodyContent,
      signature: (
        <div style={{...poemStyle, marginTop: '2rem', fontStyle: 'italic'}}>
          {messageLines[messageLines.length - 1]}
        </div>
      )
    };
  }, [isClicked, colorIndex, messageLines, handleTextClick]);

  // Dynamic gradient based on mouse position
  useEffect(() => {
    if (containerRef.current) {
      const gradient = `linear-gradient(
        45deg,
        #9d4edd,
        #b07aff,
        #cba6ff,
        #9d4edd,
        #b07aff
      )`;
      containerRef.current.style.setProperty('--adventurer-gradient', gradient);
    }
  }, [mousePosition]);

  return (
    <div 
      className="welcome-message" 
      ref={(node) => {
        welcomeRef.current = node;
        containerRef.current = node;
      }}
      style={{
        '--adventurer-gradient': 'linear-gradient(45deg, #9d4edd, #b07aff, #cba6ff, #9d4edd, #b07aff)'
      }}
    >
      {title}
      
      <div className="welcome-underline">
        <img 
          src={underlineImage} 
          alt="" 
          className="underline-image"
        />
      </div>
      
      {isVisible && (
        <Suspense fallback={null}>
          <div className="welcome-body">
            <div style={{ ...poemStyle, margin: '0 auto', maxWidth: '800px' }}>
              <ScrollReveal
                baseOpacity={0}
                revealDistance="20px"
                animationDuration={0.8}
                delay={0.2}
                triggerOnce
              >
                <BlurText text={bodyText} />
              </ScrollReveal>
            </div>
          </div>
          
          <p className="welcome-signature">
            {signature}
          </p>
          
          <div className="next-button-container">
              <button 
                className="next-button"
                onClick={() => {
                  navigate('/about');
                }}
              >
                <img 
                  src={nextButtonImage} 
                  alt="Next" 
                  className="next-button-image"
                />
              </button>
          </div>
        </Suspense>
      )}
    </div>
  );
};

export default WelcomeMessage;
