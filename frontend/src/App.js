import React, { Suspense, lazy, useEffect, useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import "./App.css";

// Lazy load components with prefetching
const preloadComponent = (importFn) => {
  const Component = lazy(importFn);
  // Start preloading
  importFn();
  return Component;
};

const ExcavationReveal = preloadComponent(() => import('./ExcavationReveal'));
const HomePage = preloadComponent(() => import('./HomePage'));
const GamesPage = preloadComponent(() => import('./GamesPage'));
const AboutPage = preloadComponent(() => import('./AboutPage'));
const ContactPage = preloadComponent(() => import('./ContactPage'));
const CustomCursor = preloadComponent(() => import('./components/CustomCursor'));
const SimpleNav = preloadComponent(() => import('./components/GooeyNav'));
const LoadingScreen = lazy(() => import('./components/LoadingScreen'));

// Logo component with lazy loading
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

// Page wrapper components
const PageWrapper = ({ children, className = '' }) => (
  <div className={`App ${className}`}>
    <Navigation />
    {children}
  </div>
);

// Home page component wrapper
function HomePageWrapper() {
  return (
    <PageWrapper className="fantasy-bg">
      <div className="content-wrapper">
        <ExcavationReveal 
          title="Fables aren't found. They're forged." 
          subtitle="" 
        />
        <div className="home-section">
          <HomePage />
        </div>
      </div>
    </PageWrapper>
  );
}

// Games page component wrapper
function GamesPageWrapper() {
  return (
    <PageWrapper>
      <GamesPage />
    </PageWrapper>
  );
}

// About page component wrapper
function AboutPageWrapper() {
  return (
    <PageWrapper>
      <AboutPage />
    </PageWrapper>
  );
}

// Contact page component wrapper
function ContactPageWrapper() {
  return (
    <PageWrapper>
      <ContactPage />
    </PageWrapper>
  );
}

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

// Main App component
function App() {
  const location = useLocation();
  const [isPending, startTransition] = React.useTransition();
  const [isNavigating, setIsNavigating] = React.useState(false);
  const isAboutPage = location.pathname.startsWith('/about');
  
  // Handle route changes with startTransition
  const handleRouteChange = React.useCallback((path) => {
    startTransition(() => {
      setIsNavigating(true);
      // Use requestAnimationFrame to ensure the UI updates before the heavy work
      requestAnimationFrame(() => {
        window.history.pushState({}, '', path);
        window.dispatchEvent(new PopStateEvent('popstate'));
        // Small delay to ensure smooth transition
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
  
  useEffect(() => {
    // Add class to body when component mounts
    document.body.classList.add('custom-cursor-active');
    
    // Remove class when component unmounts
    return () => {
      document.body.classList.remove('custom-cursor-active');
    };
  }, []);
  
  // Create a stable reference to the routes
  const routes = React.useMemo(() => [
    { path: "/", element: <HomePageWrapper /> },
    { path: "/games", element: <GamesPageWrapper /> },
    { path: "/about", element: <AboutPageWrapper /> },
    { path: "/contact", element: <ContactPageWrapper /> },
    { path: "*", element: <div>404 Not Found</div> }
  ], []);
  
  // Wrap each route component in its own Suspense boundary
  const createRouteElement = (route) => (
    <ErrorBoundary key={route.path}>
      <Suspense fallback={<LoadingScreen />}>
        {route.element}
      </Suspense>
    </ErrorBoundary>
  );
  
  // Main content with Suspense boundary
  const mainContent = React.useMemo(() => {
    const currentRoute = routes.find(r => r.path === location.pathname) || routes.find(r => r.path === "*");
    return (
      <Routes>
        {routes.map(route => (
          <Route 
            key={route.path}
            path={route.path} 
            element={createRouteElement(route)}
          />
        ))}
      </Routes>
    );
  }, [location.pathname, routes]);
  
  // Wrap the entire app in a transition boundary
  return (
    <div className="App">
      <ErrorBoundary>
        <Suspense fallback={<LoadingScreen />}>
          <CustomCursor />
          {isPending || isNavigating ? <LoadingScreen /> : mainContent}
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}

export default App;
