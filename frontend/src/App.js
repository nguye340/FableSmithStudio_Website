import React, { Suspense, lazy, useEffect, useState, useTransition, useCallback } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import "./App.css";
import "./styles/scrollbar.css";

// Lazy load components
const HomePage = lazy(() => import('./HomePage.js'));
const GamesPage = lazy(() => import('./GamesPage.js'));
const AboutPage = lazy(() => import('./AboutPage.js'));
const ContactPage = lazy(() => import('./ContactPage.js'));
const CustomCursor = lazy(() => import('./components/CustomCursor.js'));
const LoadingScreen = lazy(() => import('./components/LoadingScreen.js'));
const SimpleNav = lazy(() => import('./components/GooeyNav.js'));

// Logo component
const LogoCatsmith = ({ className }) => {
  const [Logo, setLogo] = useState(null);
  
  useEffect(() => {
    import('./assets/hero-page/logo-catsmith.svg')
      .then(module => setLogo(() => module.ReactComponent))
      .catch(error => console.error('Error loading logo:', error));
  }, []);

  if (!Logo) return null;
  return <Logo className={className} aria-hidden="true" focusable="false" />;
};

// Navigation component
function Navigation() {
  const location = useLocation();
  const onAboutPage = location.pathname.startsWith('/about');
  const navItems = [
    { label: "Home", href: "/" },
    { label: "Games", href: "/games" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <nav className="navbar">
      <Link to="/" className={`navbar-logo-link${onAboutPage ? ' navbar-logo-link--about' : ''}`}>
        <LogoCatsmith className="navbar-cat-logo" />
        <div className="navbar-logo">FableSmiths</div>
      </Link>
      <div className="navbar-simple">
        <SimpleNav items={navItems} />
      </div>
    </nav>
  );
}

// Custom hook for preloading on hover
const usePreloadOnHover = () => {
  const preload = useCallback((component) => {
    if (component?.preload) {
      component.preload().catch(console.error);
    }
  }, []);

  return { preload };
};

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div className="error-fallback">Something went wrong. Please refresh the page.</div>;
    }
    return this.props.children;
  }
}

// Page wrapper component
const PageWrapper = ({ children, className = '' }) => (
  <div className={`App ${className}`}>
    <Navigation />
    {children}
  </div>
);

// Page wrapper components
const HomePageWrapper = () => (
  <PageWrapper className="fantasy-bg">
    <div className="content-wrapper">
      <div className="home-section">
        <HomePage />
      </div>
    </div>
  </PageWrapper>
);

const GamesPageWrapper = () => (
  <PageWrapper>
    <GamesPage />
  </PageWrapper>
);

const AboutPageWrapper = () => (
  <PageWrapper>
    <AboutPage />
  </PageWrapper>
);

const ContactPageWrapper = () => (
  <PageWrapper>
    <ContactPage />
  </PageWrapper>
);

function App() {
  const location = useLocation();
  const [isPending, startTransition] = useTransition();
  const [isNavigating, setIsNavigating] = useState(false);
  const isAboutPage = location.pathname.startsWith('/about');
  const { preload } = usePreloadOnHover();
  
  // Preload components for the current route
  useEffect(() => {
    const preloadRouteComponents = async () => {
      try {
        const routeComponents = {
          '/': [HomePage],
          '/games': [GamesPage],
          '/about': [AboutPage],
          '/contact': [ContactPage]
        };
        
        const components = routeComponents[location.pathname] || [];
        await Promise.all(components.map(comp => comp.preload?.()));
      } catch (error) {
        console.error('Error preloading components:', error);
      }
    };
    
    preloadRouteComponents();
  }, [location.pathname]);

  // Handle route changes with startTransition
  const handleRouteChange = React.useCallback((path) => {
    startTransition(() => {
      setIsNavigating(true);
      requestAnimationFrame(() => {
        window.history.pushState({}, '', path);
        window.dispatchEvent(new PopStateEvent('popstate'));
        setTimeout(() => setIsNavigating(false), 50);
      });
    });
  }, []);

  // Add navigation handler to window for global access if needed
  React.useEffect(() => {
    window.handleRouteChange = handleRouteChange;
    return () => {
      delete window.handleRouteChange;
    };
  }, [handleRouteChange]);

  // Add/remove body class
  useEffect(() => {
    document.body.classList.add('custom-cursor-active');
    return () => {
      document.body.classList.remove('custom-cursor-active');
    };
  }, []);

  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingScreen />}>
        <div className={`app-container ${isAboutPage ? 'about-page' : ''}`}>
          <CustomCursor />
          <Routes>
            <Route path="/" element={<HomePageWrapper />} />
            <Route path="/games" element={<GamesPageWrapper />} />
            <Route path="/about" element={<AboutPageWrapper />} />
            <Route path="/contact" element={<ContactPageWrapper />} />
            <Route path="*" element={
              <PageWrapper>
                <div className="not-found">
                  <h2>404 - Page Not Found</h2>
                  <p>The page you're looking for doesn't exist or has been moved.</p>
                  <Link to="/" className="back-home">Go to Home</Link>
                </div>
              </PageWrapper>
            } />
          </Routes>
        </div>
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;