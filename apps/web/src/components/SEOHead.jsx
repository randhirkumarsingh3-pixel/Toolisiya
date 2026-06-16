import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useLocation } from 'react-router-dom';
import apiServerClient from '@/lib/apiServerClient.js';
import { generateSEOTemplate } from '@/utils/seoTemplateGenerator.js';
import { getToolSeoContent } from '@/data/toolSeoContent.js';
import { toolPageData } from '@/data/toolPageData.js';

export default function SEOHead({ toolName, category, defaultSlug, defaultTitle, defaultDescription, defaultKeywords }) {
  const location = useLocation();
  const slug = defaultSlug || location.pathname.replace(/^\//, '') || 'home';
  // Initialize synchronously with a fallback template so Googlebot sees SEO tags immediately!
  const [seoData, setSeoData] = useState(() => generateSEOTemplate(toolName, category, slug));

  useEffect(() => {
    let isMounted = true;
    const fetchSEO = async () => {
      try {
        const res = await apiServerClient.fetch(`/seo/settings/${slug}`);
        const record = res.ok ? await res.json() : null;
        
        if (isMounted) {
          if (record) {
            setSeoData(record);
          } else {
            setSeoData(generateSEOTemplate(toolName, category, slug));
          }
        }
      } catch (error) {
        if (isMounted) setSeoData(generateSEOTemplate(toolName, category, slug));
      }
    };
    fetchSEO();
    return () => { isMounted = false; };
  }, [slug, toolName, category]);

  if (!seoData) return null;

  // Resolve Tool Name & Category from paths dynamically if not explicitly provided
  const pathParts = slug.split('/');
  const cleanToolId = pathParts[pathParts.length - 1] || 'home';
  const pageData = toolPageData[cleanToolId];
  const derivedToolName = toolName || pageData?.toolName || (cleanToolId !== 'home' ? cleanToolId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : null);
  const derivedCategory = category || pageData?.category || (pathParts.length > 1 ? pathParts[0].charAt(0).toUpperCase() + pathParts[0].slice(1) : null);

  // Enforce production canonical domain URL matching the exact served path (preventing 404s)
  const domain = 'https://toolisiya.com';
  const cleanPath = location.pathname.replace(/\/$/, '');
  const canonicalUrl = seoData.canonical_url || `${domain}${cleanPath}`;
  
  // Index control for private/admin/incomplete layouts
  const isNoIndex = 
    location.pathname.startsWith('/admin') ||
    location.pathname.startsWith('/profile') ||
    location.pathname.startsWith('/settings') ||
    location.pathname.startsWith('/app') ||
    location.pathname.startsWith('/verification');
  const robotsContent = isNoIndex ? "noindex, nofollow" : "index, follow";

  // Generate richer long-tail default titles based on category
  let enhancedDefaultTitle = defaultTitle;
  if (!seoData.meta_title && !defaultTitle && derivedToolName) {
    switch (derivedCategory?.toLowerCase()) {
      case 'finance':
        enhancedDefaultTitle = `Free ${derivedToolName} Online: Fast & Accurate Calculator (2026) | Toolisiya`;
        break;
      case 'pdf':
        enhancedDefaultTitle = `Free Online ${derivedToolName}: Fast, Secure & No Limits | Toolisiya`;
        break;
      case 'image':
        enhancedDefaultTitle = `${derivedToolName}: Free Online Image Editor & Converter | Toolisiya`;
        break;
      case 'developer':
      case 'utilities':
        enhancedDefaultTitle = `Free ${derivedToolName} - Online Developer Utility | Toolisiya`;
        break;
      default:
        enhancedDefaultTitle = `${derivedToolName} - Free Online Tool | Toolisiya`;
    }
  }

  // Resolve meta variables with robust, action-oriented CTR fallbacks
  const title = seoData.meta_title || enhancedDefaultTitle || 'Toolisiya - Free Online Utilities & Productivity Tools';
  const description = seoData.meta_description || defaultDescription || (derivedToolName 
    ? `Use our free online ${derivedToolName} to easily process your tasks. Fast, secure, and client-side. Try it now!` 
    : 'Use our free online tools for PDF processing, image editing, developer utilities, financial calculations, and productivity. Fast, secure, and client-side. Start using our free tools now!');
  const keywords = seoData.meta_keywords || defaultKeywords || (derivedToolName ? `${derivedToolName.toLowerCase()}, free ${derivedToolName.toLowerCase()}, online ${derivedToolName.toLowerCase()}, toolisiya` : 'free online tools, developer tools, calculator, productivity, toolisiya');
  const ogImage = seoData.og_image || `${domain}/og-default.png`;

  // 1. Breadcrumb List Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": domain
      },
      derivedCategory ? {
        "@type": "ListItem",
        "position": 2,
        "name": derivedCategory,
        "item": `${domain}/${derivedCategory.toLowerCase()}`
      } : null,
      derivedToolName ? {
        "@type": "ListItem",
        "position": derivedCategory ? 3 : 2,
        "name": derivedToolName,
        "item": `${domain}/${slug}`
      } : null
    ].filter(Boolean)
  };

  // 2. WebApplication Schema (Rendered only on tool pages)
  const webAppSchema = derivedToolName ? {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": derivedToolName,
    "operatingSystem": "All",
    "applicationCategory": derivedCategory ? `${derivedCategory}Application` : "BusinessApplication",
    "browserRequirements": "Requires JavaScript. Requires HTML5.",
    "url": `${domain}/${slug}`,
    "offers": {
      "@type": "Offer",
      "price": "0.00",
      "priceCurrency": "USD"
    }
  } : null;

  // 3. Dynamic FAQ Schema based on actual tool Q&As
  let faqSchemaObj = null;
  const localSeoContent = getToolSeoContent(cleanToolId);
  if (localSeoContent && localSeoContent.faq && localSeoContent.faq.length > 0) {
    faqSchemaObj = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": localSeoContent.faq.map(item => ({
        "@type": "Question",
        "name": item.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": item.answer
        }
      }))
    };
  } else if (seoData.faq_schema) {
    try {
      faqSchemaObj = typeof seoData.faq_schema === 'string' ? JSON.parse(seoData.faq_schema) : seoData.faq_schema;
    } catch (e) {
      console.warn('Failed to parse FAQ schema:', e);
    }
  }

  // 4. Custom Structured Data parsing
  let customSchemaObj = null;
  if (seoData.structured_data) {
    try {
      customSchemaObj = typeof seoData.structured_data === 'string' ? JSON.parse(seoData.structured_data) : seoData.structured_data;
    } catch (e) {
      console.warn('Failed to parse custom structured data:', e);
    }
  }

  return (
    <Helmet>
      <meta name="robots" content={robotsContent} />
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      <link rel="canonical" href={canonicalUrl} />
      
      <meta property="og:title" content={seoData.og_title || title} />
      <meta property="og:description" content={seoData.og_description || description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={ogImage} />
      
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seoData.twitter_title || title} />
      <meta name="twitter:description" content={seoData.twitter_description || description} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Inject Breadcrumb List Schema */}
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </script>

      {/* Inject WebApplication Schema */}
      {webAppSchema && (
        <script type="application/ld+json">
          {JSON.stringify(webAppSchema)}
        </script>
      )}

      {/* Inject FAQ Schema if present */}
      {faqSchemaObj && (
        <script type="application/ld+json">
          {JSON.stringify(faqSchemaObj)}
        </script>
      )}

      {/* Inject custom/admin configured structured data */}
      {customSchemaObj && (
        <script type="application/ld+json">
          {JSON.stringify(customSchemaObj)}
        </script>
      )}
    </Helmet>
  );
}