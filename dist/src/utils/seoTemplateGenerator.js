export const SEO_RULES = {
  meta_title: { min: 50, max: 60 },
  meta_description: { min: 140, max: 160 },
  meta_keywords: { minCount: 5, maxCount: 8 },
};

export const getActionVerb = (category) => {
  const verbs = {
    finance: 'Calculate',
    science: 'Compute',
    productivity: 'Organize',
    image: 'Edit',
    developer: 'Generate',
    career: 'Build',
    document: 'Process',
    generators: 'Create',
  };
  return verbs[category?.toLowerCase()] || 'Use';
};

export const generateFAQSchema = (toolName, category) => {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `What is the ${toolName}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `The ${toolName} is a free online tool designed to help you with ${category} tasks quickly and securely.`
        }
      },
      {
        "@type": "Question",
        "name": `Is the ${toolName} free to use?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Yes, the ${toolName} is completely free to use with no hidden charges.`
        }
      }
    ]
  };
};

export const generateSEOTemplate = (toolName, category, toolSlug) => {
  const verb = getActionVerb(category);
  const cleanName = toolName || 'Tool';
  const cleanCategory = category || 'Utility';
  
  const meta_title = `${verb} with Free ${cleanName} Online | Toolisiya`.substring(0, 60);
  const meta_description = `Use our free online ${cleanName} to easily ${verb.toLowerCase()} your ${cleanCategory.toLowerCase()} tasks. Fast, secure, and no registration required. Try it now!`.substring(0, 160);
  const meta_keywords = `${cleanName.toLowerCase()}, free ${cleanName.toLowerCase()}, online ${cleanName.toLowerCase()}, ${cleanCategory.toLowerCase()} tools, toolisiya`;
  
  return {
    meta_title,
    meta_description,
    meta_keywords,
    h1_tag: `Free Online ${cleanName}`,
    og_title: meta_title,
    og_description: meta_description,
    canonical_url: `https://toolisiya.com/${toolSlug}`,
    slug: toolSlug,
    faq_schema: generateFAQSchema(cleanName, cleanCategory)
  };
};