import React from 'react';
import './GamesPage.css';
import RuneWeaverDefense from '../../components/games/RuneWeaverDefense';

const GamesPage = () => {
  return (
    <div className="games-page">
      <h1>Games</h1>
      <div className="games-container">
        <RuneWeaverDefense />
        {/* Add other games here */}
      </div>
    </div>
  );
};

export default GamesPage;
