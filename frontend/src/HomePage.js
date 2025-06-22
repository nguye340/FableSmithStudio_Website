import React from 'react';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="home-page">
      <h1>Welcome to FableSmith Studio</h1>
      <p className="tagline">Fables aren't found. They are forged.</p>
      
      <div className="home-content">
        <div className="feature-section">
          <h2>Heart O' Nightmares</h2>
          <p>Our debut roguelite adventure where your spellcasting skills determine your fate.</p>
          <div className="cta-buttons">
            <a href="/games" className="primary-btn">Explore Our Games</a>
            <a href="/about" className="secondary-btn">Learn More</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;