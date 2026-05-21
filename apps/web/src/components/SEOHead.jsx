import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useLocation } from 'react-router-dom';
import pb from '@/lib/pocketbaseClient.js';
import { generateSEOTemplate } from '@/utils/seoTemplateGenerator.js';

export default function SEOHead({ toolName, category, defaultSlug, defaultTitle, defaultDescription, defaultKeywords }) {
  const location = useLocation();
  const slug = defaultSlug || location.pathname.replace(/^\//, '') || 'home';
  const [seoData, setSeoData] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchSEO = async () => {
      try {
        const record = await pb.collection('seo_settings')
          .getFirstListItem(`page_name="${slug}"`, { $autoCancel: false })
          .catch(() => null);
        
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

  // Enforce production canonical domain URL
  const domain = 'https://toolisiya.com';
  const cleanSlug = slug === 'home' ? '' : slug;
  const canonicalUrl = seoData.canonical_url || `${domain}/${cleanSlug}`;
  
  // Resolve meta variables with robust fallbacks
  const title = seoData.meta_title || defaultTitle || (toolName ? `${toolName} - Free Online Tool | Toolisiya` : 'Toolisiya - Free Online Utilities & Productivity Tools');
  const description = seoData.meta_description || defaultDescription || 'Use our free online tools for PDF processing, image editing, developer utilities, financial calculations, and productivity. Fast, secure, and client-side.';
  const keywords = seoData.meta_keywords || defaultKeywords || (toolName ? `${toolName.toLowerCase()}, free ${toolName.toLowerCase()}, online ${toolName.toLowerCase()}, toolisiya` : 'free online tools, developer tools, calculator, productivity, toolisiya');
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
      category ? {
        "@type": "ListItem",
        "position": 2,
        "name": category,
        "item": `${domain}/${category.toLowerCase()}`
      } : null,
      {
        "@type": "ListItem",
        "position": category ? 3 : 2,
        "name": toolName || slug,
        "item": `${domain}/${slug}`
      }
    ].filter(Boolean)
  };

  // 2. WebApplication Schema (Rendered only on tool pages)
  const webAppSchema = toolName ? {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": toolName,
    "operatingSystem": "All",
    "applicationCategory": "BusinessApplication",
    "browserRequirements": "Requires JavaScript. Requires HTML5.",
    "url": `${domain}/${slug}`,
    "offers": {
      "@type": "Offer",
      "price": "0.00",
      "priceCurrency": "USD"
    }
  } : null;

  // 3. FAQ Schema parsing
  let faqSchemaObj = null;
  if (seoData.faq_schema) {
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