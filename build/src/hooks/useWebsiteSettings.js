import { useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient.js';

export function useWebsiteSettings() {
  const [settings, setSettings] = useState({
    general: null,
    menu: null,
    isLoading: true
  });

  const fetchSettings = async () => {
    try {
      const records = await pb.collection('website_settings').getFullList({ $autoCancel: false });
      
      let siteConfig = records.find(r => r.setting_key === 'site_config');
      
      if (!siteConfig) {
        // Create default if not exists
        siteConfig = await pb.collection('website_settings').create({
          setting_key: 'site_config',
          setting_type: 'json',
          setting_value: JSON.stringify({
            siteName: 'Toolisiya',
            siteDescription: 'Your ultimate tool directory',
            contactEmail: 'contact@toolisiya.com',
            footerText: '© 2026 Toolisiya. All rights reserved.',
            socialLinks: { facebook: '', twitter: '', linkedin: '', instagram: '' }
          }),
          category_visibility: {
            Finance: true, Career: true, Image: true, Document: true, Utilities: true, Science: true, Productivity: true
          },
          category_order: ['Finance', 'Career', 'Image', 'Document', 'Utilities', 'Science', 'Productivity'],
          menu_items_config: {
            aboutUs: { visible: true, text: 'About Us' },
            signIn: { visible: true, text: 'Sign In' },
            signOut: { visible: true, text: 'Sign Out' }
          }
        }, { $autoCancel: false });
      }

      setSettings({
        general: siteConfig.setting_value ? JSON.parse(siteConfig.setting_value) : {},
        menu: {
          visibility: siteConfig.category_visibility || {},
          order: siteConfig.category_order || [],
          items: siteConfig.menu_items_config || {}
        },
        recordId: siteConfig.id,
        isLoading: false
      });
    } catch (error) {
      console.error('Failed to fetch website settings:', error);
      setSettings(prev => ({ ...prev, isLoading: false }));
    }
  };

  useEffect(() => {
    fetchSettings();
    const handleUpdate = () => fetchSettings();
    window.addEventListener('settings-updated', handleUpdate);
    return () => window.removeEventListener('settings-updated', handleUpdate);
  }, []);

  return settings;
}