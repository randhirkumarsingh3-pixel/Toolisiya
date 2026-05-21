import { useMemo } from 'react';

export const useStructuredData = (type, data) => {
  const schema = useMemo(() => {
    if (!data) return null;

    const baseSchema = {
      "@context": "https://schema.org",
    };

    switch (type) {
      case 'Organization':
        return {
          ...baseSchema,
          "@type": "Organization",
          "name": data.name || "Toolisiya",
          "url": data.url || "https://toolisiya.com",
          "logo": data.logo,
        };
      case 'WebSite':
        return {
          ...baseSchema,
          "@type": "WebSite",
          "name": data.name || "Toolisiya",
          "url": data.url || "https://toolisiya.com",
          "potentialAction": {
            "@type": "SearchAction",
            "target": `${data.url || "https://toolisiya.com"}/search?q={search_term_string}`,
            "query-input": "required name=search_term_string"
          }
        };
      case 'SoftwareApplication':
        return {
          ...baseSchema,
          "@type": "SoftwareApplication",
          "name": data.name,
          "operatingSystem": "All",
          "applicationCategory": "BrowserApplication",
          "description": data.description,
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          }
        };
      case 'FAQPage':
        return {
          ...baseSchema,
          "@type": "FAQPage",
          "mainEntity": data.faqs?.map(faq => ({
            "@type": "Question",
            "name": faq.q,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": faq.a
            }
          })) || []
        };
      default:
        return null;
    }
  }, [type, data]);

  return schema;
};