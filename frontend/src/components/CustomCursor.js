import React, { useState, useEffect } from 'react';
import './CustomCursor.css';
// Cursor images for different states
import cursorDefault from '../assets/cursor/cursor-hover.png';
import cursorHover from '../assets/cursor/cursor-hover.png';
import cursorHand from '../assets/cursor/cursor-hand-pointer.png';
import cursorClick from '../assets/cursor/cursor-hand-pointer-click1.png';
import cursorRightClick from '../assets/cursor/cursor.png';

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

  // Event handlers
  const onMouseMove = (e) => {
    setPosition({ x: e.clientX, y: e.clientY });
  };

  const onMouseEnter = () => {
    setHidden(false);
  };

  const onMouseLeave = () => {
    setHidden(true);
  };

  const onMouseDown = () => {
    setClicked(true);
  };

  const onMouseUp = () => {
    setClicked(false);
  };

  const onResize = () => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };

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

    const interactiveSelector = 'a, button, input, textarea, [role="button"], [data-cursor="interactive"]';
    const hoverSelector = '[data-cursor="hover"]';

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

    const addEventListeners = () => {
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseenter', onMouseEnter);
      document.addEventListener('mouseleave', onMouseLeave);
      document.addEventListener('mousedown', onMouseDown);
      document.addEventListener('mouseup', onMouseUp);
      document.addEventListener('resize', onResize);
      document.addEventListener('pointerover', handlePointerOver, true);
      document.addEventListener('pointerout', handlePointerOut, true);
    };

    const removeEventListeners = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('resize', onResize);
      document.removeEventListener('pointerover', handlePointerOver, true);
      document.removeEventListener('pointerout', handlePointerOut, true);
    };

    const onMouseUp = () => {
      setClicked(false);
    };

    const onResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    addEventListeners();
    return () => removeEventListeners();
  }, [windowSize.width]);

  const getCursorImage = () => {
    if (isRightClick) return cursorRightClick;
    if (clicked) return cursorClick;
    if (isInteractive) return cursorHand;
    if (isHovering) return cursorHover;
    return cursorDefault;
  };

  const cursorClasses = `custom-cursor ${clicked && !disableSplash ? 'custom-cursor--clicked' : ''} ${
    isInteractive ? 'custom-cursor--interactive' : isHovering ? 'custom-cursor--hover' : ''
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
          backgroundImage: `url(${getCursorImage()})`,
        }}
      />
    </>
  );
};

export default CustomCursor;
