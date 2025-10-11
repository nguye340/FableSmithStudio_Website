import React, { Suspense, lazy, useEffect, useState, useTransition, useCallback, useMemo } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import "./App.css";
import "./styles/scrollbar.css";

// Performance optimization: Only preload components when needed
const lazyWithPreload = (importFn) => {
  let loaded = false;
  let component = null;
  
  const load = async () => {
    if (!loaded) {
      const module = await importFn();
      component = module.default;
      loaded = true;
    }
    return component;
  };
  
  const Component = lazy(async () => {
    const c = await load();
    return { default: c };
  });
  
  Component.preload = load;
  return Component;
};

// Lazy load components with manual preloading
const HomePage = lazyWithPreload(() => import('./HomePage'));
const GamesPage = lazyWithPreload(() => import('./GamesPage'));
const AboutPage = lazyWithPreload(() => import('./AboutPage'));
const ContactPage = lazyWithPreload(() => import('./ContactPage'));
const CustomCursor = lazyWithPreload(() => import('./components/CustomCursor'));
const SimpleNav = lazyWithPreload(() => import('./components/GooeyNav'));
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

// Preload components on mouse over navigation
const usePreloadOnHover = () => {
  const preload = useCallback((component) => {
    if (component?.preload) {
      component.preload().catch(console.error);
    }
  }, []);

  return { preload };
};

// Main App component
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
  // Optimize rendering with useMemo
  const appContent = useMemo(() => (
    <div className="App">
      <ErrorBoundary>
        <Suspense fallback={<LoadingScreen />}>
          <CustomCursor />
          {isPending || isNavigating ? <LoadingScreen /> : mainContent}
        </Suspense>
      </ErrorBoundary>
    </div>
  ), [isPending, isNavigating, mainContent]);

  return appContent;
}

export default App;
