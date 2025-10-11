import React, { useState, useEffect, useRef } from 'react';
import './GamesPage.css';
import titleImage from './assets/HeartONightmare-tittle-purple.png';
import spellImage from './assets/games-page/spell.png';
import bossFightImage from './assets/games-page/boss-fight.png';
import dialogueImage from './assets/games-page/Dialogue2.png';
import environmentImage from './assets/games-page/environment.png';
import almaColorScheme from './assets/games-page/AlmaColorScheme.png';
import almaModel from './assets/games-page/alma-model.png';
import benhardConcept from './assets/games-page/benhard-concept.png';
import benhardModel from './assets/games-page/benhard-model.png';
import image76 from './assets/games-page/image76.png';
import almaVisage from './assets/games-page/alma-visage.png';
import entryWay from './assets/games-page/entryWay.png';
import mapLayout from './assets/games-page/MapLayout_SmallVillage.png';
import bedUrska from './assets/games-page/bed-urska.png';
import tillyUrskaDoll from './assets/games-page/tilly-urska-doll.png';
import enemyModel from './assets/games-page/enemy-model.png';
import imageCreatures from './assets/games-page/image-creatures.png';
import image79 from './assets/games-page/image79.png';
import image82 from './assets/games-page/image82.png';
import world1 from './assets/games-page/world1.png';
import tavBg from './assets/games-page/tav-bg.png';
import ImageSlideshow from './components/ImageSlideshow.js';
import CircularGallery from './components/CircularGallery.js';
import ToolsSection from './components/ToolsSection/ToolsSection.js';
import PageBackground from './components/PageBackground/PageBackground.js';
import SparkleEffect from './components/SparkleEffect.js';
import SparkleTrail from './components/SparkleTrail.js';

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
                      bedUrska,
                      image79,
                      image82,
                      image76
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
                      world1,
                      entryWay,
                      tavBg,
                      mapLayout
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
                  <div className="screenshot-image" style={{backgroundImage: `url(${spellImage})`}}></div>
                  <div className="screenshot-caption">Spell Combat System</div>
                </div>
                <div className="screenshot-item">
                  <div className="screenshot-image" style={{backgroundImage: `url(${bossFightImage})`}}></div>
                  <div className="screenshot-caption">Enemy AI in Action</div>
                </div>
                <div className="screenshot-item">
                  <div className="screenshot-image" style={{backgroundImage: `url(${dialogueImage})`}}></div>
                  <div className="screenshot-caption">Dialogue System</div>
                </div>
                <div className="screenshot-item">
                  <div className="screenshot-image" style={{backgroundImage: `url(${environmentImage})`}}></div>
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
                    image: almaColorScheme, 
                    text: 'Color Palette' 
                  },
                  { 
                    image: almaModel, 
                    text: '3D Player Model' 
                  },
                  { 
                    image: benhardConcept, 
                    text: 'Character Art' 
                  },
                  { 
                    image: benhardModel, 
                    text: '3D Character Model' 
                  },
                  { 
                    image: image76, 
                    text: 'Character Art' 
                  },
                  { 
                    image: almaVisage, 
                    text: '3D Model' 
                  },
                  { 
                    image: environmentImage, 
                    text: 'Environment' 
                  },
                  { 
                    image: entryWay, 
                    text: 'Entry Way' 
                  },
                  { 
                    image: mapLayout, 
                    text: 'Small Village Map' 
                  },
                  { 
                    image: bedUrska, 
                    text: 'Bedroom Scene' 
                  },
                  { 
                    image: tillyUrskaDoll, 
                    text: '3D Creature' 
                  },
                  { 
                    image: enemyModel, 
                    text: '3D Creature' 
                  },
                  { 
                    image: imageCreatures, 
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
