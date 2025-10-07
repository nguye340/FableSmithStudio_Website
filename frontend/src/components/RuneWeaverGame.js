import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import './RuneWeaverGame.css';
import '../fonts.css';
import { PPlusRecognizer } from './PPlusRecognizer';
import underlineSvg from '../assets/hero-page/underline0.svg';

const RuneWeaverGame = () => {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const tutorialCanvasRef = useRef(null);
  const tutorialContextRef = useRef(null);
  const containerRef = useRef(null);
  const recognizerRef = useRef(null);
  const elementRecognizersRef = useRef(null); // New ref for element recognizers
  const animationFrameRef = useRef(null);
  const lastFrameTimeRef = useRef(0);
  
  const [isDrawing, setIsDrawing] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [score, setScore] = useState(0);
  const [wave, setWave] = useState(1);
  const [towerHealth, setTowerHealth] = useState(5); 
  const [creatures, setCreatures] = useState([]);
  const [currentStrokes, setCurrentStrokes] = useState([]);
  const [towerPosition, setTowerPosition] = useState({ x: 0, y: 0 });
  const [isMovingTower, setIsMovingTower] = useState(false); 
  const [feedback, setFeedback] = useState('');
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [towerImage, setTowerImage] = useState(null);
  const [towerDamageImage, setTowerDamageImage] = useState(null);
  const [enemyImages, setEnemyImages] = useState({});
  const [assetsLoaded, setAssetsLoaded] = useState(false); 
  const [towerShake, setTowerShake] = useState(false);
  const [showDamageImage, setShowDamageImage] = useState(false);
  const [spellEffect, setSpellEffect] = useState(null); 
  const [feedbackShake, setFeedbackShake] = useState(false);
  const towerHitSoundRef = useRef(null);
  const hammerClangSoundRef = useRef(null);
  const wallDisappearSoundRef = useRef(null);
  const errorSoundRef = useRef(null);
  const lastMousePositionRef = useRef({ x: 0, y: 0 }); 
  const [isPaused, setIsPaused] = useState(false);
  
  // --- TUTORIAL STATE ---
  const [tutorialMode, setTutorialMode] = useState(false); 
  const [tutorialStep, setTutorialStep] = useState(0); // 0-5 for each element
  const [tutorialPhase, setTutorialPhase] = useState('draw'); // 'draw' or 'test'
  const [tutorialFeedback, setTutorialFeedback] = useState('');
  const [tutorialElements] = useState(['earth', 'fire', 'water', 'plant', 'metal', 'air']);
  const [userTemplates, setUserTemplates] = useState({
    earth: [],
    fire: [],
    water: [],
    plant: [],
    metal: [],
    air: []
  });
  const [tutorialEnemy, setTutorialEnemy] = useState(null);
  
  // --- NEW GAME OPTIONS ---
  const [showSpellChoice, setShowSpellChoice] = useState(false);
  const [useDefaultTemplates, setUseDefaultTemplates] = useState(false);
  const [showFirstWaveInstructions, setShowFirstWaveInstructions] = useState(false);
  const [instructionsTimer, setInstructionsTimer] = useState(null);
  
  // Tutorial canvas drawing handlers
  const [isTutorialDrawing, setIsTutorialDrawing] = useState(false);
  const [tutorialStrokes, setTutorialStrokes] = useState([]);
  
  const handleTutorialMouseDown = useCallback((e) => {
    e.preventDefault();
    const tutorialCanvas = tutorialCanvasRef.current;
    if (!tutorialCanvas || !tutorialContextRef.current) return;
    
    const rect = tutorialCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    console.log("Tutorial mouse down at:", x, y);
    
    // Start a new stroke
    setTutorialStrokes(prev => [...prev, [{x, y}]]);
    setIsTutorialDrawing(true);
    
    // Draw the first point
    const context = tutorialContextRef.current;
    context.beginPath();
    context.moveTo(x, y);
    context.lineTo(x, y);
    context.stroke();
  }, []);
  
  const handleTutorialMouseMove = useCallback((e) => {
    e.preventDefault();
    if (!isTutorialDrawing || !tutorialContextRef.current) return;
    
    const tutorialCanvas = tutorialCanvasRef.current;
    if (!tutorialCanvas) return;
    
    const rect = tutorialCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Add point to current stroke
    setTutorialStrokes(prev => {
      const newStrokes = [...prev];
      const currentStrokeIndex = newStrokes.length - 1;
      if (currentStrokeIndex >= 0) {
        newStrokes[currentStrokeIndex] = [...newStrokes[currentStrokeIndex], {x, y}];
      }
      return newStrokes;
    });
    
    // Draw line to new point
    const context = tutorialContextRef.current;
    context.lineTo(x, y);
    context.stroke();
  }, [isTutorialDrawing]);
  
  const handleTutorialMouseUp = useCallback((e) => {
    e.preventDefault();
    setIsTutorialDrawing(false);
  }, []);
  
  const handleTutorialMouseLeave = useCallback((e) => {
    e.preventDefault();
    setIsTutorialDrawing(false);
  }, []);
  
  const clearTutorialCanvas = useCallback(() => {
    if (!tutorialCanvasRef.current || !tutorialContextRef.current) return;
    
    const canvas = tutorialCanvasRef.current;
    const context = tutorialContextRef.current;
    
    context.clearRect(0, 0, canvas.width, canvas.height);
    setTutorialStrokes([]);
  }, []);
  
  // Memoized element colors and weaknesses
  const elementColors = useMemo(() => ({
    'fire': '#FF5733',
    'water': '#3399FF',
    'earth': '#CD853F',
    'air': '#FFFFFF',
    'metal': '#C0C0C0',
    'plant': '#66CC66'
  }), []);
  
  const elementWeaknesses = useMemo(() => ({
    'fire': 'water',
    'water': 'earth',
    'earth': 'air',
    'air': 'metal',
    'metal': 'plant',
    'plant': 'fire'
  }), []);
  
  // Load game assets
  useEffect(() => {
    console.log("Loading game assets...");
    // Start with assets loaded true to prevent blank screen if assets fail to load
    setAssetsLoaded(true);
    
    const newEnemyImages = {};
    let loadedCount = 0;
    const totalAssets = Object.keys(elementColors).length + 3; // Background, tower, tower damage, and one for each element
    
    const checkAllLoaded = () => {
      loadedCount++;
      console.log(`Asset loaded: ${loadedCount}/${totalAssets}`);
      if (loadedCount >= totalAssets) {
        console.log("All assets loaded!");
        setAssetsLoaded(true);
      }
    };
    
    // Helper for fallback image creation
    function createFallbackImage(width, height, drawFn) {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      drawFn(ctx);
      const img = new Image();
      img.src = canvas.toDataURL();
      return img;
    }

    // Background image
    const bgImg = new Image();
    bgImg.src = '/hero-page/mini-game/minigame_bg0.png';
    bgImg.onload = () => {
      setBackgroundImage(bgImg);
      checkAllLoaded();
    };
    bgImg.onerror = () => {
      setBackgroundImage(createFallbackImage(800, 600, ctx => {
        ctx.fillStyle = '#1a1c46';
        ctx.fillRect(0, 0, 800, 600);
      }));
      checkAllLoaded();
    };

    // Tower image
    const towerImg = new Image();
    towerImg.src = '/hero-page/mini-game/tower-blue-blend-darker.png';
    towerImg.onload = () => {
      setTowerImage(towerImg);
      checkAllLoaded();
    };
    towerImg.onerror = () => {
      setTowerImage(createFallbackImage(150, 150, ctx => {
        ctx.fillStyle = '#3a57af';
        ctx.beginPath();
        ctx.arc(75, 75, 50, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#2a3f7f';
        ctx.fillRect(10, 75, 80, 75);
      }));
      checkAllLoaded();
    };

    // Tower damage image
    const towerDamageImg = new Image();
    towerDamageImg.src = '/hero-page/mini-game/tower-damage.png';
    towerDamageImg.onload = () => {
      setTowerDamageImage(towerDamageImg);
      checkAllLoaded();
    };
    towerDamageImg.onerror = () => {
      setTowerDamageImage(createFallbackImage(150, 150, ctx => {
        ctx.fillStyle = '#FF0000';
        ctx.beginPath();
        ctx.arc(75, 75, 50, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#FFA07A';
        ctx.fillRect(10, 75, 80, 75);
      }));
      checkAllLoaded();
    };

    // Enemy images
    Object.keys(elementColors).forEach(element => {
      const img = new Image();
      img.src = `/hero-page/mini-game/weirdcat-${element}.png`;
      img.onload = () => {
        setEnemyImages(prev => ({ ...prev, [element]: img }));
        checkAllLoaded();
      };
      img.onerror = () => {
        setEnemyImages(prev => ({
          ...prev,
          [element]: createFallbackImage(60, 60, ctx => {
            ctx.fillStyle = elementColors[element] || '#888888';
            ctx.fillRect(0, 0, 60, 60);
          })
        }));
        checkAllLoaded();
      };
    });
    
    // Set a timeout to force assets loaded after 5 seconds to prevent indefinite loading
    const timeoutId = setTimeout(() => {
      if (loadedCount < totalAssets) {
        console.warn(`Not all assets loaded after timeout (${loadedCount}/${totalAssets}). Proceeding anyway.`);
        setAssetsLoaded(true);
      }
    }, 5000);
    
    // Load sounds
    const towerHitSound = new Audio('/sounds/rock-destroy-6409.mp3');
    towerHitSound.volume = 0.3;
    towerHitSoundRef.current = towerHitSound;
    
    const hammerClangSound = new Audio('/sounds/metal_clang.mp3');
    hammerClangSound.volume = 0.4;
    hammerClangSoundRef.current = hammerClangSound;
    
    const wallDisappearSound = new Audio('/sounds/shine1.mp3');
    wallDisappearSound.volume = 0.6;
    wallDisappearSoundRef.current = wallDisappearSound;
    
    const errorSound = new Audio('/sounds/error.mp3');
    errorSound.volume = 0.5;
    errorSoundRef.current = errorSound;
    
    // Cleanup function
    return () => {
      clearTimeout(timeoutId);
      // Cancel any pending loads
      bgImg.onload = null;
      bgImg.onerror = null;
      towerImg.onload = null;
      towerImg.onerror = null;
      towerDamageImg.onload = null;
      towerDamageImg.onerror = null;
      Object.keys(elementColors).forEach(element => {
        if (newEnemyImages[element]) {
          newEnemyImages[element].onload = null;
          newEnemyImages[element].onerror = null;
        }
      });
      towerHitSoundRef.current = null;
      hammerClangSoundRef.current = null;
      wallDisappearSoundRef.current = null;
      errorSoundRef.current = null;
    };
  }, [elementColors]);
  
  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      // Set canvas dimensions to match container
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // Get context and configure
      const context = canvas.getContext('2d');
      context.lineCap = 'round';
      context.lineJoin = 'round';
      context.lineWidth = 5;
      contextRef.current = context;
      
      // Load background image
      const bgImage = new Image();
      bgImage.src = '/hero-page/minigame_bg0.png';
      bgImage.onload = () => {
        setBackgroundImage(bgImage);
      };
      
      // Load tower images
      const towerImg = new Image();
      towerImg.src = '/hero-page/tower-blue-blend-darker.png';
      towerImg.onload = () => {
        setTowerImage(towerImg);
      };
      
      const towerDamageImg = new Image();
      towerDamageImg.src = '/hero-page/tower-damage.png';
      towerDamageImg.onload = () => {
        setTowerDamageImage(towerDamageImg);
      };
      
      // Load enemy images
      const loadEnemyImages = () => {
        const images = {};
        const elements = ['fire', 'water', 'earth', 'air', 'metal', 'plant'];
        
        elements.forEach(element => {
          const img = new Image();
          img.src = `/hero-page/enemy-${element}.png`;
          images[element] = img;
        });
        
        setEnemyImages(images);
      };
      
      loadEnemyImages();
      
      // Initialize recognizer
      recognizerRef.current = new PPlusRecognizer();
    }
    
    // Handle window resize
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
        
        // Reconfigure context after resize
        const context = canvasRef.current.getContext('2d');
        context.lineCap = 'round';
        context.lineJoin = 'round';
        context.lineWidth = 5;
        contextRef.current = context;
      }
      
      // Also resize tutorial canvas if it exists
      if (tutorialCanvasRef.current) {
        const tutorialCanvas = tutorialCanvasRef.current;
        tutorialCanvas.width = tutorialCanvas.clientWidth;
        tutorialCanvas.height = tutorialCanvas.clientHeight;
        
        const tutorialContext = tutorialCanvas.getContext('2d');
        tutorialContext.lineCap = 'round';
        tutorialContext.lineJoin = 'round';
        tutorialContext.lineWidth = 8; // Thicker lines for better visibility
        tutorialContext.strokeStyle = '#6c5ffd';
        tutorialContextRef.current = tutorialContext;
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);
  
  // Initialize tutorial canvas separately
  useEffect(() => {
    const tutorialCanvas = tutorialCanvasRef.current;
    if (tutorialCanvas) {
      // Set canvas dimensions
      tutorialCanvas.width = 600;
      tutorialCanvas.height = 300;
      
      // Get context and configure
      const tutorialContext = tutorialCanvas.getContext('2d');
      tutorialContext.lineCap = 'round';
      tutorialContext.lineJoin = 'round';
      tutorialContext.lineWidth = 8; // Thicker lines for better visibility
      tutorialContext.strokeStyle = '#6c5ffd';
      tutorialContextRef.current = tutorialContext;
      
      console.log('Tutorial canvas initialized:', tutorialCanvas.width, tutorialCanvas.height);
    }
  }, [tutorialMode, tutorialStep, tutorialPhase]);
  
  // Handle mouse move for drawing or moving tower
  const handleMouseMove = useCallback((e) => {
    const { offsetX, offsetY } = e.nativeEvent;
    lastMousePositionRef.current = { x: offsetX, y: offsetY };
    
    // Always update tower position to follow mouse
    if (gameStarted && !gameOver && !gameWon) {
      const canvas = canvasRef.current;
      if (canvas) {
        // Calculate new tower position with boundaries
        const newX = Math.max(60, Math.min(canvas.width - 60, offsetX));
        const newY = Math.max(160, Math.min(canvas.height - 60, offsetY));
        
        // Update tower position
        setTowerPosition({ x: newX, y: newY });
      }
    }
    
    // Handle drawing
    if (isDrawing) {
      // Throttle point collection for better performance
      setCurrentStrokes(prev => {
        if (prev.length === 0) return prev;
        const lastStroke = prev[prev.length - 1];
        if (!lastStroke || lastStroke.length === 0) return prev;
        const lastPoint = lastStroke[lastStroke.length - 1];
        const dx = offsetX - lastPoint.x;
        const dy = offsetY - lastPoint.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Only add points that are at least 5 pixels away from the last point
        if (distance > 5) {
          const updatedStrokes = prev.slice();
          updatedStrokes[updatedStrokes.length - 1] = [...lastStroke, { x: offsetX, y: offsetY }];
          return updatedStrokes;
        }
        return prev;
      });
    }
  }, [isDrawing, gameStarted, gameOver, gameWon]);

  // Handle mouse down for drawing
  const handleMouseDown = useCallback((e) => {
    if (!gameStarted || gameOver || gameWon || isPaused) return;
    
    const { offsetX, offsetY } = e.nativeEvent;
    
    // Play hammer clang sound
    if (hammerClangSoundRef.current) {
      hammerClangSoundRef.current.currentTime = 0;
      hammerClangSoundRef.current.play().catch(err => console.error("Error playing hammer sound:", err));
    }
    
    setIsDrawing(true);
    setCurrentStrokes(prev => [...prev, [{ x: offsetX, y: offsetY }]]);
    lastMousePositionRef.current = { x: offsetX, y: offsetY };
  }, [gameStarted, gameOver, gameWon, isPaused]);

  // Handle mouse up for drawing
  const handleMouseUp = useCallback(() => {
    // Handle drawing completion
    if (isDrawing) {
      setIsDrawing(false);
    }
  }, [isDrawing]);

  // Handle mouse leave
  const handleMouseLeave = useCallback(() => {
    if (isDrawing) {
      setIsDrawing(false);
    }
  }, [isDrawing]);

  // Function to recognize drawing
  const recognizeDrawing = useCallback(() => {
    const allPoints = currentStrokes.filter(stroke => stroke.length > 0).flat();
    if (allPoints.length < 5) {
      setFeedback("Draw a larger pattern!");
      setCurrentStrokes([]);
      return;
    }
    
    // Make sure we have templates
    if (!userTemplates || Object.values(userTemplates).every(points => !points || points.length === 0)) {
      console.error("No templates available");
      
      // Try to load templates from localStorage as a fallback
      const savedTemplates = localStorage.getItem('runeWeaverTemplates');
      if (savedTemplates) {
        try {
          const parsedTemplates = JSON.parse(savedTemplates);
          console.log("Loaded templates from localStorage as fallback:", parsedTemplates);
          
          // Check if we have valid templates
          if (parsedTemplates && Object.values(parsedTemplates).some(points => points && points.length > 0)) {
            // Use the loaded templates for recognition
            return recognizeWithTemplates(allPoints, parsedTemplates);
          }
        } catch (error) {
          console.error("Error parsing saved templates:", error);
        }
      }
      
      setFeedback("Error: No templates available. Complete the tutorial first.");
      setCurrentStrokes([]);
      setIsDrawing(false);
      return;
    }
    
    // Use the current templates for recognition
    return recognizeWithTemplates(allPoints, userTemplates);
  }, [currentStrokes, userTemplates]);
  
  // Helper function to recognize patterns with given templates
  const recognizeWithTemplates = useCallback((allPoints, templates) => {
    console.log("Recognizing pattern in main game:", allPoints);
    console.log("Using templates:", templates);
    
    try {
      // Super simple approach - test each template individually with very forgiving threshold
      const elements = ['earth', 'fire', 'water', 'plant', 'metal', 'air'];
      let bestMatch = null;
      let bestScore = 0;
      
      elements.forEach(element => {
        if (templates[element] && templates[element].length > 0) {
          // Create a single-template recognizer for testing
          const testRecognizer = new PPlusRecognizer();
          testRecognizer.addTemplate(element, templates[element]);
          const testResult = testRecognizer.recognize(allPoints);
          const score = testResult ? testResult.score : 0;
          console.log(`Test result for ${element}:`, score);
          
          // Track best match
          if (score > bestScore) {
            bestMatch = element;
            bestScore = score;
          }
        } else {
          console.log(`No template for ${element}`);
        }
      });
      
      console.log("Best match:", bestMatch, "with score:", bestScore);
      
      // Very forgiving threshold - just 25% match required
      if (bestMatch && bestScore > 0.25) { 
        const element = bestMatch;
        
        // Create a spell effect at the center of the drawn pattern
        const centerX = allPoints.reduce((sum, p) => sum + p.x, 0) / allPoints.length;
        const centerY = allPoints.reduce((sum, p) => sum + p.y, 0) / allPoints.length;
        
        setSpellEffect({
          element: element,
          x: centerX,
          y: centerY,
          timestamp: Date.now(),
          score: bestScore
        });
        
        // Play wall disappear sound
        if (wallDisappearSoundRef.current) {
          wallDisappearSoundRef.current.currentTime = 0;
          wallDisappearSoundRef.current.play().catch(err => console.error("Error playing success sound:", err));
        }
        
        setFeedback(`Cast: ${element.toUpperCase()} (${Math.round(bestScore * 100)}% match)`);
        setFeedbackShake(false);
        
        // Find creatures weak to this element
        const weakCreatures = creatures.filter(c => elementWeaknesses[c.element] === element);
        
        if (weakCreatures.length > 0) {
          // Apply damage to weak creatures
          setCreatures(prev => prev.map(creature => {
            if (elementWeaknesses[creature.element] === element) {
              return {
                ...creature,
                health: creature.health - 50 // Damage amount
              };
            }
            return creature;
          }));
        } else {
          setFeedbackShake(true);
          setFeedback(`No enemies weak to ${element.toUpperCase()}`);
        }
      } else {
        // Play error sound
        if (errorSoundRef.current) {
          errorSoundRef.current.currentTime = 0;
          errorSoundRef.current.play().catch(err => console.error("Error playing error sound:", err));
        }
        
        setFeedbackShake(true);
        setFeedback("Pattern not recognized! Try again.");
      }
    } catch (error) {
      console.error("Error recognizing pattern:", error);
      setFeedback("Error recognizing pattern");
    }
    
    // Clear current strokes
    setCurrentStrokes([]);
    setIsDrawing(false);
  }, [creatures, elementWeaknesses]);
  
  // Handle right click for casting
  const handleContextMenu = useCallback((e) => {
    e.preventDefault();
    if (currentStrokes.length > 0) {
      recognizeDrawing();
    }
    return false;
  }, [currentStrokes, recognizeDrawing]);

  // Optimized draw function
  const drawGame = useCallback(() => {
    const canvas = canvasRef.current;
    const context = contextRef.current;
    if (!canvas || !context) {
      console.error("Canvas or context is null in drawGame");
      return;
    }
    
    // Clear the canvas
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw background
    if (backgroundImage) {
      context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    } else {
      // Fallback background if image isn't loaded
      context.fillStyle = '#1a1c46';
      context.fillRect(0, 0, canvas.width, canvas.height);
      
      // Add some visual interest to the fallback background
      context.fillStyle = '#2a2c66';
      for (let i = 0; i < 50; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const radius = Math.random() * 3 + 1;
        context.beginPath();
        context.arc(x, y, radius, 0, Math.PI * 2);
        context.fill();
      }
    }
    
    // Draw tower with shake effect if active
    const towerX = towerPosition.x + (towerShake ? (Math.random() * 10 - 5) : 0);
    const towerY = towerPosition.y + (towerShake ? (Math.random() * 10 - 5) : 0);
    
    if (showDamageImage && towerDamageImage) {
      // Draw damaged tower
      context.drawImage(
        towerDamageImage,
        towerX - 75,
        towerY - 150,
        150,
        150
      );
    } else if (towerImage) {
      // Draw normal tower
      context.drawImage(
        towerImage,
        towerX - 75,
        towerY - 150,
        150,
        150
      );
    } else {
      // Fallback tower if image isn't loaded
      context.fillStyle = '#3a57af';
      context.beginPath();
      context.arc(towerX, towerY - 75, 50, 0, Math.PI * 2);
      context.fill();
      context.fillStyle = '#2a3f7f';
      context.fillRect(towerX - 40, towerY - 75, 80, 75);
    }
    
    // Draw creatures
    if (creatures.length > 0) {
      creatures.forEach(creature => {
        const enemyImage = enemyImages[creature.element];
        if (enemyImage) {
          const creatureWidth = 80; // Reduced from 120
          const creatureHeight = 80; // Reduced from 120
          context.drawImage(
            enemyImage,
            creature.x - creatureWidth / 2,
            creature.y - creatureHeight / 2,
            creatureWidth,
            creatureHeight
          );
          
          // Draw health bar
          const healthBarWidth = 100; 
          const healthBarHeight = 10; 
          const healthPercentage = creature.health / creature.maxHealth;
          
          context.fillStyle = 'rgba(0, 0, 0, 0.5)';
          context.fillRect(
            creature.x - healthBarWidth / 2,
            creature.y - creatureHeight / 2 - 20, 
            healthBarWidth,
            healthBarHeight
          );
          
          context.fillStyle = elementColors[creature.element] || '#FFFFFF';
          context.fillRect(
            creature.x - healthBarWidth / 2,
            creature.y - creatureHeight / 2 - 20, 
            healthBarWidth * healthPercentage,
            healthBarHeight
          );
        } else {
          // Fallback creature if image isn't loaded
          context.fillStyle = elementColors[creature.element] || '#FFFFFF';
          context.beginPath();
          context.arc(creature.x, creature.y, 40, 0, Math.PI * 2); 
          context.fill();
        }
      });
    }
    
    // Draw tutorial enemy
    if (tutorialEnemy) {
      const enemyImage = enemyImages[tutorialEnemy.element];
      if (enemyImage) {
        const creatureWidth = 80; // Reduced from 120
        const creatureHeight = 80; // Reduced from 120
        context.drawImage(
          enemyImage,
          tutorialEnemy.x - creatureWidth / 2,
          tutorialEnemy.y - creatureHeight / 2,
          creatureWidth,
          creatureHeight
        );
      } else {
        // Fallback creature if image isn't loaded
        context.fillStyle = elementColors[tutorialEnemy.element] || '#FFFFFF';
        context.beginPath();
        context.arc(tutorialEnemy.x, tutorialEnemy.y, 40, 0, Math.PI * 2); 
        context.fill();
      }
    }
    
    // Draw current strokes
    if (currentStrokes.length > 0) {
      context.save();
      context.lineCap = 'round';
      context.lineJoin = 'round';
      context.strokeStyle = '#080b39'; // User line color updated
      context.lineWidth = 20; // Increased thickness for user-drawn lines
      currentStrokes.forEach(stroke => {
        if (stroke.length > 1) {
          context.beginPath();
          context.moveTo(stroke[0].x, stroke[0].y);
          for (let i = 1; i < stroke.length; i++) {
            context.lineTo(stroke[i].x, stroke[i].y);
          }
          context.stroke();
        }
      });
      context.restore();
    }
    
    // Draw spell effect if active
    if (spellEffect && Date.now() - spellEffect.timestamp < 2000) {
      // Calculate animation progress (0 to 1)
      const progress = (Date.now() - spellEffect.timestamp) / 2000;
      const size = 100 + (progress * 100); // Grows from 100px to 200px
      const opacity = 1 - progress; // Fades out
      
      // Get element color
      const color = elementColors[spellEffect.element] || '#FFFFFF';
      
      // Draw expanding circle
      context.globalAlpha = opacity;
      context.beginPath();
      context.arc(spellEffect.x, spellEffect.y, size, 0, Math.PI * 2);
      
      // Create gradient
      const gradient = context.createRadialGradient(
        spellEffect.x, spellEffect.y, 0,
        spellEffect.x, spellEffect.y, size
      );
      gradient.addColorStop(0, color);
      gradient.addColorStop(1, 'transparent');
      
      context.fillStyle = gradient;
      context.fill();
      
      // Draw element name
      context.font = 'bold 24px Arial';
      context.fillStyle = 'white';
      context.textAlign = 'center';
      context.fillText(
        `${spellEffect.element.toUpperCase()} (${Math.round(spellEffect.score * 100)}%)`, 
        spellEffect.x, 
        spellEffect.y - size/2 - 10
      );
      
      // Reset opacity
      context.globalAlpha = 1;
    }
  }, [backgroundImage, towerImage, towerDamageImage, towerPosition, creatures, currentStrokes, enemyImages, elementColors, towerHealth, towerShake, showDamageImage, gameStarted, gameOver, gameWon, isDrawing, spellEffect, tutorialEnemy]);
  
  // Optimized update creatures function
  const updateCreatures = useCallback((deltaTime) => {
    if (gameOver || gameWon || tutorialMode) return;
    
    // Scale movement by delta time for consistent speed regardless of frame rate
    const timeScale = deltaTime / 16.67; 
    
    const updatedCreatures = creatures.map(creature => {
      // Calculate direction to tower
      const dx = towerPosition.x - creature.x;
      const dy = towerPosition.y - creature.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // If creature reached the tower
      if (distance < 40) {
        // Damage tower
        setTowerHealth(prev => {
          const newHealth = prev - 1;
          if (newHealth <= 0) {
            setGameOver(true);
            setFeedback('Tips: Lead the enemy away first, then cast while in a safe spot');
          }
          return newHealth;
        });
        
        // Play hit sound
        if (towerHitSoundRef.current) {
          // Reset sound to beginning if it's already playing
          towerHitSoundRef.current.currentTime = 0;
          towerHitSoundRef.current.play().catch(err => {
            console.error("Error playing tower hit sound:", err);
          });
        }
        
        // Show damage effect
        setTowerShake(true);
        setShowDamageImage(true);
        
        setTimeout(() => {
          setTowerShake(false);
          setShowDamageImage(false);
        }, 500);
        
        // Remove the creature that hit the tower
        return { ...creature, remove: true };
      }
      
      // Check if creature is dead
      if (creature.health <= 0) {
        // Update score
        setScore(prev => prev + 100);
        return { ...creature, remove: true };
      }
      
      // Stationary enemies (practice wave) don't move
      if (creature.speed === 0 || creature.isPractice) {
        return creature;
      }
      
      // Normalize direction vector
      const normalizedDx = distance > 0 ? dx / distance : 0;
      const normalizedDy = distance > 0 ? dy / distance : 0;
      
      // Update position - creatures follow the tower as it moves
      return {
        ...creature,
        x: creature.x + normalizedDx * creature.speed * timeScale,
        y: creature.y + normalizedDy * creature.speed * timeScale
      };
    });
    
    // Remove creatures marked for removal
    const remainingCreatures = updatedCreatures.filter(c => !c.remove);
    
    // Check if all creatures are defeated
    if (remainingCreatures.length === 0) {
      // Check if this was the practice wave
      if (wave === 0) {
        // Start the first real wave
        setWave(1);
        setFeedback("Wave 1 incoming! Defend your tower!");
      }
      // Check if this was the last wave
      else if (wave >= 5) {
        setGameWon(true);
        setFeedback('Victory! You have successfully defended your tower!');
      } else if (wave >= 1) {
        // Spawn next wave
        setWave(prev => prev + 1);
      }
    }
    
    setCreatures(remainingCreatures);
  }, [gameOver, gameWon, creatures, wave, towerPosition, tutorialMode]);
  
  // Optimized game loop with time-based movement
  const gameLoop = useCallback((timestamp) => {
    if (!gameStarted || gameOver || gameWon || isPaused || tutorialMode) return;
    
    // Calculate delta time for smooth animation
    const deltaTime = timestamp - lastFrameTimeRef.current;
    lastFrameTimeRef.current = timestamp;
    
    // Only update if enough time has passed (throttle updates)
    if (deltaTime > 0) {
      updateCreatures(deltaTime);
      drawGame();
    }
    
    // Continue the loop
    animationFrameRef.current = requestAnimationFrame(gameLoop);
  }, [gameStarted, gameOver, gameWon, isPaused, tutorialMode, updateCreatures, drawGame]);
  
  // Start/stop game loop
  useEffect(() => {
    if (gameStarted && !gameOver && !gameWon) {
      console.log("Starting game loop");
      lastFrameTimeRef.current = performance.now();
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    }
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [gameStarted, gameOver, gameWon, gameLoop]);

  // Get element color
  const getElementColor = useCallback((element) => {
    return elementColors[element] || '#FFFFFF';
  }, [elementColors]);
  
  // Get element weakness
  const getWeakness = useCallback((element) => {
    return elementWeaknesses[element] || 'fire';
  }, [elementWeaknesses]);

  // Spawn a wave of creatures
  const spawnWave = useCallback((waveNumber) => {
    console.log(`Spawning wave ${waveNumber}`);
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const newCreatures = [];
    const creatureCount = Math.min(3 + waveNumber, 8); 
    
    // Base speed increases with each wave
    const baseSpeed = 1.5 + (waveNumber * 0.5); 
    
    for (let i = 0; i < creatureCount; i++) {
      // Determine spawn position (from edges of canvas)
      let x, y;
      const side = Math.floor(Math.random() * 3); 
      
      switch (side) {
        case 0: // top
          x = Math.random() * canvas.width;
          y = 20;
          break;
        case 1: // left
          x = 20;
          y = Math.random() * (canvas.height - 100);
          break;
        case 2: // right
          x = canvas.width - 20;
          y = Math.random() * (canvas.height - 100);
          break;
        default:
          x = Math.random() * canvas.width;
          y = 20;
      }
      
      // Determine element type
      const elements = ['fire', 'water', 'earth', 'air', 'metal', 'plant'];
      const element = elements[Math.floor(Math.random() * elements.length)];
      
      // Random speed variation for each creature (80-120% of base speed)
      const speedVariation = 0.8 + (Math.random() * 0.4);
      
      // Create creature
      newCreatures.push({
        x,
        y,
        element,
        health: 100,
        maxHealth: 100,
        speed: baseSpeed * speedVariation,
        weakness: elementWeaknesses[element] || 'fire'
      });
    }
    
    setCreatures(newCreatures);
  }, [elementWeaknesses]);

  useEffect(() => {
    // Only spawn on wave >= 1 and if not game over/won
    if (wave >= 1 && !gameOver && !gameWon && !tutorialMode) {
      spawnWave(wave);
    }
  }, [wave, gameOver, gameWon, spawnWave, tutorialMode]);

  // Toggle fullscreen - optimized with useCallback
  const toggleFullscreen = useCallback(() => {
    const container = containerRef.current;
    
    if (!container) return;
    
    if (!document.fullscreenElement) {
      container.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  }, []);

  // Start a new game
  const startGame = useCallback(() => {
    // Show spell choice screen instead of starting game directly
    setShowSpellChoice(true);
    setGameStarted(true);
    setGameOver(false);
    setGameWon(false);
    setScore(0);
    setTowerHealth(5);
    setCreatures([]);
    
    // Reset drawing state
    setCurrentStrokes([]);
    setIsDrawing(false);
    setFeedbackShake(false);
    
    // Reset tower position
    setTowerPosition({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2
    });
    
    // Reset fullscreen if needed
    if (showFullscreen) {
      toggleFullscreen();
    }
    
    // Unpause game
    setIsPaused(false);
  }, [showFullscreen, toggleFullscreen]);
  
  // Start the actual game after spell choice
  const startActualGame = useCallback((useDefaults) => {
    setShowSpellChoice(false);
    setUseDefaultTemplates(useDefaults);
    
    if (!useDefaults) {
      // Start tutorial mode - no enemies, just template creation
      setWave(0);
      setTutorialMode(true);
      setTutorialStep(0);
      setTutorialPhase('draw');
      setTutorialFeedback('');
      // Initialize empty templates
      setUserTemplates({
        earth: [],
        fire: [],
        water: [],
        plant: [],
        metal: [],
        air: []
      });
      setTutorialEnemy(null);
    } else {
      // Start regular game with default templates
      setWave(1); // Start with wave 1 directly
      setTutorialMode(false);
      
      // Load default templates
      const defaultTemplates = {
        earth: [{x: 100, y: 100}, {x: 150, y: 150}, {x: 200, y: 100}], // Simple zigzag
        fire: [{x: 100, y: 150}, {x: 150, y: 100}, {x: 200, y: 150}], // Inverted zigzag
        water: [{x: 100, y: 100}, {x: 150, y: 150}, {x: 200, y: 150}, {x: 250, y: 100}], // Wave
        plant: [{x: 100, y: 150}, {x: 150, y: 100}, {x: 150, y: 150}, {x: 200, y: 100}], // Leaf
        metal: [{x: 100, y: 100}, {x: 200, y: 100}, {x: 200, y: 200}, {x: 100, y: 200}, {x: 100, y: 100}], // Square
        air: [{x: 150, y: 100}, {x: 100, y: 200}, {x: 200, y: 200}] // Triangle
      };
      
      setUserTemplates(defaultTemplates);
      
      // Show first wave instructions
      setShowFirstWaveInstructions(true);
      
      // Create first wave with enemies
      const firstWaveCreatures = [];
      const elements = ['fire', 'water', 'earth'];
      const positions = [
        { x: window.innerWidth / 2 - 300, y: window.innerHeight / 2 - 100 },
        { x: window.innerWidth / 2, y: window.innerHeight / 2 - 200 },
        { x: window.innerWidth / 2 + 300, y: window.innerHeight / 2 - 100 }
      ];
      
      // Create enemies for first wave
      elements.forEach((element, index) => {
        firstWaveCreatures.push({
          x: positions[index].x,
          y: positions[index].y,
          element: element,
          health: 100,
          maxHealth: 100,
          speed: 0.5, // Slow for first wave
          weakness: elementWeaknesses[element] || 'fire',
          isFirstWave: true // Mark as first wave enemy
        });
      });
      
      setCreatures(firstWaveCreatures);
      
      // Set a timer to hide the instructions after 15 seconds
      const timer = setTimeout(() => {
        setShowFirstWaveInstructions(false);
      }, 15000);
      
      setInstructionsTimer(timer);
    }
    
    // Cleanup function for the instructions timer
    return () => {
      if (instructionsTimer) {
        clearTimeout(instructionsTimer);
      }
    };
  }, [elementWeaknesses]);
  
  // Toggle sidebar - optimized with useCallback
  const toggleSidebar = useCallback(() => {
    setShowSidebar(prev => !prev);
  }, []);

  // Custom styled text component with the fantasy font
  const FantasyText = ({ children, style, ...props }) => (
    <span 
      style={{ 
        fontFamily: '"NightForest", "Cinzel", fantasy',
        ...style
      }} 
      {...props}
    >
      {children}
    </span>
  );

  // Render hearts based on current health
  const renderHearts = useCallback(() => {
    const hearts = [];
    // Import heart image
    const heartImagePath = `${process.env.PUBLIC_URL}/hero-page/mini-game/heart.png`;
    
    for (let i = 0; i < 5; i++) {
      hearts.push(
        <div 
          key={i} 
          style={{
            width: '30px',
            height: '30px',
            margin: '0 3px',
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundImage: `url(${heartImagePath})`,
            filter: i < towerHealth 
              ? 'drop-shadow(0 0 5px rgba(255, 100, 100, 0.7))' 
              : 'grayscale(100%)',
            opacity: i < towerHealth ? 1 : 0.3,
            transform: i < towerHealth ? 'scale(1.1)' : 'scale(0.9)',
            transition: 'all 0.3s ease'
          }}
        ></div>
      );
    }
    return hearts;
  }, [towerHealth]);

  // Element guide icons
  const elementIcons = [
    { name: 'Fire', symbol: '△', color: '#ff5722' },
    { name: 'Water', symbol: '~', color: '#2196f3' },
    { name: 'Earth', symbol: '□', color: '#4caf50' },
    { name: 'Air', symbol: '○', color: '#90caf9' },
    { name: 'Metal', symbol: '✕', color: '#9e9e9e' },
    { name: 'Plant', symbol: '⋀|', color: '#8bc34a' }
  ];

  useEffect(() => {
    if (feedbackShake) {
      const timeout = setTimeout(() => setFeedbackShake(false), 600);
      return () => clearTimeout(timeout);
    }
  }, [feedbackShake]);

  // Function to render game instructions
  const renderInstructions = useCallback(() => {
    return null;
  }, [gameStarted]);
  
  // --- CAPTURE USER TEMPLATE ---
  const handleTutorialDraw = useCallback(() => {
    const allPoints = tutorialStrokes.filter(stroke => stroke.length > 0).flat();
    if (allPoints.length < 5) {
      setTutorialFeedback('Draw a larger pattern!');
      clearTutorialCanvas();
      return;
    }
    
    console.log(`Saving template for ${tutorialElements[tutorialStep]}:`, allPoints);
    
    // Save the user's template
    setUserTemplates(prev => ({
      ...prev,
      [tutorialElements[tutorialStep]]: allPoints
    }));
    
    console.log("Updated user templates:", userTemplates);
    
    // Move to test phase
    setTutorialPhase('test');
    setTutorialFeedback(`Now test your ${tutorialElements[tutorialStep].toUpperCase()} rune by drawing it again.`);
    
    // Create a dummy enemy with weakness to the current element
    setTutorialEnemy({
      element: Object.entries(elementWeaknesses).find(([_, weakness]) => weakness === tutorialElements[tutorialStep])?.[0] || 'fire',
      x: 400,
      y: 150,
      health: 100,
      maxHealth: 100
    });
    
    // Clear current strokes
    clearTutorialCanvas();
  }, [tutorialStrokes, tutorialStep, tutorialElements, elementWeaknesses, clearTutorialCanvas]);

  // Handle tutorial test phase
  const handleTutorialTest = useCallback(() => {
    const allPoints = tutorialStrokes.filter(stroke => stroke.length > 0).flat();
    if (allPoints.length < 5) {
      setTutorialFeedback('Draw a larger pattern!');
      clearTutorialCanvas();
      return;
    }
    
    console.log("Testing pattern:", allPoints);
    
    // Recognize with only the current template
    const element = tutorialElements[tutorialStep];
    console.log("Current element being tested:", element);
    console.log("Template for this element:", userTemplates[element]);
    
    // Create a fresh recognizer for this test to avoid interference
    const recognizer = new PPlusRecognizer();
    
    // Add ONLY the template for the current element
    if (userTemplates[element] && userTemplates[element].length > 0) {
      recognizer.addTemplate(element, userTemplates[element]);
      console.log(`Added template for ${element} to test recognizer`);
      
      // Try to recognize the drawn pattern
      const result = recognizer.recognize(allPoints);
      console.log("Recognition result:", result);
      
      // Super forgiving threshold for tutorial (25%)
      if (result && result.name === element && result.score > 0.25) {
        // Play success sound
        if (wallDisappearSoundRef.current) {
          wallDisappearSoundRef.current.currentTime = 0;
          wallDisappearSoundRef.current.play().catch(err => console.error("Error playing success sound:", err));
        }
        
        // Create a spell effect
        const centerX = allPoints.reduce((sum, p) => sum + p.x, 0) / allPoints.length;
        const centerY = allPoints.reduce((sum, p) => sum + p.y, 0) / allPoints.length;
        
        setSpellEffect({
          element: element,
          x: centerX,
          y: centerY,
          timestamp: Date.now(),
          score: result.score
        });
        
        setTutorialFeedback(`Great! Your ${element.toUpperCase()} rune works! (${Math.round(result.score * 100)}% match)`);
        
        // "Damage" the tutorial enemy if it's weak to this element
        if (tutorialEnemy && elementWeaknesses[tutorialEnemy.element] === element) {
          setTutorialEnemy(prev => ({
            ...prev,
            health: prev.health - 50
          }));
          
          // If enemy is defeated, move to next element
          setTimeout(() => {
            setTutorialEnemy(null);
            
            if (tutorialStep < tutorialElements.length - 1) {
              // Move to next element
              setTutorialStep(tutorialStep + 1);
              setTutorialPhase('draw');
              setTutorialFeedback('');
            } else {
              // Tutorial complete - start the game with user templates
              setTutorialFeedback('Tutorial complete! Starting game with your custom runes.');
              
              // Log all templates for debugging
              console.log("FINAL TEMPLATES:", userTemplates);
              
              // Delay before starting actual game
              setTimeout(() => {
                setTutorialMode(false);
                startGame();
              }, 2000);
            }
          }, 1500);
        }
      } else {
        // Play error sound for unrecognized pattern
        if (errorSoundRef.current) {
          errorSoundRef.current.currentTime = 0;
          errorSoundRef.current.play().catch(err => console.error("Error playing error sound:", err));
        }
        
        setTutorialFeedback('Try again! Draw your rune as you defined it.');
      }
    } else {
      setTutorialFeedback('Error: No template saved. Please go back to the drawing phase.');
      console.error("No template found for element:", element);
    }
    
    // Clear current strokes
    clearTutorialCanvas();
  }, [tutorialStrokes, tutorialStep, tutorialElements, userTemplates, tutorialEnemy, elementWeaknesses, startGame, clearTutorialCanvas]);

  // --- TUTORIAL UI ---
  const renderTutorial = () => {
    if (!tutorialMode || !gameStarted) return null;
    
    const element = tutorialElements[tutorialStep];
    return (
      <div className="tutorial-overlay">
        <div className="tutorial-content">
          <h2>Rune Tutorial: {element.toUpperCase()}</h2>
          
          {tutorialPhase === 'draw' ? (
            <div className="tutorial-instructions">
              <p>Draw your version of the {element.toUpperCase()} rune below.</p>
              <p className="tutorial-hint">Try to make it memorable and easy to reproduce!</p>
              <div className="tutorial-canvas-container">
                <canvas 
                  ref={tutorialCanvasRef} 
                  className="tutorial-canvas" 
                  width="600"
                  height="300"
                  onMouseDown={handleTutorialMouseDown} 
                  onMouseMove={handleTutorialMouseMove} 
                  onMouseUp={handleTutorialMouseUp} 
                  onMouseLeave={handleTutorialMouseLeave}
                />
              </div>
              <div className="tutorial-buttons">
                <button 
                  className="control-button start-button" 
                  onClick={handleTutorialDraw}
                >
                  Save Template
                </button>
                <button 
                  className="control-button restart-button" 
                  onClick={clearTutorialCanvas}
                >
                  Clear Canvas
                </button>
                <button 
                  className="control-button default-button" 
                  onClick={() => {
                    // Use default templates and skip tutorial
                    setTutorialMode(false);
                    startActualGame(true);
                  }}
                  style={{marginTop: '15px', backgroundColor: '#4a9d4a'}}
                >
                  Use Default Templates
                </button>
              </div>
              <div className="default-templates-label" style={{marginTop: '15px', fontWeight: 'bold', textAlign: 'center'}}>
                Default Templates Available
              </div>
            </div>
          ) : (
            <div className="tutorial-instructions">
              <p>Now test your {element.toUpperCase()} rune by drawing it again.</p>
              <p className="tutorial-hint">Draw it just like you did before!</p>
              <p className="tutorial-hint">The enemy shown is weak to {element.toUpperCase()}.</p>
              <div className="tutorial-canvas-container">
                <canvas 
                  ref={tutorialCanvasRef} 
                  className="tutorial-canvas" 
                  width="600"
                  height="300"
                  onMouseDown={handleTutorialMouseDown} 
                  onMouseMove={handleTutorialMouseMove} 
                  onMouseUp={handleTutorialMouseUp} 
                  onMouseLeave={handleTutorialMouseLeave}
                />
              </div>
              <div className="tutorial-buttons">
                <button 
                  className="control-button start-button" 
                  onClick={handleTutorialTest}
                >
                  Test Rune
                </button>
                <button 
                  className="control-button restart-button" 
                  onClick={clearTutorialCanvas}
                >
                  Clear Canvas
                </button>
              </div>
            </div>
          )}
          
          {tutorialFeedback && (
            <div className="tutorial-feedback">
              {tutorialFeedback}
            </div>
          )}
          
          <div className="tutorial-progress">
            {tutorialElements.map((elem, index) => (
              <div 
                key={elem} 
                className={`tutorial-step ${index === tutorialStep ? 'active' : ''} ${index < tutorialStep ? 'completed' : ''}`}
              >
                {elem.charAt(0).toUpperCase()}
              </div>
            ))}
          </div>
          
          <button 
            className="control-button restart-button" 
            onClick={() => {
              setTutorialMode(false);
              startGame();
            }}
          >
            Skip Tutorial
          </button>
        </div>
      </div>
    );
  };

  // Add localStorage persistence for templates
  useEffect(() => {
    // Try to load saved templates from localStorage
    const savedTemplates = localStorage.getItem('runeWeaverTemplates');
    if (savedTemplates) {
      try {
        const parsedTemplates = JSON.parse(savedTemplates);
        console.log("Loaded templates from localStorage:", parsedTemplates);
        setUserTemplates(parsedTemplates);
      } catch (error) {
        console.error("Error parsing saved templates:", error);
      }
    }
  }, []);
  
  // Save templates whenever they change
  useEffect(() => {
    if (userTemplates && Object.values(userTemplates).some(points => points && points.length > 0)) {
      console.log("Saving templates to localStorage:", userTemplates);
      localStorage.setItem('runeWeaverTemplates', JSON.stringify(userTemplates));
    }
  }, [userTemplates]);

  // Set SVG as CSS variable
  useEffect(() => {
    document.documentElement.style.setProperty('--underline-svg', `url(${underlineSvg})`);
  }, []);

  return (
    <div 
      ref={containerRef} 
      className={`game-container ${showFullscreen ? 'fullscreen' : ''}`}
    >
      {/* Game Canvas */}
      <canvas
        ref={canvasRef}
        className={`game-canvas ${gameStarted ? 'active' : 'inactive'}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onContextMenu={handleContextMenu}
      />
      
      {/* Sidebar */}
      {false && showSidebar && (
        <div className="game-sidebar">
          <h3 className="sidebar-title">Rune Patterns</h3>
          <div className="rune-patterns">
            <div className="rune-item">
              <div className="rune-symbol fire-rune"></div>
              <span>Fire</span>
            </div>
            <div className="rune-item">
              <div className="rune-symbol water-rune"></div>
              <span>Water</span>
            </div>
            <div className="rune-item">
              <div className="rune-symbol earth-rune"></div>
              <span>Earth</span>
            </div>
            <div className="rune-item">
              <div className="rune-symbol air-rune"></div>
              <span>Air</span>
            </div>
            <div className="rune-item">
              <div className="rune-symbol metal-rune"></div>
              <div className="rune-symbol plant-rune"></div>
              <span>Metal</span>
            </div>
            <div className="rune-item">
              <div className="rune-symbol plant-rune"></div>
              <span>Plant</span>
            </div>
          </div>
          
          <div className="game-instructions">
            <h3>How to Play</h3>
            <p>Move your mouse to control the tower and evade enemies.</p>
            <p>Click and drag to draw runes and cast spells.</p>
            <p>Each creature is weak to a specific element.</p>
            <p>Defend your tower through 5 waves to win!</p>
          </div>
        </div>
      )}
      
      {/* Game Controls */}
      <div className="game-controls">
        <button 
          className="control-button toggle-fullscreen-button" 
          onClick={toggleFullscreen}
        >
          {showFullscreen ? 'EXIT FULLSCREEN' : 'FULLSCREEN'}
        </button>
        <button 
          className={`control-button pause-button ${isPaused ? 'paused' : ''}`}
          onClick={() => setIsPaused(p => !p)}
        >
          {isPaused ? 'RESUME' : 'PAUSE'}
        </button>
        <button 
          className="control-button restart-game-button"
          onClick={() => {
            setGameStarted(false);
            setGameOver(false);
            setGameWon(false);
            setScore(0);
            setWave(1);
            setTowerHealth(5);
            setCreatures([]);
            setCurrentStrokes([]);
            setIsPaused(false);
          }}
        >
          RESTART
        </button>
      </div>
      
      {/* Game UI Overlays */}
      {!gameStarted && (
        <div className="game-start">
          {/* Floating particles for magical effect */}
          <div className="particle" style={{ top: '20%', left: '30%' }}></div>
          <div className="particle" style={{ top: '70%', left: '80%' }}></div>
          <div className="particle" style={{ top: '40%', left: '60%' }}></div>
          <div className="particle" style={{ top: '80%', left: '20%' }}></div>
          <div className="particle" style={{ top: '30%', left: '70%' }}></div>
          <div className="particle" style={{ top: '60%', left: '40%' }}></div>
          <div className="particle" style={{ top: '50%', left: '10%' }}></div>
          <div className="particle" style={{ top: '10%', left: '50%' }}></div>
          <div className="particle" style={{ top: '90%', left: '90%' }}></div>
          <div className="particle" style={{ top: '25%', left: '85%' }}></div>
          <div className="particle" style={{ top: '75%', left: '25%' }}></div>
          <div className="particle" style={{ top: '15%', left: '45%' }}></div>
          
          <h1 className="game-title" style={{fontFamily: 'NightForest', fontSize: '4rem', color: 'Coral' }}>
            Rune Defender
          </h1>
          <p className="game-subtitle" style={{fontFamily: 'NightForest', fontSize: '2.8rem', marginBottom: '5px' }}>
            Cast your customized spells and defend your tower!
          </p>
          <p className="normal-text">
            A sneak peek of the spell recognition system from our upcoming 3D roguelite <strong>Heart O' Nightmares</strong>
          </p>
          <div className="button-container">
            <button 
              onClick={startGame}
              className="start-button"
            >
              Start Game
            </button>
          </div>
          <div className="copyright-notice" style={{ marginTop: '50px' }}>
            <p>Created by <span className="creator-name">Han Nguyen</span> &copy; 2025</p>
          </div>
        </div>
      )}
      
      {/* Spell Choice Screen */}
      {showSpellChoice && (
        <div className="game-overlay spell-choice-overlay">
          <h2 className="spell-choice-title" style={{fontFamily: 'NightForest', fontSize: '3rem', color: '#f1975b'}}>
            Choose Your Spell Style
          </h2>
          <div className="spell-choice-options">
            <div className="spell-choice-option">
              <h3 style={{fontFamily: 'cuteNcuddly', fontSize: '2rem', marginBottom: '20px'}}>Draw Your Own Spells</h3>
              <p style={{maxWidth: '400px', marginBottom: '30px'}}>Create your own unique spell patterns for each element. You'll go through a tutorial to draw each spell symbol.</p>
              <button 
                onClick={() => startActualGame(false)}
                className="control-button custom-spells-button"
                style={{padding: '12px 30px', fontSize: '1.5rem'}}
              >
                Custom Spells
              </button>
            </div>
            <div className="spell-choice-option">
              <h3 style={{fontFamily: 'cuteNcuddly', fontSize: '2rem', marginBottom: '20px'}}>Use Default Spells</h3>
              <p style={{maxWidth: '400px', marginBottom: '30px'}}>Jump right into combat using pre-defined spell patterns for each element.</p>
              <div className="default-templates-label" style={{marginBottom: '15px', fontWeight: 'bold'}}>
                Default Templates:
              </div>
              <div className="default-templates-preview" style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '20px'}}>
                {Object.keys(elementColors).map(element => (
                  <div key={element} className="default-template-item" style={{margin: '5px', textAlign: 'center'}}>
                    <div className={`rune-symbol ${element}-rune`} style={{margin: '0 auto'}}></div>
                    <span style={{textTransform: 'capitalize'}}>{element}</span>
                  </div>
                ))}
              </div>
              <button 
                onClick={() => startActualGame(true)}
                className="control-button default-spells-button"
                style={{padding: '12px 30px', fontSize: '1.5rem'}}
              >
                Use Default
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* First Wave Instructions */}
      {showFirstWaveInstructions && gameStarted && !gameOver && !gameWon && !isPaused && !tutorialMode && (
        <div className="game-overlay instructions-overlay" style={{backgroundColor: 'rgba(0,0,0,0.7)', pointerEvents: 'none'}}>
          <div className="instructions-content" style={{padding: '30px', maxWidth: '600px', backgroundColor: 'rgba(30,20,60,0.9)', borderRadius: '15px', boxShadow: '0 0 30px rgba(138, 43, 226, 0.5)'}}>
            <h2 style={{fontFamily: 'cuteNcuddly', fontSize: '2.5rem', color: '#f1975b', marginBottom: '20px', textAlign: 'center'}}>
              How to Play
            </h2>
            <div className="instruction-item" style={{display: 'flex', alignItems: 'center', marginBottom: '20px'}}>
              <div className="instruction-icon" style={{fontSize: '2rem', marginRight: '15px'}}>🖱️</div>
              <div className="instruction-text">
                <strong style={{color: '#ff82ff'}}>Left Mouse Click + Drag</strong>: Draw your spell pattern
              </div>
            </div>
            <div className="instruction-item" style={{display: 'flex', alignItems: 'center', marginBottom: '20px'}}>
              <div className="instruction-icon" style={{fontSize: '2rem', marginRight: '15px'}}>👆</div>
              <div className="instruction-text">
                <strong style={{color: '#ff82ff'}}>Right Mouse Click</strong>: Cast the spell
              </div>
            </div>
            <div className="instruction-item" style={{display: 'flex', alignItems: 'center', marginBottom: '30px'}}>
              <div className="instruction-icon" style={{fontSize: '2rem', marginRight: '15px'}}>⚔️</div>
              <div className="instruction-text">
                <strong style={{color: '#ff82ff'}}>Enemy Weaknesses</strong>:<br />
                Fire → Water<br />
                Water → Earth<br />
                Earth → Air<br />
                Air → Metal<br />
                Metal → Plant<br />
                Plant → Fire
              </div>
            </div>
            <p style={{textAlign: 'center', fontSize: '1.2rem', opacity: '0.7'}}>These instructions will disappear in a few seconds...</p>
          </div>
        </div>
      )}
      
      {gameOver && (
        <div className="game-overlay game-over">
          <h2 className="game-over-title">
            Game Over
          </h2>
          <p className="game-text">
            Your tower has fallen!
          </p>
          <p className="game-score" style={{bottomMargin: '30px'}}>
            Score: {score}
          </p>
          <button 
            className="control-button restart-game-button" 
            onClick={startGame}
          >
            TRY AGAIN
          </button>
        </div>
      )}
      
      {gameWon && (
        <div className="game-overlay game-won">
          <h2 className="game-won-title">
            Victory!
          </h2>
          <p className="game-text">
            You've successfully defended your tower!
          </p>
          <p className="game-score">
            Final Score: {score}
          </p>
          <button 
            className="control-button restart-game-button" 
            onClick={startGame}
          >
            PLAY AGAIN
          </button>
        </div>
      )}
      
      {isPaused && gameStarted && !gameOver && !gameWon && (
        <div className="pause-overlay">
          <h2 style={{color: '#f1975b', fontSize: '3rem', fontWeight: 'thin'}}>Game Paused</h2>
          <p style={{color: '#fff', fontSize: '1.5rem'}}>Click RESUME to continue</p>
        </div>
      )}
      
      {/* Feedback message with enhanced visibility */}
      {feedback && (
        <div className={`feedback-overlay${feedbackShake ? ' shake-wrong wrong' : ''}`.trim()}>
          {feedback}
        </div>
      )}
      
      {/* Game HUD */}
      {gameStarted && !gameOver && !gameWon && (
        <div className="game-hud">
          <div className="hud-item">
            <span>
              Score: {score}
            </span>
          </div>
          <div className="hud-item">
            <span>
              Wave: {wave}/5
            </span>
          </div>
          <div className="hud-item">
            <span>
              Tower:
            </span>
            <div className="hearts-container">
              {renderHearts()}
            </div>
          </div>
        </div>
      )}

      {/* Tutorial Image Reference */}
      {gameStarted && !gameOver && !gameWon && (
        <div className="tutorial-reference">
          <img 
            src="/hero-page/TutorialVertical.png" 
            alt="Spell Guide" 
          />
        </div>
      )}
      
      {/* Tutorial Mode */}
      {tutorialMode && renderTutorial()}
      
      {/* Game Instructions */}
      {gameStarted && !gameOver && !gameWon && renderInstructions()}
    </div>
  );
};

export default RuneWeaverGame;
