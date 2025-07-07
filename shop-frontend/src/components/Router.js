// src/components/Router.js
import React, { useState, useEffect } from 'react';

const Router = ({ children }) => {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };

    // Listen for browser back/forward buttons
    window.addEventListener('popstate', handlePopState);
    
    // Listen for custom navigation events
    window.addEventListener('navigate', handleCustomNavigation);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('navigate', handleCustomNavigation);
    };
  }, []);

  const handleCustomNavigation = (event) => {
    const { path, replace = false } = event.detail;
    
    if (replace) {
      window.history.replaceState({}, '', path);
    } else {
      window.history.pushState({}, '', path);
    }
    
    setCurrentPath(path);
  };

  // Provide navigation functions to children
  const navigate = (path, replace = false) => {
    if (replace) {
      window.history.replaceState({}, '', path);
    } else {
      window.history.pushState({}, '', path);
    }
    setCurrentPath(path);
  };

  return React.cloneElement(children, { 
    currentPath, 
    navigate,
    router: {
      path: currentPath,
      navigate,
      isAdmin: currentPath.includes('/admin'),
      isShop: currentPath.includes('/shop') || currentPath === '/'
    }
  });
};

export default Router;