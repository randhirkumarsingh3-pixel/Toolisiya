import pb from '@/lib/pocketbaseClient.js';

const CACHE_KEY = 'toolisiya_website_settings';
const CACHE_TIME_KEY = 'toolisiya_website_settings_time';
const CACHE_EXPIRY_MS = 30 * 60 * 1000; // 30 minutes

let inMemoryCache = null;

export const fetchWebsiteSettingsCached = async () => {
  // 1. Try memory cache first
  if (inMemoryCache) {
    return inMemoryCache;
  }

  // 2. Try localStorage cache
  try {
    const cachedData = localStorage.getItem(CACHE_KEY);
    const cachedTime = localStorage.getItem(CACHE_TIME_KEY);
    
    if (cachedData && cachedTime) {
      const parsedTime = parseInt(cachedTime, 10);
      const now = Date.now();
      
      if (now - parsedTime < CACHE_EXPIRY_MS) {
        const parsedData = JSON.parse(cachedData);
        inMemoryCache = parsedData;
        return parsedData;
      }
    }
  } catch (e) {
    console.warn('LocalStorage not accessible for settings cache:', e);
  }

  // 3. Fetch from PocketBase
  try {
    const records = await pb.collection('website_settings').getFullList({ $autoCancel: false });
    if (records.length > 0) {
      const settings = records[0];
      
      // Save to cache
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(settings));
        localStorage.setItem(CACHE_TIME_KEY, Date.now().toString());
      } catch (e) {
        console.warn('Failed to write settings to localStorage:', e);
      }
      
      inMemoryCache = settings;
      return settings;
    }
  } catch (err) {
    console.error('Failed to load website settings from PocketBase:', err);
  }

  return null;
};

export const clearWebsiteSettingsCache = () => {
  inMemoryCache = null;
  try {
    localStorage.removeItem(CACHE_KEY);
    localStorage.removeItem(CACHE_TIME_KEY);
  } catch (e) {
    console.warn('Failed to clear settings from localStorage:', e);
  }
};
