import { useEffect, useRef } from 'react';

const ParticleEffects = () => {
  const particlesContainerRef = useRef(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const lastEmitTime = useRef(0);
  const isHovering = useRef(false);
  const hoverTarget = useRef(null);
  const particles = useRef([]);

  // Create a single particle
  const createParticle = (x, y) => {
    if (!particlesContainerRef.current) return null;
    
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    
    // Random size between 2px and 6px
    const size = 2 + Math.random() * 4;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    
    // Random opacity between 0.4 and 0.9
    particle.style.opacity = 0.4 + Math.random() * 0.5;
    
    particlesContainerRef.current.appendChild(particle);
    
    // Remove particle after animation completes
    setTimeout(() => {
      if (particle.parentNode) {
        particle.parentNode.removeChild(particle);
      }
    }, 1500);
    
    return particle;
  };

  // Create attract particle
  const createAttractParticle = (x, y, targetX, targetY) => {
    if (!particlesContainerRef.current) return null;
    
    const particle = document.createElement('div');
    particle.className = 'attract-particle';
    particle.style.setProperty('--target-x', (targetX - x).toFixed(2));
    particle.style.setProperty('--target-y', (targetY - y).toFixed(2));
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    
    particlesContainerRef.current.appendChild(particle);
    
    // Remove particle after animation completes
    setTimeout(() => {
      if (particle.parentNode) {
        particle.parentNode.removeChild(particle);
      }
    }, 1200);
    
    return particle;
  };

  // Handle mouse move
  const handleMouseMove = (e) => {
    mousePos.current = { x: e.clientX, y: e.clientY };
    
    // Emit particles along the cursor trail
    const now = Date.now();
    if (now - lastEmitTime.current > 50) { // Limit emission rate
      createParticle(e.clientX, e.clientY);
      lastEmitTime.current = now;
    }
    
    // If hovering over target, create attract particles
    if (isHovering.current && hoverTarget.current) {
      const rect = hoverTarget.current.getBoundingClientRect();
      const targetX = rect.left + rect.width / 2;
      const targetY = rect.top + rect.height / 2;
      
      if (Math.random() > 0.7) { // Randomize emission
        createAttractParticle(e.clientX, e.clientY, targetX, targetY);
      }
    }
  };

  // Handle mouse enter/leave for the target
  const handleMouseEnter = (e) => {
    isHovering.current = true;
    hoverTarget.current = e.currentTarget;
  };

  const handleMouseLeave = () => {
    isHovering.current = false;
    hoverTarget.current = null;
  };

  useEffect(() => {
    // Create particles container if it doesn't exist
    if (!document.getElementById('particles-container')) {
      const container = document.createElement('div');
      container.id = 'particles-container';
      container.className = 'cursor-particles';
      document.body.appendChild(container);
      particlesContainerRef.current = container;
    } else {
      particlesContainerRef.current = document.getElementById('particles-container');
    }

    // Add event listeners
    window.addEventListener('mousemove', handleMouseMove);
    
    // Find the rive container and add hover events
    const riveContainer = document.querySelector('.rive-container');
    if (riveContainer) {
      riveContainer.addEventListener('mouseenter', handleMouseEnter);
      riveContainer.addEventListener('mouseleave', handleMouseLeave);
    }

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      
      if (riveContainer) {
        riveContainer.removeEventListener('mouseenter', handleMouseEnter);
        riveContainer.removeEventListener('mouseleave', handleMouseLeave);
      }
      
      // Clean up particles container if empty
      if (particlesContainerRef.current && particlesContainerRef.current.children.length === 0) {
        document.body.removeChild(particlesContainerRef.current);
      }
    };
  }, []);

  return null; // This component doesn't render anything
};

export default ParticleEffects;
