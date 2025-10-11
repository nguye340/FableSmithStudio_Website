import React, { useState, useEffect, useCallback, useMemo, lazy, Suspense, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Rive, useRive, useStateMachineInput } from '@rive-app/react-canvas';
import './WelcomeMessage.css';
import catsmithRiv from '../assets/hero-page/catsmith4.riv';
import ParticleEffects from './ParticleEffects.js';

// Lazy load heavy components with dynamic imports
const BlurText = lazy(() => import(/* webpackPrefetch: true */ './BlurText.js'));

// Lazy load ScrollReveal with GSAP initialization
const ScrollReveal = lazy(async () => {
  // Load GSAP and ScrollTrigger in parallel
  const [gsap, ScrollTriggerModule] = await Promise.all([
    import('gsap/dist/gsap.js'),
    import('gsap/ScrollTrigger.js')
  ]);
  
  // Register ScrollTrigger plugin if gsap is available
  if (gsap && gsap.registerPlugin) {
    gsap.registerPlugin(ScrollTriggerModule.default || ScrollTriggerModule);
  }
  
  // Import the ScrollReveal component
  return import('./ScrollReveal.js');
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
  
  // Handle next button click - navigate to Games page
  const handleNextClick = useCallback(() => {
    navigate('/games');
  }, [navigate]);
  
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

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
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

    document.addEventListener('click', handleGlobalClick, { passive: true });
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
      <div className="poem-line">
        <span className="highlight-text" style={{fontFamily: 'Cormorant Garamond'}}>You stand at FableSmiths' forge,</span>
      </div>
      <div className="poem-line">
        <span className="highlight-text" style={{fontFamily: 'Cormorant Garamond'}}>where every tale awaits like iron in the fire.</span>
      </div>
      <div className="poem-line">
        <span className="highlight-text" style={{fontFamily: 'Cormorant Garamond'}}>Stay a while, listen to the embers, dream.</span>
      </div>
      <div className="poem-line empty-line"></div>
      <div className="poem-line">
        <span className="highlight-text" style={{fontFamily: 'Cormorant Garamond'}}>Perhaps a spark will find you.</span>
      </div>
      <div className="poem-line">
        <span className="highlight-text" style={{fontFamily: 'Cormorant Garamond'}}>Or, if you already carry one,</span>
      </div>
      <div className="poem-line" style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
        <span className="highlight-text glass-shine" style={{fontFamily: 'Cinzel', fontWeight: 'extra bold'}}><strong>Which fire shall I set upon the anvil for you?</strong></span>
        <button
          className="next-button"
          onClick={handleNextClick}
          aria-label="Next"
        >
          <span className="arrow-icon">&gt;</span>
          <span className="arrow-icon hover">&gt;&gt;</span>
        </button>
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

  // Rive animation setup with error handling
  const { rive, RiveComponent } = useRive(
    {
      src: catsmithRiv, // Using imported Rive file
      autoplay: true,
      stateMachines: 'State Machine 1',
    },
    {
      // Rive options
      fitCanvasToArtboardHeight: true,
      useOffscreenRenderer: false, // Try disabling offscreen renderer
    }
  );

  // Trigger Rive animation on any click in the hero section
  const handleHeroClick = useCallback((e) => {
    // Don't trigger if clicking on the next button to avoid conflicts
    if (e.target.closest('.next-button')) {
      return;
    }
    
    if (rive) {
      // Reset and play the animation
      rive.play();
      const inputs = rive.stateMachineInputs('State Machine 1');
      if (inputs && inputs.length > 0) {
        // Assuming the first input is the trigger
        const trigger = inputs[0];
        if (trigger && typeof trigger.fire === 'function') {
          trigger.fire();
        }
      }
    }
  }, [rive]);

  // Log Rive loading state and errors
  useEffect(() => {
    if (rive) {
      console.log('Rive instance created:', rive);
      
      const handleLoad = () => {
        console.log('Rive animation loaded successfully');
      };
      
      const handleError = (error) => {
        console.error('Rive error:', error);
        console.error('Error details:', {
          name: error.name,
          message: error.message,
          stack: error.stack
        });
      };
      
      rive.on('load', handleLoad);
      rive.on('error', handleError);
      
      // Clean up
      return () => {
        rive.off('load', handleLoad);
        rive.off('error', handleError);
        rive.cleanup();
      };
    }
  }, [rive]);

  return (
    <div 
      className="welcome-message" 
      onClick={handleHeroClick}
      ref={(node) => {
        welcomeRef.current = node;
        containerRef.current = node;
      }}
      style={{
        cursor: 'pointer',
        '--adventurer-gradient': 'linear-gradient(45deg, #9d4edd, #b07aff, #cba6ff, #9d4edd, #b07aff)'
      }}
    >
      <ParticleEffects />
      <div className="welcome-text-container">
        <div className="rive-container rive-container-with-particles">
          <RiveComponent />
        </div>
        <div className="text-content">
          {title}
          <Suspense fallback={null}>
            <div className="welcome-body" style={{ ...poemStyle, margin: '0 auto', maxWidth: '800px' }}>
              <ScrollReveal
                baseOpacity={0}
                revealDistance="20px"
                animationDuration={0.8}
                delay={0.2}
              >
                <BlurText text={bodyText} />
              </ScrollReveal>
            </div>
            <div className="welcome-signature">
              {signature}
            </div>
          </Suspense>
        </div>
      </div>
    </div>
  );
};
export default WelcomeMessage;
