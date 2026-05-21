import React, { createContext, useContext, useState, useEffect } from 'react';

const AppUsageContext = createContext();

export const useAppUsage = () => useContext(AppUsageContext);

export const AppUsageProvider = ({ children }) => {
  const [recentTools, setRecentTools] = useState([]);
  const [favoriteTools, setFavoriteTools] = useState([]);

  // Load from local storage on mount
  useEffect(() => {
    try {
      const storedRecents = JSON.parse(localStorage.getItem('toolisiya_recents')) || [];
      const storedFavorites = JSON.parse(localStorage.getItem('toolisiya_favorites')) || [];
      setRecentTools(storedRecents);
      setFavoriteTools(storedFavorites);
    } catch (e) {
      console.error("Failed to load app usage data", e);
    }
  }, []);

  const addRecentTool = (tool) => {
    if (!tool || !tool.path || tool.path === '#') return;
    
    setRecentTools(prev => {
      // Remove if it already exists to move it to the top
      const filtered = prev.filter(t => t.path !== tool.path);
      const updated = [{
        name: tool.name || tool.title,
        path: tool.path,
        iconName: tool.iconName || (typeof tool.icon === 'string' ? tool.icon : (tool.icon?.render?.name || tool.icon?.name || 'Wrench')),
        timestamp: Date.now()
      }, ...filtered].slice(0, 10); // Keep max 10
      
      localStorage.setItem('toolisiya_recents', JSON.stringify(updated));
      return updated;
    });
  };

  const toggleFavorite = (tool) => {
    if (!tool || !tool.path || tool.path === '#') return;
    
    setFavoriteTools(prev => {
      const exists = prev.some(t => t.path === tool.path);
      let updated;
      
      if (exists) {
        updated = prev.filter(t => t.path !== tool.path);
      } else {
        updated = [{
          name: tool.name || tool.title,
          path: tool.path,
          iconName: tool.iconName || (typeof tool.icon === 'string' ? tool.icon : (tool.icon?.render?.name || tool.icon?.name || 'Wrench')),
        }, ...prev];
      }
      
      localStorage.setItem('toolisiya_favorites', JSON.stringify(updated));
      return updated;
    });
  };

  const isFavorite = (path) => favoriteTools.some(t => t.path === path);

  return (
    <AppUsageContext.Provider value={{
      recentTools,
      favoriteTools,
      addRecentTool,
      toggleFavorite,
      isFavorite
    }}>
      {children}
    </AppUsageContext.Provider>
  );
};
