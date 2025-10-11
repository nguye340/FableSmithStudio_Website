import React, { useState, useEffect, useRef, useCallback } from 'react';
import './CustomCursor.css';
// Cursor images for different states
import cursorDefault from '../assets/cursor/cursor-hover.png';
import cursorHover from '../assets/cursor/cursor-hover.png';
import cursorHand from '../assets/cursor/cursor-hand-pointer.png';
import cursorClick from '../assets/cursor/cursor-hand-pointer-click1.png';
import cursorRightClick from '../assets/cursor/cursor.png';

// Throttle function to limit the rate of function execution
const throttle = (func, limit) => {
  let lastFunc;
  let lastRan;
  return function(...args) {
    if (!lastRan) {
      func.apply(this, args);
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(() => {
        if ((Date.now() - lastRan) >= limit) {
          func.apply(this, args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  };
};

const CustomCursor = ({ disableSplash = false }) => {
  // Initialize state with safe defaults for SSR
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [clicked, setClicked] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isInteractive, setIsInteractive] = useState(false);
  const [isRightClick, setIsRightClick] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Initialize window size state with safe defaults for SSR
  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0,
  });

  // Refs for animation frame
  const animationFrameId = useRef();
  const lastPosition = useRef({ x: 0, y: 0 });
  const targetPosition = useRef({ x: 0, y: 0 });
  
  // Throttled event handlers
  const updatePosition = useCallback((x, y) => {
    targetPosition.current = { x, y };
    
    if (!animationFrameId.current) {
      animationFrameId.current = requestAnimationFrame(() => {
        setPosition(targetPosition.current);
        animationFrameId.current = null;
      });
    }
  }, []);

  const onMouseMove = useCallback(throttle((e) => {
    updatePosition(e.clientX, e.clientY);
  }, 16), [updatePosition]); // ~60fps

  const onMouseEnter = useCallback(() => {
    setHidden(false);
  }, []);

  const onMouseLeave = useCallback(() => {
    setHidden(true);
  }, []);

  const onMouseDown = useCallback((e) => {
    if (e.button === 2) { // Right click
      setIsRightClick(true);
    } else {
      // Play cat impact sound on left click after 3 seconds
      const audio = new Audio(process.env.PUBLIC_URL + '/sounds/cat-impact.mp3');
      audio.volume = 0.5; // Set volume to 50%
      
      // Add event listeners for better error handling
      audio.addEventListener('error', (e) => {
        console.error('Audio error:', e);
        console.log('Audio source was:', audio.src);
      });
      
      // Set a timeout to play the sound after 3 seconds
      const playSound = () => {
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.error('Playback failed:', error);
            console.log('Audio source was:', audio.src);
          });
        }
      };
      
      // Set timeout for 1 seconds (1000 milliseconds)
      setTimeout(playSound, 10);
    }
    setClicked(true);
  }, []);

  const onMouseUp = useCallback(() => {
    setClicked(false);
    setIsRightClick(false);
  }, []);

  const onResize = useCallback(() => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }, []);

  useEffect(() => {
    // Set initial window size and mobile state
    const updateWindowSize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial setup
    updateWindowSize();
    
    // Disable custom cursor on mobile devices
    if (window.innerWidth < 768) {
      document.body.classList.remove('custom-cursor-active');
      return;
    }

    // Define the selectors
    const interactiveSelector = 'a, button, input, textarea, [role="button"], [data-cursor="interactive"]';
    const hoverSelector = '[data-cursor="hover"]';

    // Event handlers with proper event delegation
    const handlePointerOver = (event) => {
      if (event.target.closest(interactiveSelector)) {
        setIsInteractive(true);
      } else if (event.target.closest(hoverSelector)) {
        setIsHovering(true);
      }
    };

    const handlePointerOut = (event) => {
      if (event.target.closest(interactiveSelector)) {
        if (!event.relatedTarget || !event.relatedTarget.closest(interactiveSelector)) {
          setIsInteractive(false);
        }
      } else if (event.target.closest(hoverSelector)) {
        if (!event.relatedTarget || !event.relatedTarget.closest(hoverSelector)) {
          setIsHovering(false);
        }
      }
    };

    document.addEventListener('pointerover', handlePointerOver);
    document.addEventListener('pointerout', handlePointerOut);

    return () => {
      document.removeEventListener('pointerover', handlePointerOver);
      document.removeEventListener('pointerout', handlePointerOut);
    };
  }, [setIsInteractive, setIsHovering]);

  const eventOptions = { passive: true };
  
  useEffect(() => {
    // Check if device is mobile
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    // Initial check
    checkIfMobile();
    
    // Add event listeners with passive option where possible
    document.addEventListener('mousemove', onMouseMove, eventOptions);
    document.addEventListener('mouseenter', onMouseEnter, eventOptions);
    document.addEventListener('mouseleave', onMouseLeave, eventOptions);
    document.addEventListener('mousedown', onMouseDown, { passive: false });
    document.addEventListener('mouseup', onMouseUp, eventOptions);
    window.addEventListener('resize', onResize, eventOptions);
    
    // Use event delegation for interactive elements
    const handleMouseOver = (e) => {
      const target = e.target;
      if (target.matches('a, button, [role="button"], [tabindex="0"], input, textarea, select, .interactive')) {
        setIsInteractive(true);
      }
    };
    
    const handleMouseOut = (e) => {
      const target = e.target;
      if (target.matches('a, button, [role="button"], [tabindex="0"], input, textarea, select, .interactive')) {
        setIsInteractive(false);
      }
    };
    
    // Use event delegation on document instead of adding listeners to each element
    document.addEventListener('mouseover', handleMouseOver, eventOptions);
    document.addEventListener('mouseout', handleMouseOut, eventOptions);
    
    // Cleanup function
    return () => {
      cancelAnimationFrame(animationFrameId.current);
      document.removeEventListener('mousemove', onMouseMove, eventOptions);
      document.removeEventListener('mouseenter', onMouseEnter, eventOptions);
      document.removeEventListener('mouseleave', onMouseLeave, eventOptions);
      document.removeEventListener('mousedown', onMouseDown, { passive: false });
      document.removeEventListener('mouseup', onMouseUp, eventOptions);
      window.removeEventListener('resize', onResize, eventOptions);
      document.removeEventListener('mouseover', handleMouseOver, eventOptions);
      document.removeEventListener('mouseout', handleMouseOut, eventOptions);
    };
  }, [onMouseMove, onMouseEnter, onMouseLeave, onMouseDown, onMouseUp, onResize]);

  const getCursorImage = () => {
    if (isRightClick) return cursorRightClick;
    if (clicked) return cursorClick;
    if (isInteractive) return cursorHand;
    if (isHovering) return cursorHover;
    return cursorDefault; // Use default cursor image in normal state
  };

  // Always show the cursor, but with different styles based on state
  const cursorClasses = `custom-cursor ${
    clicked && !disableSplash 
      ? 'custom-cursor--clicked' 
      : isInteractive 
        ? 'custom-cursor--interactive' 
        : isHovering 
          ? 'custom-cursor--hover' 
          : 'custom-cursor--default'
  } ${hidden ? 'custom-cursor--hidden' : ''} ${disableSplash ? 'no-splash' : ''}`;

  // Don't render cursor on mobile
  if (isMobile) return null;

  return (
    <>
      <div
        className={cursorClasses}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          ...(getCursorImage() && { backgroundImage: `url(${getCursorImage()})` }),
        }}
      />
    </>
  );
};

export default CustomCursor;
