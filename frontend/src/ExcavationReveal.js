import React, { useState, useEffect, useRef } from "react";
import { useRive } from "rive-react";
import "./ExcavationReveal.css";
import "./fonts.css";
import backgroundImage from "./assets/hero-page/heroBG.png";
import { ReactComponent as LogoCatsmith } from "./assets/hero-page/logo-catsmith.svg";

const ExcavationReveal = ({ title, subtitle }) => {
  const [revealed, setRevealed] = useState(false);
  const [cracks, setCracks] = useState([]);
  const [clickCount, setClickCount] = useState(0);
  const [mistyBlobs, setMistyBlobs] = useState([]);
  const [navbarMistBlobs, setNavbarMistBlobs] = useState([]);
  const containerRef = useRef(null);
  
  // Use Rive with state machine
  const { RiveComponent, rive } = useRive({
    src: require('./assets/hero-page/catsmith.riv'),
    autoplay: true,
    stateMachines: "State Machine 1",
  });
  
  useEffect(() => {
    // Generate random elements when component loads
    // Generate orbs instead of cracks
    const newOrbs = [];
    for (let i = 0; i < 15; i++) {
      // Create more varied sizes - some big, some medium, some small
      let sizeCategory;
      const randomValue = Math.random();
      if (randomValue < 0.2) {
        // 20% chance for large orbs
        sizeCategory = 1.5 + Math.random() * 1.0; // 1.5-2.5
      } else if (randomValue < 0.6) {
        // 40% chance for medium orbs
        sizeCategory = 0.8 + Math.random() * 0.5; // 0.8-1.3
      } else {
        // 40% chance for small orbs
        sizeCategory = 0.3 + Math.random() * 0.4; // 0.3-0.7
      }
      
      newOrbs.push({
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: sizeCategory,
        delay: Math.random() * 3, // More varied animation delay
        duration: 15 + Math.random() * 20 // Longer durations for slower upward flow
      });
    }
    setCracks(newOrbs); // Still using the cracks state but for orbs
    
    // Generate fireflies with different colors
    const newMistyBlobs = [];
    const colors = ['pink', 'salmon', 'paleyellow', 'lightpurpleblue', 'orangered'];
    
    for (let i = 0; i < 30; i++) { 
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      newMistyBlobs.push({
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: 4 + Math.random() * 10, 
        opacity: 0.2 + Math.random() * 0.5,
        animationDuration: 10 + Math.random() * 20, 
        glowDuration: 2 + Math.random() * 4,
        color: randomColor
      });
    }
    setMistyBlobs(newMistyBlobs);
    
    // Generate navbar mist blobs
    const newNavbarMistBlobs = [];
    for (let i = 0; i < 12; i++) {
      newNavbarMistBlobs.push({
        top: Math.random() * 100,
        left: `${Math.random() * 100}%`,
        size: 30 + Math.random() * 100,
        opacity: 0.1 + Math.random() * 0.2,
        animationDuration: 15 + Math.random() * 30
      });
    }
    setNavbarMistBlobs(newNavbarMistBlobs);
  }, []);

  // Handle wall clicks (separate from Rive clicks)
  const handleWallClick = () => {
    if (clickCount < 3) {
      const newCount = clickCount + 1;
      setClickCount(newCount);
      
      // On the 3rd click, reveal the content
      if (newCount === 3) {
        setTimeout(() => {
          setRevealed(true);
        }, 1500);
      }
    } else if (!revealed) {
      setRevealed(true);
    }
  };

  // Handle hover effect for misty blobs
  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Add a class to misty blobs near the cursor
    const blobElements = document.querySelectorAll('.misty-blob');
    blobElements.forEach(blob => {
      const blobRect = blob.getBoundingClientRect();
      const blobCenterX = blobRect.left + blobRect.width / 2 - rect.left;
      const blobCenterY = blobRect.top + blobRect.height / 2 - rect.top;
      
      const distance = Math.sqrt(
        Math.pow(x - blobCenterX, 2) + 
        Math.pow(y - blobCenterY, 2)
      );
      
      if (distance < 150) {
        blob.classList.add('dispelling');
      } else {
        blob.classList.remove('dispelling');
      }
    });
  };

  return (
    <div 
      className="excavation-container" 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onClick={handleWallClick}
    >
      {/* Rive animation layer - now on top with its own click handling */}
      <div className="rive-container">
        <RiveComponent />
      </div>
      
      {/* Wall layer */}
      <div 
        className={`wall ${clickCount > 0 ? 'cracking' : ''} ${revealed ? 'revealed' : ''}`}
        style={{ backgroundImage: `url(${require('./assets/hero-page/ImprovedWallShort1.png')})` }}
      >
        {/* Navbar mist effect */}
        <div className="navbar-mist">
          {navbarMistBlobs.map((blob, index) => (
            <div 
              key={`nav-blob-${index}`}
              className="navbar-mist-blob"
              style={{
                top: `${blob.top}%`,
                left: blob.left,
                width: `${blob.size}px`,
                height: `${blob.size}px`,
                opacity: blob.opacity,
                animationDuration: `${blob.animationDuration}s`
              }}
            />
          ))}
        </div>
        
        {!revealed && (
          <div className="click-instruction">
            {clickCount === 0 ? "Click to Reveal" : `Click ${3 - clickCount} more times to reveal`}
          </div>
        )}
        
        {/* Orbs that appear on clicks */}
        {clickCount > 0 && cracks.slice(0, clickCount * 5).map((orb, index) => (
          <div 
            key={`orb-${index}`}
            className="orb"
            style={{
              top: `${orb.top}%`,
              left: `${orb.left}%`,
              transform: `scale(${orb.size})`,
              animationDelay: `${orb.delay}s`,
              animationDuration: `${orb.duration}s`
            }}
          />
        ))}
      </div>
      
      {/* Hidden content underneath */}
      <div className="hidden-content">
        <div 
          className="magical-background" 
          style={{ backgroundImage: `url(${require('./assets/hero-page/heroBG.png')})` }}
        />
        
        {/* Fireflies that can be dispelled */}
        {mistyBlobs.map((blob, index) => (
          <div 
            key={`blob-${index}`}
            className={`misty-blob firefly-${blob.color}`}
            style={{
              top: `${blob.top}%`,
              left: `${blob.left}%`,
              width: `${blob.size}px`,
              height: `${blob.size}px`,
              opacity: blob.opacity,
              animationDuration: `${blob.animationDuration}s, ${blob.glowDuration}s`
            }}
          />
        ))}
        
        <div className={`text-reveal ${revealed ? 'visible' : ''}`}>
          <div className="logo-container">
            <LogoCatsmith className="logo" />
          </div>
          <h1 className="reveal-title">{title}</h1>
          <h2 className="reveal-subtitle">{subtitle}</h2>
        </div>
      </div>
    </div>
  );
};

export default ExcavationReveal;
