import React, { useEffect, useState } from 'react';
import './GamesPage.css';
import LazyImage from './components/LazyImage';
import './components/LazyImage.css';
import abstractBgAbout from './assets/abstract-bg-about.4c61b3e6d04ca2ebed28.svg';

const GamesPage = () => {
  const [magicParticles, setMagicParticles] = useState([]);
  
  // Generate magic particles
  useEffect(() => {
    const particles = [];
    // Create more particles for a richer effect
    for (let i = 0; i < 45; i++) {
      // Create different particle types for varied movement
      const particleType = Math.floor(Math.random() * 3); // 0, 1, or 2
      
      particles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 5 + 2,
        // Faster durations for quicker movement
        duration: Math.random() * 5 + 5,
        delay: Math.random() * 3,
        // Create a flow pattern with different hues
        color: `hsl(${Math.random() * 60 + 260}, 100%, ${Math.random() * 30 + 60}%)`,
        // Different particle types will follow different animation patterns
        particleType: particleType
      });
    }
    setMagicParticles(particles);
  }, []);
  
  // Create floating mist elements
  useEffect(() => {
    const createMistElements = () => {
      const aboutContainer = document.querySelector('.about-page-container');
      if (!aboutContainer) return;
      
      // Clear existing mist elements
      const existingMists = document.querySelectorAll('.floating-mist');
      existingMists.forEach(mist => mist.remove());
      
      // Create new mist elements
      for (let i = 0; i < 8; i++) {
        const mist = document.createElement('div');
        mist.className = 'floating-mist';
        mist.style.left = `${Math.random() * 100}%`;
        mist.style.top = `${Math.random() * 100}%`;
        mist.style.width = `${Math.random() * 300 + 200}px`;
        mist.style.height = `${Math.random() * 300 + 200}px`;
        mist.style.animationDuration = `${Math.random() * 60 + 30}s`;
        mist.style.animationDelay = `${Math.random() * 10}s`;
        aboutContainer.appendChild(mist);
      }
    };
    
    // Add scroll reveal effect
    const addScrollReveal = () => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
          }
        });
      }, { threshold: 0.1 });
      
      document.querySelectorAll('.team-member, .about-heading, .about-text').forEach(el => {
        el.classList.add('reveal-element');
        observer.observe(el);
      });
    };
    
    createMistElements();
    addScrollReveal();
    window.addEventListener('resize', createMistElements);
    
    return () => {
      window.removeEventListener('resize', createMistElements);
    };
  }, []);
  
  return (
    <div className="about-page">
      <div className="about-page-container">
        <div className="about-page-bg-overlay" style={{ backgroundImage: `url(${abstractBgAbout})` }}></div>
        
        {/* Magic particles */}
        {magicParticles.map(particle => (
          <div 
            key={particle.id}
            className={`magic-particle magic-particle-type-${particle.particleType}`}
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              backgroundColor: particle.color,
              animationDuration: `${particle.duration}s`,
              animationDelay: `${particle.delay}s`,
              opacity: 0.4 + (Math.random() * 0.4)
            }}
          />
        ))}
        
        {/* About Fablesmiths Section */}
        <section className="about-fablesmiths-section">
          <div className="about-content">
            <h2 className="about-heading">About Fablesmiths</h2>
            <p className="about-text">
              At Fablesmiths, we forge worlds where your choices shape the story. 
              Born in 2025 from a shared love of storytelling and gamecraft, 
              our mission is simple - breathe life into dreams that empower players to tell their own.
            </p>
          </div>
        </section>
        
        {/* Meet the Fable Smiths Section */}
        <section className="team-section">
          <div className="team-content">
            <h2 className="team-title">Meet the Fable Smiths</h2>
            <p className="team-subtitle">The creative minds behind our debut title...</p>
            
            <div className="team-members">
              {/* Team Member 1 */}
              <div className="team-member">
                <LazyImage 
                  src={require('./assets/profiles/han-blend.png')} 
                  alt="Han Nguyen" 
                  className="member-avatar" 
                  style={{backgroundSize: 'cover'}} 
                />
                <h3 className="member-name">Han Nguyen</h3>
                <p className="member-role">Web & Game Developer (Lead)</p>
                <div className="member-links">
                  <a href="https://www.linkedin.com/in/hanthaonguyen/" target="_blank" rel="noopener noreferrer" className="member-link">LinkedIn</a>
                  <a href="https://github.com/nguye340" target="_blank" rel="noopener noreferrer" className="member-link">GitHub</a>
                </div>
              </div>
              
              {/* Team Member 2 */}
              <div className="team-member">
                <LazyImage 
                  src={require('./assets/profiles/subho-hi.png')} 
                  alt="Shubhodeep Karmakar" 
                  className="member-avatar" 
                  style={{backgroundSize: 'cover'}} 
                />
                <h3 className="member-name">Shubhodeep Karmakar</h3>
                <p className="member-role">Game Developer</p>
                <div className="member-links">
                  <a href="https://www.linkedin.com/in/shubhodeep-karmakar/" target="_blank" rel="noopener noreferrer" className="member-link">LinkedIn</a>
                  <a href="https://github.com/shubhz2003" target="_blank" rel="noopener noreferrer" className="member-link">GitHub</a>
                </div>
              </div>
              
              {/* Team Member 3 */}
              <div className="team-member">
                <LazyImage 
                  src={require('./assets/profiles/nicole.png')} 
                  alt="Nicole Ocampo" 
                  className="member-avatar" 
                  style={{backgroundSize: 'cover'}} 
                />
                <h3 className="member-name">Nicole Ocampo</h3>
                <p className="member-role">2D Concept Artist</p>
                <div className="member-links">
                  <a href="#" className="member-link">LinkedIn</a>
                  <a href="#" className="member-link">Portfolio</a>
                </div>
              </div>

              {/* Team Member 4 */}
              <div className="team-member">
                <LazyImage 
                  src={require('./assets/profiles/emily.png')} 
                  alt="Emily" 
                  className="member-avatar" 
                  style={{backgroundSize: 'cover'}} 
                />
                <h3 className="member-name">Emily</h3>
                <p className="member-role">Narrative Design</p>
                <div className="member-links">
                  <a href="#" className="member-link">LinkedIn</a>
                  <a href="#" className="member-link">Portfolio</a>
                </div>
              </div>

              {/* Team Member 5 */}
              <div className="team-member">
                <LazyImage 
                  src={require('./assets/profiles/celery-val.png')} 
                  alt="Valerie Wei" 
                  className="member-avatar" 
                  style={{backgroundSize: 'cover'}} 
                />
                <h3 className="member-name">Valerie Wei</h3>
                <p className="member-role">Art Director, 3D Animator</p>
                <div className="member-links">
                  <a href="#" className="member-link">LinkedIn</a>
                  <a href="#" className="member-link">Portfolio</a>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Footer */}
        <footer className="site-footer">
          <div className="footer-content">
            <p className="copyright">Copyright © 2025 Fablesmiths. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default GamesPage;
