import React, { createContext, useContext, useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient.js';

const ActiveToolsContext = createContext({
  activeUrls: new Set(),
  inactiveUrls: new Set(),
  activeTools: [],
  activeCategories: [],
  inactiveCategorySlugs: new Set(),
  isLoading: true
});

export const useActiveTools = () => useContext(ActiveToolsContext);

export const ActiveToolsProvider = ({ children }) => {
  const [activeUrls, setActiveUrls] = useState(new Set());
  const [inactiveUrls, setInactiveUrls] = useState(new Set());
  const [activeTools, setActiveTools] = useState([]);
  const [activeCategories, setActiveCategories] = useState([]);
  const [inactiveCategorySlugs, setInactiveCategorySlugs] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);

  const fetchActiveTools = async () => {
    try {
      const [toolsRecords, catRecords] = await Promise.all([
        pb.collection('tools').getFullList({
          sort: 'name',
          $autoCancel: false,
        }),
        pb.collection('categories').getFullList({
          sort: 'order',
          $autoCancel: false,
        })
      ]);

      const activeCats = catRecords.filter(c => c.is_active);
      const activeCategoryNames = new Set(activeCats.map(c => c.name));
      const activeCategorySlugs = new Set(activeCats.map(c => c.slug));

      const activeTls = toolsRecords.filter(t => t.status === 'active' && activeCategoryNames.has(t.category));
      const urls = new Set(activeTls.map(r => r.url));
      
      // Calculate inactive tools: status is inactive OR its parent category is inactive
      const inactiveTls = toolsRecords.filter(t => t.status !== 'active' || !activeCategoryNames.has(t.category));
      const badUrls = new Set(inactiveTls.map(r => r.url));

      // Calculate inactive category slugs
      const badCategorySlugs = new Set(
        catRecords
          .filter(c => !c.is_active)
          .map(c => c.slug)
      );

      setActiveUrls(urls);
      setInactiveUrls(badUrls);
      setActiveTools(activeTls);
      setActiveCategories(activeCats);
      setInactiveCategorySlugs(badCategorySlugs);
    } catch (err) {
      console.error('Failed to fetch active tools for global context:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveTools();
    
    // Subscribe to realtime changes to the tools collection to immediately trigger the Kill Switch!
    pb.collection('tools').subscribe('*', function (e) {
      if (e.action === 'update' || e.action === 'create' || e.action === 'delete') {
         fetchActiveTools();
      }
    });

    pb.collection('categories').subscribe('*', function (e) {
      if (e.action === 'update' || e.action === 'create' || e.action === 'delete') {
         fetchActiveTools();
      }
    });
    
    return () => {
      pb.collection('tools').unsubscribe('*');
      pb.collection('categories').unsubscribe('*');
    };
  }, []);

  return (
    <ActiveToolsContext.Provider value={{ 
      activeUrls, 
      inactiveUrls, 
      activeTools, 
      activeCategories, 
      inactiveCategorySlugs, 
      isLoading 
    }}>
      {children}
    </ActiveToolsContext.Provider>
  );
};
