import React, { useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import "./App.css";
import Mist from "./Mist";
import ExcavationReveal from "./ExcavationReveal";
import HomePage from './HomePage';
import GamesPage from './GamesPage';
import AboutPage from './AboutPage';
import ContactPage from './ContactPage';
import CustomCursor from './components/CustomCursor';
import SimpleNav from './components/GooeyNav';

// Main navigation component
function Navigation() {
  const navItems = [
    { label: "Home", href: "/" },
    { label: "Games", href: "/games" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo-link">
        <img src={require('./assets/hero-page/logo-catsmith.svg')} alt="FableSmiths Cat Logo" className="navbar-cat-logo" />
        <div className="navbar-logo">FableSmiths</div>
      </Link>
      <div className="navbar-simple">
        <SimpleNav items={navItems} />
      </div>
    </nav>
  );
}

// Home page component wrapper
function HomePageWrapper() {
  return (
    <div className="App fantasy-bg">
      <Navigation />
      <Mist />
      <div className="content-wrapper">
        <ExcavationReveal 
          title="Fables aren't found. They're forged." 
          subtitle="" 
        />
        <div className="home-section">
          <HomePage />
        </div>
      </div>
    </div>
  );
}

// Games page component wrapper
function GamesPageWrapper() {
  return (
    <div className="App">
      <Navigation />
      <GamesPage />
    </div>
  );
}

// About page component wrapper
function AboutPageWrapper() {
  return (
    <div className="App">
      <Navigation />
      <AboutPage />
    </div>
  );
}

// Contact page component wrapper
function ContactPageWrapper() {
  return (
    <div className="App">
      <Navigation />
      <ContactPage />
    </div>
  );
}

// Main App component
function App() {
  useEffect(() => {
    // Add class to body when component mounts
    document.body.classList.add('custom-cursor-active');
    
    // Remove class when component unmounts
    return () => {
      document.body.classList.remove('custom-cursor-active');
    };
  }, []);

  return (
    <>
      <CustomCursor />
      <Routes>
        <Route path="/" element={<HomePageWrapper />} />
        <Route path="/games" element={<GamesPageWrapper />} />
        <Route path="/about" element={<AboutPageWrapper />} />
        <Route path="/contact" element={<ContactPageWrapper />} />
      </Routes>
    </>
  );
}

export default App;
