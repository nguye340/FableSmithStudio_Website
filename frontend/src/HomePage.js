import React, { lazy, Suspense } from 'react';
import './HomePage.css';

// Lazy load the WelcomeMessage component
const WelcomeMessage = lazy(() => import('./components/WelcomeMessage'));

const HomePage = () => {
  return (
    <Suspense fallback={<div className="loading-fallback">Loading...</div>}>
      <WelcomeMessage />
    </Suspense>
  );
};

export default HomePage;