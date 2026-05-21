export const generateFAQSchema = (faqs) => {
  if (!faqs || !Array.isArray(faqs) || faqs.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
};

export const generateCalculatorSchema = ({ name, description, url, category = "FinanceApplication" }) => {
  if (!name || !url) return null;
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": name,
    "description": description,
    "url": url,
    "applicationCategory": category,
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };
};

export const generateSoftwareApplicationSchema = ({ name, description, url, category = "DeveloperApplication", os = "Web Browser" }) => {
  if (!name || !url) return null;
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": name,
    "description": description,
    "url": url,
    "applicationCategory": category,
    "operatingSystem": os,
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };
};

export const generateToolSchema = (toolName, description, category, url) => {
  if (!toolName || !url) return null;
  // If it's a calculator or purely financial tool, use WebApplication with FinanceApplication category
  if (toolName.toLowerCase().includes('calculator') || category === 'Finance') {
    return generateCalculatorSchema({ name: toolName, description, url, category: 'FinanceApplication' });
  }
  
  // Otherwise default to SoftwareApplication
  let appCategory = "UtilityApplication";
  if (category === 'Developer Tools') appCategory = "DeveloperApplication";
  if (category === 'Image Tools') appCategory = "MultimediaApplication";
  if (category === 'Productivity') appCategory = "BusinessApplication";
  if (category === 'Documents') appCategory = "BusinessApplication";
  if (category === 'Science Tools') appCategory = "EducationalApplication";
  
  return generateSoftwareApplicationSchema({ name: toolName, description, url, category: appCategory });
};

export const generateBreadcrumbSchema = (breadcrumbs) => {
  if (!breadcrumbs || !Array.isArray(breadcrumbs) || breadcrumbs.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": crumb.url
    }))
  };
};

export const generateOrganizationSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Toolisiya",
    "url": "https://toolisiya.com",
    "logo": "https://horizons-cdn.hostinger.com/bdd6546f-fbd6-4325-a50e-17d2da2d4211/b0ad41527084c4ba034f6e8eea1bc176.png",
    "description": "A comprehensive suite of free, professional, and secure online tools for developers, businesses, and everyday use.",
    "sameAs": [
      "https://twitter.com/toolisiya",
      "https://facebook.com/toolisiya",
      "https://linkedin.com/company/toolisiya"
    ]
  };
};

export const generateLocalBusinessSchema = () => {
  // Provided for cases where local SEO is necessary, though Toolisiya is purely digital
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Toolisiya Online Tools",
    "image": "https://horizons-cdn.hostinger.com/bdd6546f-fbd6-4325-a50e-17d2da2d4211/b0ad41527084c4ba034f6e8eea1bc176.png",
    "@id": "https://toolisiya.com",
    "url": "https://toolisiya.com",
    "telephone": "",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Digital Online Services",
      "addressLocality": "Global",
      "addressRegion": "Web",
      "postalCode": "00000",
      "addressCountry": "US"
    }
  };
};