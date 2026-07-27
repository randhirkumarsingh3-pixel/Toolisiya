import { SEO_RULES } from './seoTemplateGenerator.js';

export const validateSEOField = (fieldName, value) => {
  if (!value) return false;
  
  if (fieldName === 'meta_title') {
    return value.length >= SEO_RULES.meta_title.min && value.length <= SEO_RULES.meta_title.max;
  }
  if (fieldName === 'meta_description') {
    return value.length >= SEO_RULES.meta_description.min && value.length <= SEO_RULES.meta_description.max;
  }
  if (fieldName === 'meta_keywords') {
    const count = value.split(',').filter(k => k.trim()).length;
    return count >= SEO_RULES.meta_keywords.minCount && count <= SEO_RULES.meta_keywords.maxCount;
  }
  return true;
};

export const calculateSEOScore = (seoData) => {
  if (!seoData) return 0;
  let score = 0;

  // Meta Title (20 pts)
  if (seoData.meta_title) {
    score += 10;
    if (validateSEOField('meta_title', seoData.meta_title)) score += 10;
  }

  // Meta Description (20 pts)
  if (seoData.meta_description) {
    score += 10;
    if (validateSEOField('meta_description', seoData.meta_description)) score += 10;
  }

  // Meta Keywords (15 pts)
  if (seoData.meta_keywords) {
    score += 5;
    if (validateSEOField('meta_keywords', seoData.meta_keywords)) score += 10;
  }

  // H1 Tag (10 pts)
  if (seoData.h1_tag) score += 10;

  // OG Tags (15 pts)
  if (seoData.og_title && seoData.og_description) score += 15;

  // Canonical URL (10 pts)
  if (seoData.canonical_url) score += 10;

  // Extra 10 pts for having an image or structured data
  if (seoData.og_image || seoData.structured_data || seoData.faq_schema) score += 10;

  return Math.min(100, score);
};

export const getSEOIssues = (seoData) => {
  const issues = [];
  if (!seoData) return ['No SEO data found'];

  if (!seoData.meta_title) issues.push('Missing Meta Title');
  else if (!validateSEOField('meta_title', seoData.meta_title)) issues.push(`Meta Title length should be ${SEO_RULES.meta_title.min}-${SEO_RULES.meta_title.max} chars`);

  if (!seoData.meta_description) issues.push('Missing Meta Description');
  else if (!validateSEOField('meta_description', seoData.meta_description)) issues.push(`Meta Description length should be ${SEO_RULES.meta_description.min}-${SEO_RULES.meta_description.max} chars`);

  if (!seoData.meta_keywords) issues.push('Missing Meta Keywords');
  else if (!validateSEOField('meta_keywords', seoData.meta_keywords)) issues.push(`Should have ${SEO_RULES.meta_keywords.minCount}-${SEO_RULES.meta_keywords.maxCount} keywords`);

  if (!seoData.h1_tag) issues.push('Missing H1 Tag');
  if (!seoData.og_title) issues.push('Missing OG Title');
  if (!seoData.canonical_url) issues.push('Missing Canonical URL');

  return issues;
};

export const getSEOScoreColor = (score) => {
  if (score === 100) return 'green';
  if (score >= 70) return 'yellow';
  return 'red';
};