import React from 'react';
import './AboutPage.css';
import { FaLinkedin, FaGithub, FaGlobe } from 'react-icons/fa';
import LightRays from './components/LightRays';
import ProfilePicture from './components/ProfilePicture';

const AboutPage = () => {
  // Add scroll reveal effect
  React.useEffect(() => {
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
    
    return () => {
      // Cleanup if needed
    };
  }, []);
  
  return (
    <div className="about-page">
      <div className="about-page-container">
        <div style={{ 
          width: '100%', 
          height: '600px', 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          zIndex: 1,
          pointerEvents: 'none'
        }}>
          <LightRays
            raysOrigin="top-center"
            raysColor="#9d4edd"
            raysSpeed={1.2}
            lightSpread={0.8}
            rayLength={1.2}
            followMouse={true}
            mouseInfluence={0.1}
            noiseAmount={0.1}
            distortion={0.05}
          />
        </div>
        
        {/* About Fablesmiths Section */}
        <section className="about-fablesmiths-section">
          <div className="about-content">
            <h2 className="about-heading">Our Mission</h2>
            <p className="about-text">
              Fablesmiths began in 2025 with one belief - stories shouldn't be told <em>to</em> you, but <em>through</em> you. Our developers, artists, and writers work side by side with heart, focus, and expertise to build worlds that respond, challenge, and reach <em>you</em>.</p>
          </div>
        </section>
        
        {/* Meet the Fable Smiths Section */}
        <section className="team-section">
          <div className="team-content">
            {/*<h2 className="team-title">Meet the Fable Smiths</h2>*/}
            <div className="team-members">
              <div className="team-members-row">
                {/* Team Member 1 - Han */}
                <div className="team-member">
                  <ProfilePicture 
                    src={require('./assets/profiles/profiles-framed/profile-frame-han.png')} 
                    alt="Han Nguyen"
                    className="member-avatar-framed"
                  />
                  <div className="member-info">
                    <h3 className="member-name">Han Nguyen</h3>
                    <p className="member-role">Web & Game Developer (Lead)</p>
                    <div className="member-links">
                      <a href="https://www.linkedin.com/in/hanthaonguyen/" target="_blank" rel="noopener noreferrer" className="member-link" aria-label="LinkedIn">
                        <FaLinkedin className="social-icon" />
                      </a>
                      <a href="https://github.com/nguye340" target="_blank" rel="noopener noreferrer" className="member-link" aria-label="GitHub">
                        <FaGithub className="social-icon" />
                      </a>
                    </div>
                  </div>
                </div>
                
                {/* Team Member 2 - Shubhodeep */}
                <div className="team-member">
                  <ProfilePicture 
                    src={require('./assets/profiles/profiles-framed/profile-frame-shub.png')} 
                    alt="Shubhodeep Karmakar"
                    className="member-avatar-framed"
                  />
                  <div className="member-info">
                    <h3 className="member-name">Shubhodeep Karmakar</h3>
                    <p className="member-role">Game Developer</p>
                    <div className="member-links">
                      <a href="https://www.linkedin.com/in/shubhodeep-karmakar/" target="_blank" rel="noopener noreferrer" className="member-link" aria-label="LinkedIn">
                        <FaLinkedin className="social-icon" />
                      </a>
                      <a href="https://github.com/shubhz2003" target="_blank" rel="noopener noreferrer" className="member-link" aria-label="GitHub">
                        <FaGithub className="social-icon" />
                      </a>
                    </div>
                  </div>
                </div>
                
                {/* Team Member 3 - Nicole */}
                <div className="team-member">
                  <ProfilePicture 
                    src={require('./assets/profiles/profiles-framed/profile-frame-nicole.png')} 
                    alt="Nicole Ocampo"
                    className="member-avatar-framed"
                  />
                  <div className="member-info">
                    <h3 className="member-name">Nicole Ocampo</h3>
                    <p className="member-role">2D Concept Artist</p>
                    <div className="member-links">
                      <a href="https://www.linkedin.com/in/ocampo-nicole/" target="_blank" rel="noopener noreferrer" className="member-link" aria-label="LinkedIn">
                        <FaLinkedin className="social-icon" />
                      </a>
                    </div>
                  </div>
                </div>

                {/* Team Member 4 - Emily */}
                <div className="team-member">
                  <ProfilePicture 
                    src={require('./assets/profiles/profiles-framed/profile-frame-emi.png')} 
                    alt="Emily"
                    className="member-avatar-framed"
                  />
                  <div className="member-info">
                    <h3 className="member-name">Emily</h3>
                    <p className="member-role">Narrative Design</p>
                    <div className="member-links">
                      <a href="https://discord.com/users/BicycleBell" target="_blank" rel="noopener noreferrer" className="member-link" aria-label="Discord">
                        <i className="fab fa-discord social-icon"></i>
                      </a>
                    </div>
                  </div>
                </div>

                {/* Team Member 5 - Valerie */}
                <div className="team-member">
                  <ProfilePicture 
                    src={require('./assets/profiles/profiles-framed/profile-frame-val.png')} 
                    alt="Valerie Wei"
                    className="member-avatar-framed"
                  />
                  <div className="member-info">
                    <h3 className="member-name">Valerie Wei</h3>
                    <p className="member-role">Art Director, 3D Animator</p>
                    <div className="member-links">
                      <a href="https://www.linkedin.com/in/valerie-wei-art/" target="_blank" rel="noopener noreferrer" className="member-link" aria-label="LinkedIn">
                        <FaLinkedin className="social-icon" />
                      </a>
                      <a href="#" className="member-link" aria-label="Portfolio">
                        <FaGlobe className="social-icon" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Footer */}
        <footer className="site-footer">
          <div className="footer-content">
            <p className="copyright">Copyright © {new Date().getFullYear()} Han Nguyen at FableSmith Studio. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AboutPage;
