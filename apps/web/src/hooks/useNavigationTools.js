import { useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient.js';

export function useNavigationTools() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const fetchCategories = async () => {
      try {
        const settingsRes = await pb.collection('menu_settings').getFullList({ $autoCancel: false });

        if (!isMounted) return;

        if (settingsRes.length > 0) {
          const { visibility = {}, categoryOrder = [] } = settingsRes[0];
          // Filter out disabled categories and return an array of category names (strings)
          const visibleCategories = categoryOrder.filter(cat => visibility[cat] !== false);
          setCategories(visibleCategories);
        } else {
          // Fallback if no menu_settings record exists
          setCategories(['Finance', 'Career', 'Image', 'Document', 'Utilities', 'Science', 'Productivity']);
        }
      } catch (error) {
        console.error('Failed to fetch menu settings:', error);
      }
    };

    fetchCategories();

    // Subscribe to real-time changes in menu settings
    pb.collection('menu_settings').subscribe('*', () => {
      if (isMounted) fetchCategories();
    });

    return () => {
      isMounted = false;
      pb.collection('menu_settings').unsubscribe('*');
    };
  }, []);

  return categories;
}