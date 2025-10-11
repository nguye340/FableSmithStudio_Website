import { useEffect, useRef, useMemo, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger.js';
import './ScrollReveal.css';

// Register ScrollTrigger plugin
let isRegistered = false;

const registerPlugins = () => {
  if (typeof window !== 'undefined' && !isRegistered) {
    gsap.registerPlugin(ScrollTrigger);
    isRegistered = true;
  }
};

// Register immediately if possible
if (typeof window !== 'undefined') {
  registerPlugins();
}

// Throttle function for scroll events
const throttle = (func, limit) => {
  let lastFunc;
  let lastRan;
  return function() {
    const context = this;
    const args = arguments;
    if (!lastRan) {
      func.apply(context, args);
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);
      lastFunc = setTimeout(function() {
        if ((Date.now() - lastRan) >= limit) {
          func.apply(context, args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  };
};

gsap.registerPlugin(ScrollTrigger);

const ScrollReveal = ({
  children,
  scrollContainerRef,
  enableBlur = true,
  baseOpacity = 0.1,
  baseRotation = 3,
  blurStrength = 4,
  containerClassName = '',
  textClassName = '',
  rotationEnd = 'bottom bottom',
  wordAnimationEnd = 'bottom bottom'
}) => {
  const containerRef = useRef(null);
  const animationRef = useRef(null);
  const scrollTriggerRef = useRef(null);

  // Memoize the split text to prevent unnecessary re-renders
  const splitText = useMemo(() => {
    if (typeof children !== 'string') return [];
    
    // Simple word splitting with preservation of whitespace
    const words = [];
    const regex = /(\s+)|(\S+)/g;
    let match;
    
    while ((match = regex.exec(children)) !== null) {
      if (match[1]) { // Whitespace
        words.push(match[1]);
      } else if (match[2]) { // Word
        words.push(
          <span className="word" key={match.index}>
            {match[2]}
          </span>
        );
      }
    }
    
    return words;
  }, [children]);

  // Create animations with useCallback to prevent recreation on every render
  const createAnimations = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;

    const scroller = scrollContainerRef?.current || window;
    
    // Kill any existing animations
    if (animationRef.current) {
      animationRef.current.kill();
      animationRef.current = null;
    }
    
    if (scrollTriggerRef.current) {
      scrollTriggerRef.current.kill();
      scrollTriggerRef.current = null;
    }

    // Use requestAnimationFrame for better performance
    requestAnimationFrame(() => {
      const wordElements = el.querySelectorAll('.word');
      
      // Batch animations using gsap.context for better performance
      const ctx = gsap.context(() => {
        // Container animation
        gsap.fromTo(el, 
          { transformOrigin: '0% 50%', rotate: baseRotation },
          {
            rotate: 0,
            scrollTrigger: {
              trigger: el,
              scroller,
              start: 'top bottom',
              end: rotationEnd,
              scrub: true
            }
          }
        );

        // Word animations
        wordElements.forEach((word, i) => {
          const delay = i * 0.03; // Stagger delay
          
          gsap.fromTo(word,
            { 
              opacity: baseOpacity,
              y: 20,
              ...(enableBlur && { filter: `blur(${blurStrength}px)` })
            },
            {
              opacity: 1,
              y: 0,
              ...(enableBlur && { filter: 'blur(0px)' }),
              duration: 0.8,
              delay,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: el,
                scroller,
                start: 'top bottom-=20%',
                end: wordAnimationEnd,
                scrub: 1,
                once: true
              }
            }
          );
        });
      }, el);

      // Store the context for cleanup
      animationRef.current = ctx;
      
      // Store scroll trigger for cleanup
      scrollTriggerRef.current = ScrollTrigger.getById('scroll-reveal-trigger');
    });
  }, [scrollContainerRef, enableBlur, baseRotation, baseOpacity, rotationEnd, wordAnimationEnd, blurStrength]);

  // Initialize animations
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Ensure plugins are registered
    registerPlugins();
    
    // Create initial animations
    createAnimations();
    
    // Handle window resize with throttling
    const handleResize = throttle(() => {
      ScrollTrigger.refresh();
      createAnimations();
    }, 200);
    
    window.addEventListener('resize', handleResize, { passive: true });
    
    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
      
      // Kill animations and scroll triggers
      if (animationRef.current) {
        animationRef.current.revert();
        animationRef.current = null;
      }
      
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill();
        scrollTriggerRef.current = null;
      }
      
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.trigger === containerRef.current) {
          trigger.kill();
        }
      });
    };
  }, [createAnimations]);

  // Use React.memo to prevent unnecessary re-renders
  const MemoizedContent = useMemo(() => (
    <h2 
      ref={containerRef} 
      className={`scroll-reveal ${containerClassName}`}
      aria-live="polite"
    >
      <p className={`scroll-reveal-text ${textClassName}`}>
        {splitText}
      </p>
    </h2>
  ), [containerClassName, textClassName, splitText]);

  return MemoizedContent;
};

export default ScrollReveal;
