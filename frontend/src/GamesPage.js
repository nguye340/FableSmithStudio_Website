import React from 'react';
import './GamesPage.css';
// Import images
import backgroundImage from './assets/HeartONightmare-cleanup-colorgraded3.png';
import titleImage from './assets/HeartONightmare-tittle-purple.png';
import ImageSlideshow from './components/ImageSlideshow';

function GamesPage() {
  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <img 
        src={backgroundImage} 
        alt="Background" 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          objectFit: 'cover',
          opacity: 0.8,
          zIndex: -1,
          pointerEvents: 'none'
        }}
      />
      <div className="games-page">
        {/* Hero Section */}
        <div className="games-hero-section">
          <div className="games-hero-overlay">
            <div className="games-hero-dark-overlay"></div>
          </div>
        <div className="games-hero-content">
          <div className="games-hero-title-container">
            <img src={titleImage} alt="Heart O' Nightmares" className="games-hero-title-image" />
          </div>
          <p className="games-hero-subtitle">A dreamlike journey through fear, memory, and forgotten magic</p>
          <div className="games-hero-buttons">
            <a href="https://fablesmiths.itch.io/heart-o-nightmare" target="_blank" rel="noopener noreferrer" className="games-hero-button itch-button">
              Available on Itch.io
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
                <p>True safety isn't about hiding—it's about facing what haunts you.
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
                <p>Each region reflects a deep-seated fear—overgrown playgrounds
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
            <div className="video-spotlight">
              <div className="video-glow"></div>
              <div className="featured-video">
                <div className="youtube-video-container">
                  <iframe
                    className="gameplay-video"
                    src="https://www.youtube.com/embed/i4u0_fzbd1Q?modestbranding=1&rel=0&controls=1"
                    title="Heart O' Nightmares Gameplay Preview"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen>
                  </iframe>
                </div>
                <h3 className="video-title">Exclusive Gameplay Preview</h3>
                <p className="video-description">Watch Heart O' Nightmares in action and discover the unique gameplay mechanics</p>
              </div>
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

            <div className="mechanics-card">
              <div className="mechanics-card-icon tools-icon"></div>
              <h3>Engine and Tools</h3>
              <p>Built with industry-standard technology to deliver a seamless gaming experience with stunning visuals and immersive audio.</p>
              <ul className="tools-list">
                <li>Unreal Engine 5</li>
                <li>Blender, Maya for 3D Modelling</li>
                <li>Substance Painter & CSP for texturing</li>
                <li>FreeSound.org for music</li>
              </ul>
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
        </div>
      </div>

      {/* Artist Corner Section */}
      <div className="artist-corner-section">
        <div className="artist-corner-content">
          <h2 className="section-title">Artist Corner</h2>
          <div className="art-gallery">
            <div className="art-item">
              <img src={require('./assets/games-page/image76.png')} alt="Character Design" />
            </div>
            <div className="art-item">
              <img src={require('./assets/games-page/image77.png')} alt="Character Design" />
            </div>
            <div className="art-item">
              <img src={require('./assets/games-page/AlmaColorScheme.png')} alt="Alma Color Scheme" />
            </div>
            <div className="art-item">
              <img src={require('./assets/games-page/image-creatures.png')} alt="Environment Concept" />
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Footer */}
      <footer className="copyright-footer">
        <div className="footer-content">
          <p>&copy; {new Date().getFullYear()} FableSmith Studio. All rights reserved.</p>
        </div>
      </footer>
      </div>
    </div>
  );
}

export default GamesPage;
