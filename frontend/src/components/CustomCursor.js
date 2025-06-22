import React, { useState, useEffect } from 'react';
import './CustomCursor.css';

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [clicked, setClicked] = useState(false);
  const [linkHovered, setLinkHovered] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    // Disable custom cursor on mobile devices
    const isMobile = windowSize.width < 768;
    if (isMobile) {
      document.body.classList.remove('custom-cursor-active');
      return;
    }

    const addEventListeners = () => {
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseenter', onMouseEnter);
      document.addEventListener('mouseleave', onMouseLeave);
      document.addEventListener('mousedown', onMouseDown);
      document.addEventListener('mouseup', onMouseUp);
      document.addEventListener('resize', onResize);
      handleLinkHoverEvents();
    };

    const removeEventListeners = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseenter', onMouseEnter);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('resize', onResize);
      removeLinkHoverEvents();
    };

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

    const handleLinkHoverEvents = () => {
      document.querySelectorAll('a, button, input, textarea, [role="button"]').forEach(el => {
        el.addEventListener('mouseover', () => setLinkHovered(true));
        el.addEventListener('mouseout', () => setLinkHovered(false));
      });
    };

    const removeLinkHoverEvents = () => {
      document.querySelectorAll('a, button, input, textarea, [role="button"]').forEach(el => {
        el.removeEventListener('mouseover', () => setLinkHovered(true));
        el.removeEventListener('mouseout', () => setLinkHovered(false));
      });
    };

    addEventListeners();
    return () => removeEventListeners();
  }, [windowSize.width]);

  const cursorClasses = `custom-cursor ${clicked ? 'custom-cursor--clicked' : ''} ${
    linkHovered ? 'custom-cursor--link-hovered' : ''
  } ${hidden ? 'custom-cursor--hidden' : ''}`;

  // Disable on mobile
  if (windowSize.width < 768) return null;

  return (
    <>
      <div
        className={cursorClasses}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
      />
      <div
        className={`custom-cursor-dot ${clicked ? 'custom-cursor-dot--clicked' : ''} ${
          hidden ? 'custom-cursor-dot--hidden' : ''
        }`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
      />
    </>
  );
};

export default CustomCursor;
