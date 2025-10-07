import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRive } from "@rive-app/react-canvas";
import "./ExcavationReveal.css";
import backgroundReveal from "./assets/hero-page/hero_background.svg";
import WelcomeMessage from "./components/WelcomeMessage";

const ExcavationReveal = ({ title, subtitle }) => {
  const [revealLevel, setRevealLevel] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const containerRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Update mobile state on window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const { RiveComponent, rive } = useRive({
    src: require('./assets/hero-page/catsmith3.riv'),
    autoplay: true,
    stateMachines: ["State Machine 1"],
    onLoad: () => {
      console.log('Rive animation loaded successfully!');
      try {
        if (!rive) {
          console.log('Rive instance not available in onLoad');
          return;
        }
        
        // Add a small delay to ensure the Rive instance is fully ready
        setTimeout(() => {
          try {
            const stateMachineName = "State Machine 1";
            const inputs = rive.stateMachineInputs(stateMachineName);
            
            if (!inputs || !Array.isArray(inputs) || inputs.length === 0) {
              console.log('No state machine inputs found');
              return;
            }
            
            console.log('Available state machine inputs:', 
              inputs.map((input, index) => ({
                index,
                name: input?.name || 'unnamed',
                type: input?.type || 'unknown',
                value: input?.value
              }))
            );
          } catch (error) {
            console.error('Error in Rive onLoad handler:', error);
          }
        }, 100);
      } catch (error) {
        console.error('Error in Rive onLoad:', error);
      }
    },
    onStateChange: (event) => {
      if (event?.data) {
        console.log('Rive state changed:', event.data);
      }
    },
    onError: (error) => {
      console.error('Error loading Rive animation:', error);
    }
  });

  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // Add your effect logic here
  }, []);

  const handleClick = useCallback(() => {
    console.log('Click detected, attempting to trigger cat strike...');
    
    if (!rive) {
      console.log('Rive instance not available yet');
      return;
    }

    // Update the reveal state first
    setIsRevealed(prev => !prev);

    // Function to safely get state machine inputs
    const getStateMachineInputs = () => {
      try {
        const stateMachineName = "State Machine 1";
        return rive.stateMachineInputs(stateMachineName) || [];
      } catch (error) {
        console.warn('Error getting state machine inputs:', error);
        return [];
      }
    };

    // Function to safely trigger animation
    const triggerAnimation = () => {
      try {
        if (typeof rive.play === 'function') {
          if (rive.animationNames?.length > 0) {
            rive.play(rive.animationNames[0]);
          } else {
            rive.play();
          }
        }
      } catch (error) {
        console.warn('Error triggering animation:', error);
      }
    };

    // Try to use state machine inputs first
    try {
      const inputs = getStateMachineInputs();
      
      if (inputs.length > 0) {
        const cursorClickInput = inputs.find(input => 
          input && 
          typeof input === 'object' && 
          input.name === 'CursorWasClicked' && 
          'value' in input
        );
        
        if (cursorClickInput) {
          console.log('Triggering cursor click animation via state machine');
          
          // Use requestAnimationFrame for better timing
          requestAnimationFrame(() => {
            try {
              cursorClickInput.value = true;
              
              // Reset after animation frame
              requestAnimationFrame(() => {
                try {
                  cursorClickInput.value = false;
                } catch (error) {
                  console.warn('Error resetting cursor click input:', error);
                }
              });
            } catch (error) {
              console.warn('Error setting cursor click input:', error);
              // Fallback to direct animation if state machine fails
              triggerAnimation();
            }
          });
          
          return;
        }
      }
      
      // Fallback to direct animation if no valid state machine inputs found
      console.log('No valid state machine inputs found, using direct animation');
      triggerAnimation();
      
    } catch (error) {
      console.error('Error in click handler:', error);
      // Final fallback to direct animation
      triggerAnimation();
    }
  }, [rive]);
  
  // Add a cleanup effect for any resources
  useEffect(() => {
    return () => {
      // Cleanup any ongoing animations or timeouts
      if (rive && typeof rive.stop === 'function') {
        rive.stop();
      }
    };
  }, [rive]);
  return (
    <div className="hero-container" ref={containerRef}>
      <div className={`hero-excavation ${isMobile ? 'mobile-view' : ''}`} onClick={handleClick}>
        <div className="hero-overlay" style={{ opacity: 1 }} />
        <div className="content-container">
          <div className="rive-container">
            <RiveComponent className="rive-animation" />
          </div>
          <div className="welcome-message-container">
            <WelcomeMessage />
          </div>
        </div>
        <div className={`hero-overlay ${isFading ? 'fading' : ''}`} />
        {/* Temporarily hiding the instruction text
        {revealLevel < 1 && (
          <div className="hero-instruction">
            Click to unveil the forge
          </div>
        )} */}
      </div>
    </div>
  );
}

export default ExcavationReveal;
