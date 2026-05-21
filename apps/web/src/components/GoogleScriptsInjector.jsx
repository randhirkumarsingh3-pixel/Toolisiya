import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { fetchWebsiteSettingsCached } from '@/utils/settingsCache.js';

export default function GoogleScriptsInjector() {
  const location = useLocation();

  useEffect(() => {
    const injectScripts = async () => {
      const settings = await fetchWebsiteSettingsCached();
      if (!settings) return;

      const path = location.pathname;
      const isAdminRoute = path.startsWith('/admin') || path.startsWith('/admin-');

      // 1. Google Analytics 4 (GA4) Injection
      const gaId = settings.ga4_measurement_id;
      if (gaId && !document.getElementById('ga-script')) {
        const script1 = document.createElement('script');
        script1.id = 'ga-script';
        script1.async = true;
        script1.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
        document.head.appendChild(script1);

        const script2 = document.createElement('script');
        script2.id = 'ga-init-script';
        script2.innerHTML = `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}');
        `;
        document.head.appendChild(script2);
      }

      // 2. Google Search Console Verification Meta Tag
      const verificationCode = settings.search_console_verification;
      if (verificationCode && !document.querySelector('meta[name="google-site-verification"]')) {
        const meta = document.createElement('meta');
        meta.name = 'google-site-verification';
        meta.content = verificationCode;
        document.head.appendChild(meta);
      }

      // 3. Google AdSense Script Injection (Public pages ONLY)
      const adsenseId = settings.adsense_publisher_id;
      const adsenseScript = document.getElementById('adsense-script');

      if (!isAdminRoute && adsenseId) {
        if (!adsenseScript) {
          const script = document.createElement('script');
          script.id = 'adsense-script';
          script.async = true;
          script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseId}`;
          script.crossOrigin = "anonymous";
          document.head.appendChild(script);
        }
      } else {
        // If we transition to an admin route, safely remove the AdSense tag from DOM to enforce strict policy compliance
        if (adsenseScript) {
          adsenseScript.remove();
        }
      }
    };

    injectScripts();
  }, [location.pathname]);

  return null; // pure injection, no layout impact
}
