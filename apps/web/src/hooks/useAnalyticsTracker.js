import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import pb from '@/lib/pocketbaseClient.js';
import { useAuth } from '@/contexts/AuthContext.jsx';

// Helper to generate and persist a simple session ID
const getSessionId = () => {
  try {
    let sid = sessionStorage.getItem('analytics_session_id');
    if (!sid) {
      sid = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      sessionStorage.setItem('analytics_session_id', sid);
    }
    return sid;
  } catch (e) {
    return 'fallback-session-id';
  }
};

export const useAnalyticsTracker = () => {
  const location = useLocation();
  const { currentUser } = useAuth();

  useEffect(() => {
    const trackPageView = async () => {
      try {
        const pathParts = location.pathname.split('/').filter(Boolean);
        
        // Skip tracking for admin and auth pages
        const isAdminOrAuth = ['admin', 'login', 'signup', 'admin-login', 'otp-login', 'forgot-password'].includes(pathParts[0]);
        if (isAdminOrAuth) return;

        let eventType = 'page_view';
        let toolName = '';
        let toolCategory = '';

        // Determine if it's a tool page based on basic routing structure
        const nonToolCategories = ['tools', 'about', 'contact', 'privacy-policy', 'terms-of-service', 'blog', 'careers'];
        if (pathParts.length > 0 && !nonToolCategories.includes(pathParts[0])) {
          eventType = 'tool_usage';
          toolName = pathParts[pathParts.length - 1];
          toolCategory = pathParts.length > 1 ? pathParts[0] : 'general';
        }

        if (location.pathname === '/') {
          eventType = 'page_view';
          toolName = 'home';
          toolCategory = 'core';
        }

        // Extract browser and device info
        const ua = navigator.userAgent;
        let device = 'desktop';
        if (/Mobi|Android/i.test(ua)) device = 'mobile';
        if (/Tablet|iPad/i.test(ua)) device = 'tablet';

        let browser = 'Other';
        if (ua.includes('Chrome')) browser = 'Chrome';
        else if (ua.includes('Firefox')) browser = 'Firefox';
        else if (ua.includes('Safari') && !ua.includes('Chrome')) browser = 'Safari';
        else if (ua.includes('Edge')) browser = 'Edge';

        let os = 'Unknown';
        if (ua.includes('Win')) os = 'Windows';
        else if (ua.includes('Mac')) os = 'MacOS';
        else if (ua.includes('Linux')) os = 'Linux';
        else if (ua.includes('Android')) os = 'Android';
        else if (ua.includes('like Mac')) os = 'iOS';

        const eventData = {
          eventType,
          toolName,
          toolCategory,
          page: location.pathname,
          referrer: document.referrer || 'direct',
          device,
          browser,
          os,
          country: 'Unknown', // Client-side IP resolution would require external API
          region: 'Unknown',
          city: 'Unknown',
          userId: currentUser?.id || '',
          sessionId: getSessionId(),
          timestamp: new Date().toISOString()
        };

        // Create the record in PocketBase
        // We use $autoCancel: false to ensure the request fires even if user navigates away quickly
        await pb.collection('analytics_events').create(eventData, { $autoCancel: false });
        
      } catch (err) {
        // Silently fail to not interrupt user experience if analytics tracking fails or collection is missing
        if (import.meta.env.DEV) {
          console.error('Analytics tracking failed silently:', err.message);
        }
      }
    };

    // Small delay allows page title/metadata to update before tracking
    const timeoutId = setTimeout(trackPageView, 500);
    return () => clearTimeout(timeoutId);
  }, [location.pathname, currentUser?.id]);
};