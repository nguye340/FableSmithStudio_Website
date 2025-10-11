import React, { useState, useEffect, useRef } from 'react';
import './GamesPage.css';
import titleImage from './assets/HeartONightmare-tittle-purple.png';
import ImageSlideshow from './components/ImageSlideshow';
import CircularGallery from './components/CircularGallery';
import ToolsSection from './components/ToolsSection/ToolsSection';
import PageBackground from './components/PageBackground/PageBackground';
import SparkleEffect from './components/SparkleEffect';
import SparkleTrail from './components/SparkleTrail';

function GamesPage() {
  const [hoveredImage, setHoveredImage] = useState(null);
  const imageRefs = useRef({});

  const handleImageHover = (index, isHovering) => {
    if (isHovering) {
      const element = imageRefs.current[`image-${index}`];
      if (element) {
        const rect = element.getBoundingClientRect();
        setHoveredImage({
          index,
          bounds: {
            top: rect.top + window.scrollY,
            left: rect.left + window.scrollX,
            width: rect.width,
            height: rect.height
          }
        });
      }
      setHoveredImage(null);
    }
  };

  return (
    <PageBackground>
      <SparkleTrail count={15} size={40} />
      <div className="games-page-container" opacity={0.3} brightness={0.3} contrast={1.1}>
      <div className="games-page">
        {/* Hero Section */}
        <div className="games-hero-section">
          <div className="games-hero-content">
            <div className="games-hero-title-container">
              <img 
                src={titleImage} 
                alt="Heart O' Nightmares" 
                className="games-hero-title-image" 
                onError={(e) => {
                  console.error('Error loading title image:', e.target.src);
                  e.target.style.display = 'none';
                }}
              />
            </div>
            <p className="games-hero-subtitle">A dreamlike journey through fear, memory, and forgotten magic</p>
            <div className="games-hero-buttons">
              <a 
                href="https://fablesmiths.itch.io/heart-o-nightmare" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="games-hero-button itch-button"
              >
                Update on Itch.io
              </a>
              <button className="games-hero-button learn-button">
                Learn More
              </button>
            </div>
          </div>
        </div>

        {/* Concept and Narrative Section */}
        <div className="game-details-section">
          <div className="game-details-content">
            <h2 className="section-title">Concept and Narrative</h2>
            <div className="concept-narrative-grid">
              {/* The Vision Column */}
              <div className="concept-column">
                <div className="concept-slideshow">
                  <ImageSlideshow 
                    images={[
                      '/games-page/bed-urska-full.png',
                      '/games-page/image79.png',
                      '/games-page/image82.png',
                      '/games-page/image76.png'
                    ]} 
                    alt="The Vision"
                  />
                </div>
                <h3 className="concept-subtitle">The Vision</h3>
                <div className="concept-text">
                  <p>True safety isn't about hiding. It's about facing what haunts you.
                  Having entered into the Safe in Our World 2024 Game jam, we hope
                  to convey that "safety" isn't just a place - it's a struggle.</p>
                  <p>In the story, Urska locks away memories and fears, warping
                  protectors into threats. The game challenges players to break free
                  from false security, unlocking the truth hidden in nightmares.</p>
                </div>
              </div>
              
              {/* The World Column */}
              <div className="concept-column">
                <div className="concept-slideshow">
                  <ImageSlideshow 
                    images={[
                      '/games-page/world1.png',
                      '/games-page/entryWay.png',
                      '/games-page/tav-bg.png',
                      '/games-page/MapLayout_SmallVillage.png'
                    ]} 
                    alt="The World"
                  />
                </div>
                <h3 className="concept-subtitle">The World</h3>
                <div className="concept-text">
                  <p>Each region reflects a deep-seated fear, overgrown playgrounds
                  haunted by lingering laughter, enchanted forests that trap lost souls,
                  and ancient homes where household spirits twist into vengeful
                  guardians. Time is fractured, memories bleed into reality, and nothing
                  stays the same for long.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Game Mechanics Section */}
        <div className="game-mechanics-section">
          <div className="game-mechanics-content">
            <h2 className="section-title">Game Mechanics</h2>
            
            {/* Featured Video - Prominently displayed */}
            <div className="mechanics-featured-video">
              <div className="video-spotlight" style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', maxWidth: '100%' }}>
                <YouTubeVideoEmbed 
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    border: 0
                  }} 
                  videoId="i4u0_fzbd1Q"
                />
              </div>
            </div>
            
            {/* Game Mechanics Cards */}
            <div className="mechanics-cards-container">
              <div className="mechanics-card">
                <div className="mechanics-card-icon spell-icon"></div>
                <h3>Spell Combat System</h3>
                <p>Create and customize your own spells by combining different elements and effects. Experiment with various combinations to discover powerful spells that suit your playstyle.</p>
                <div className="mechanics-card-images">
                  <div className="mechanics-card-image">Spell Creation</div>
                  <div className="mechanics-card-image">Element Mixing</div>
                </div>
              </div>
              
              <div className="mechanics-card">
                <div className="mechanics-card-icon enemy-icon"></div>
                <h3>Advanced Enemy AI</h3>
                <p>Face intelligent enemies that adapt to your combat style. Bosses have multiple phases with unique attack patterns that require different strategies to overcome.</p>
                <div className="mechanics-card-images">
                  <div className="mechanics-card-image">Boss Phases</div>
                  <div className="mechanics-card-image">AI Behaviors</div>
                </div>
              </div>
              
              <div className="mechanics-card">
                <div className="mechanics-card-icon quest-icon"></div>
                <h3>Dialogue & Quest System</h3>
                <p>Your choices matter in conversations and quests. Build relationships with NPCs and make decisions that affect the story and world around you.</p>
                <div className="mechanics-card-images">
                  <div className="mechanics-card-image">Dialogue Choices</div>
                  <div className="mechanics-card-image">Story Branches</div>
                </div>
              </div>
            </div>
            
            {/* Mechanics Screenshots Gallery */}
            <div className="mechanics-screenshots-section">
              <h3 className="screenshots-title">Game Mechanics in Action</h3>
              <div className="screenshots-gallery">
                <div className="screenshot-item">
                  <div className="screenshot-image" style={{backgroundImage: `url(${require('./assets/games-page/spell.png')})`}}></div>
                  <div className="screenshot-caption">Spell Combat System</div>
                </div>
                <div className="screenshot-item">
                  <div className="screenshot-image" style={{backgroundImage: `url(${require('./assets/games-page/boss-fight.png')})`}}></div>
                  <div className="screenshot-caption">Enemy AI in Action</div>
                </div>
                <div className="screenshot-item">
                  <div className="screenshot-image" style={{backgroundImage: `url(${require('./assets/games-page/Dialogue2.png')})`}}></div>
                  <div className="screenshot-caption">Dialogue System</div>
                </div>
                <div className="screenshot-item">
                  <div className="screenshot-image" style={{backgroundImage: `url(${require('./assets/games-page/environment.png')})`}}></div>
                  <div className="screenshot-caption">Game Environment</div>
                </div>
              </div>
            </div>
            <ToolsSection />
          </div>
        </div>

        {/* Art Exploration Section */}
        <div className="art-exploration-section">
          <div className="art-gallery">
            <div className="section-header">
              <h2 className="section-title">Art & Model Exploration</h2>
              <p className="section-subtitle">Drag to explore the collection</p>
            </div>
            <div style={{ height: '800px', position: 'relative' }}>
              <CircularGallery 
                items={[
                  { 
                    image: require('./assets/games-page/AlmaColorScheme.png'), 
                    text: 'Color Palette' 
                  },
                  { 
                    image: require('./assets/games-page/alma-model.png'), 
                    text: '3D Player Model' 
                  },
                  { 
                    image: require('./assets/games-page/benhard-concept.png'), 
                    text: 'Character Art' 
                  },
                  { 
                    image: require('./assets/games-page/benhard-model.png'), 
                    text: '3D Character Model' 
                  },
                  { 
                    image: require('./assets/games-page/image76.png'), 
                    text: 'Character Art' 
                  },
                  { 
                    image: require('./assets/games-page/alma-visage.png'), 
                    text: '3D Model' 
                  },
                  { 
                    image: require('./assets/games-page/environment.png'), 
                    text: 'Environment' 
                  },
                  { 
                    image: require('./assets/games-page/entryWay.png'), 
                    text: 'Entry Way' 
                  },
                  { 
                    image: require('./assets/games-page/MapLayout_SmallVillage.png'), 
                    text: 'Small Village Map' 
                  },
                  { 
                    image: require('./assets/games-page/bed-urska.png'), 
                    text: 'Bedroom Scene' 
                  },
                  { 
                    image: require('./assets/games-page/tilly-urska-doll.png'), 
                    text: '3D Creature' 
                  },
                  { 
                    image: require('./assets/games-page/enemy-model.png'), 
                    text: '3D Creature' 
                  },
                  { 
                    image: require('./assets/games-page/image-creatures.png'), 
                    text: 'Creatures' 
                  }
                ].map((item, index) => ({
                  ...item,
                  onMouseEnter: () => handleImageHover(index, true),
                  onMouseLeave: () => handleImageHover(index, false),
                  ref: (el) => (imageRefs.current[`image-${index}`] = el)
                }))} 
                bend={3}
                textColor="#ffffff"
                borderRadius={0.05}
                scrollEase={0.02}
              />
              
              {hoveredImage && (
                <SparkleEffect 
                  isHovering={true} 
                  bounds={hoveredImage.bounds} 
                />
              )}
            </div>
          </div>
        </div>

        {/* Copyright Footer */}
        <footer className="copyright-footer">
          <div className="footer-content">
            <p>&copy; {new Date().getFullYear()} Han Nguyen at FableSmith Studio. All rights reserved.</p>
          </div>
        </footer>
      </div>
      </div>
    </PageBackground>
  );
}

function YouTubeVideoEmbed({ style, videoId = 'i4u0_fzbd1Q' }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const iframeRef = useRef(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (iframe) {
      const handleLoad = () => setIsLoaded(true);
      iframe.addEventListener('load', handleLoad, { passive: true });
      return () => iframe.removeEventListener('load', handleLoad);
    }
  }, []);

  // Ensure the video URL is properly formatted
  const videoUrl = `https://www.youtube.com/embed/${videoId}?modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&disablekb=1&autoplay=0`;

  return (
    <div className="youtube-video-container" style={style}>
      <iframe
        ref={iframeRef}
        src={videoUrl}
        title="Heart O' Nightmares Gameplay Preview"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          border: 'none',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
        }}
      />
    </div>
  );
}

export default GamesPage;
