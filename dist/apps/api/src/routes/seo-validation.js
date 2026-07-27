import 'dotenv/config';
import express from 'express';
import pb from '../utils/pocketbaseClient.js';
import logger from '../utils/logger.js';

const router = express.Router();

// Helper function to validate meta title length
const validateMetaTitle = (title) => {
  const issues = [];
  const recommendations = [];
  let score = 100;

  if (!title) {
    issues.push('Meta title is missing');
    score -= 30;
  } else if (title.length < 50) {
    issues.push(`Meta title is too short (${title.length} chars, minimum 50)`);
    recommendations.push('Increase meta title to at least 50 characters');
    score -= 20;
  } else if (title.length > 60) {
    issues.push(`Meta title is too long (${title.length} chars, maximum 60)`);
    recommendations.push('Reduce meta title to maximum 60 characters');
    score -= 15;
  }

  return { issues, recommendations, score };
};

// Helper function to validate meta description length
const validateMetaDescription = (description) => {
  const issues = [];
  const recommendations = [];
  let score = 100;

  if (!description) {
    issues.push('Meta description is missing');
    score -= 30;
  } else if (description.length < 150) {
    issues.push(`Meta description is too short (${description.length} chars, minimum 150)`);
    recommendations.push('Increase meta description to at least 150 characters');
    score -= 20;
  } else if (description.length > 160) {
    issues.push(`Meta description is too long (${description.length} chars, maximum 160)`);
    recommendations.push('Reduce meta description to maximum 160 characters');
    score -= 15;
  }

  return { issues, recommendations, score };
};

// Helper function to validate H1 tag
const validateH1Tag = (h1Tag) => {
  const issues = [];
  const recommendations = [];
  let score = 100;

  if (!h1Tag) {
    issues.push('H1 tag is missing');
    recommendations.push('Add a unique H1 tag to the page');
    score -= 25;
  } else if (typeof h1Tag === 'string' && h1Tag.length === 0) {
    issues.push('H1 tag is empty');
    recommendations.push('Add meaningful content to the H1 tag');
    score -= 25;
  } else if (Array.isArray(h1Tag) && h1Tag.length > 1) {
    issues.push(`Multiple H1 tags found (${h1Tag.length}). Only one H1 tag should exist per page`);
    recommendations.push('Ensure only one H1 tag per page');
    score -= 20;
  }

  return { issues, recommendations, score };
};

// Helper function to validate keywords
const validateKeywords = (keywords) => {
  const issues = [];
  const recommendations = [];
  let score = 100;

  if (!keywords) {
    issues.push('Keywords are missing');
    recommendations.push('Add 5-10 relevant keywords');
    score -= 25;
  } else {
    const keywordArray = Array.isArray(keywords) ? keywords : keywords.split(',').map(k => k.trim());
    const count = keywordArray.length;

    if (count < 5) {
      issues.push(`Too few keywords (${count}, minimum 5)`);
      recommendations.push('Add more relevant keywords (target 5-10)');
      score -= 15;
    } else if (count > 10) {
      issues.push(`Too many keywords (${count}, maximum 10)`);
      recommendations.push('Reduce keywords to maximum 10');
      score -= 10;
    }
  }

  return { issues, recommendations, score };
};

// Helper function to validate JSON-LD schema markup
const validateSchemaMarkup = (schemaMarkup) => {
  const issues = [];
  const recommendations = [];
  let score = 100;

  if (!schemaMarkup) {
    issues.push('Schema markup is missing');
    recommendations.push('Add JSON-LD schema markup for better SEO');
    score -= 20;
  } else {
    try {
      const schema = typeof schemaMarkup === 'string' ? JSON.parse(schemaMarkup) : schemaMarkup;

      // Validate schema structure
      if (!schema['@context']) {
        issues.push('Schema markup missing @context');
        score -= 10;
      }
      if (!schema['@type']) {
        issues.push('Schema markup missing @type');
        score -= 10;
      }

      // Check for required fields based on type
      if (schema['@type'] === 'Article') {
        if (!schema.headline) issues.push('Article schema missing headline');
        if (!schema.description) issues.push('Article schema missing description');
        if (!schema.author) issues.push('Article schema missing author');
        if (!schema.datePublished) issues.push('Article schema missing datePublished');
      } else if (schema['@type'] === 'Organization') {
        if (!schema.name) issues.push('Organization schema missing name');
        if (!schema.url) issues.push('Organization schema missing url');
      } else if (schema['@type'] === 'Product') {
        if (!schema.name) issues.push('Product schema missing name');
        if (!schema.description) issues.push('Product schema missing description');
      }

      if (issues.length > 0) {
        score -= issues.length * 5;
      }
    } catch (error) {
      issues.push(`Invalid JSON-LD schema: ${error.message}`);
      score -= 30;
    }
  }

  return { issues, recommendations, score };
};

// Helper function to calculate overall validation status
const getValidationStatus = (score) => {
  if (score >= 80) return 'pass';
  if (score >= 60) return 'warning';
  return 'fail';
};

// Helper function to validate a single page
const validatePage = (page) => {
  const allIssues = [];
  const allRecommendations = [];
  let totalScore = 100;

  // Validate meta title
  const titleValidation = validateMetaTitle(page.meta_title);
  allIssues.push(...titleValidation.issues);
  allRecommendations.push(...titleValidation.recommendations);
  totalScore = Math.min(totalScore, titleValidation.score);

  // Validate meta description
  const descValidation = validateMetaDescription(page.meta_description);
  allIssues.push(...descValidation.issues);
  allRecommendations.push(...descValidation.recommendations);
  totalScore = Math.min(totalScore, descValidation.score);

  // Validate H1 tag
  const h1Validation = validateH1Tag(page.h1_tag);
  allIssues.push(...h1Validation.issues);
  allRecommendations.push(...h1Validation.recommendations);
  totalScore = Math.min(totalScore, h1Validation.score);

  // Validate keywords
  const keywordsValidation = validateKeywords(page.meta_keywords);
  allIssues.push(...keywordsValidation.issues);
  allRecommendations.push(...keywordsValidation.recommendations);
  totalScore = Math.min(totalScore, keywordsValidation.score);

  // Validate schema markup
  const schemaValidation = validateSchemaMarkup(page.schema_markup);
  allIssues.push(...schemaValidation.issues);
  allRecommendations.push(...schemaValidation.recommendations);
  totalScore = Math.min(totalScore, schemaValidation.score);

  // Calculate final score (average of all validations)
  const finalScore = Math.round(
    (titleValidation.score + descValidation.score + h1Validation.score + keywordsValidation.score + schemaValidation.score) / 5
  );

  return {
    validation_status: getValidationStatus(finalScore),
    issues_found: allIssues,
    recommendations: allRecommendations,
    score: finalScore,
  };
};

// GET /seo-validation/check-page/:pageId
router.get('/check-page/:pageId', async (req, res) => {
  const { pageId } = req.params;

  if (!pageId) {
    return res.status(400).json({ error: 'Page ID is required' });
  }

  logger.info(`Validating SEO for page: ${pageId}`);

  // Fetch page from seo_settings collection
  const page = await pb.collection('seo_settings').getOne(pageId).catch(() => null);

  if (!page) {
    return res.status(404).json({ error: `Page with ID ${pageId} not found` });
  }

  const validation = validatePage(page);

  logger.info(`SEO validation completed for page: ${pageId} - Status: ${validation.validation_status}`);

  res.json({
    pageId: page.id,
    pageType: page.page_type,
    pageTitle: page.meta_title,
    ...validation,
  });
});

// GET /seo-validation/check-all
router.get('/check-all', async (req, res) => {
  logger.info('Validating SEO for all pages');

  // Fetch all pages from seo_settings collection
  const pages = await pb.collection('seo_settings').getFullList();

  if (pages.length === 0) {
    return res.json({
      total_pages: 0,
      pages_validated: [],
      overall_health_score: 0,
      status_breakdown: {
        pass: 0,
        warning: 0,
        fail: 0,
      },
    });
  }

  // Validate each page
  const validations = pages.map((page) => ({
    pageId: page.id,
    pageType: page.page_type,
    pageTitle: page.meta_title,
    ...validatePage(page),
  }));

  // Calculate overall health score
  const overallScore = Math.round(
    validations.reduce((sum, v) => sum + v.score, 0) / validations.length
  );

  // Count status breakdown
  const statusBreakdown = {
    pass: validations.filter((v) => v.validation_status === 'pass').length,
    warning: validations.filter((v) => v.validation_status === 'warning').length,
    fail: validations.filter((v) => v.validation_status === 'fail').length,
  };

  logger.info(`SEO validation completed for ${pages.length} pages - Overall score: ${overallScore}`);

  res.json({
    total_pages: pages.length,
    pages_validated: validations,
    overall_health_score: overallScore,
    status_breakdown: statusBreakdown,
  });
});

// POST /seo-validation/generate-report
router.post('/generate-report', async (req, res) => {
  logger.info('Generating comprehensive SEO report');

  // Fetch all pages from seo_settings collection
  const pages = await pb.collection('seo_settings').getFullList();

  if (pages.length === 0) {
    return res.json({
      overall_score: 0,
      meta_tags_coverage: 0,
      h1_tag_coverage: 0,
      keywords_coverage: 0,
      schema_markup_coverage: 0,
      issues_by_severity: {
        critical: [],
        medium: [],
        low: [],
      },
      top_10_improvements: [],
      quick_wins: [],
      long_term_improvements: [],
      generated_at: new Date().toISOString(),
    });
  }

  // Validate each page
  const validations = pages.map((page) => ({
    pageId: page.id,
    pageType: page.page_type,
    pageTitle: page.meta_title,
    ...validatePage(page),
  }));

  // Calculate coverage metrics
  const pagesWithMetaTags = pages.filter((p) => p.meta_title && p.meta_description).length;
  const pagesWithH1 = pages.filter((p) => p.h1_tag).length;
  const pagesWithKeywords = pages.filter((p) => p.meta_keywords).length;
  const pagesWithSchema = pages.filter((p) => p.schema_markup).length;

  const metaTagsCoverage = Math.round((pagesWithMetaTags / pages.length) * 100);
  const h1TagCoverage = Math.round((pagesWithH1 / pages.length) * 100);
  const keywordsCoverage = Math.round((pagesWithKeywords / pages.length) * 100);
  const schemaMarkupCoverage = Math.round((pagesWithSchema / pages.length) * 100);

  // Calculate overall score
  const overallScore = Math.round(
    validations.reduce((sum, v) => sum + v.score, 0) / validations.length
  );

  // Categorize issues by severity
  const issuesBySeverity = {
    critical: [],
    medium: [],
    low: [],
  };

  validations.forEach((validation) => {
    validation.issues_found.forEach((issue) => {
      if (issue.includes('missing') || issue.includes('empty')) {
        issuesBySeverity.critical.push({
          page: validation.pageTitle,
          issue,
        });
      } else if (issue.includes('too') || issue.includes('Multiple')) {
        issuesBySeverity.medium.push({
          page: validation.pageTitle,
          issue,
        });
      } else {
        issuesBySeverity.low.push({
          page: validation.pageTitle,
          issue,
        });
      }
    });
  });

  // Collect all recommendations
  const allRecommendations = [];
  validations.forEach((validation) => {
    validation.recommendations.forEach((rec) => {
      if (!allRecommendations.includes(rec)) {
        allRecommendations.push(rec);
      }
    });
  });

  // Categorize improvements
  const quickWins = allRecommendations.filter(
    (rec) => rec.includes('Add') || rec.includes('Increase') || rec.includes('Ensure')
  ).slice(0, 5);

  const longTermImprovements = allRecommendations.filter(
    (rec) => rec.includes('Reduce') || rec.includes('Improve') || rec.includes('Optimize')
  ).slice(0, 5);

  const top10Improvements = allRecommendations.slice(0, 10);

  logger.info(`SEO report generated - Overall score: ${overallScore}`);

  res.json({
    overall_score: overallScore,
    meta_tags_coverage: metaTagsCoverage,
    h1_tag_coverage: h1TagCoverage,
    keywords_coverage: keywordsCoverage,
    schema_markup_coverage: schemaMarkupCoverage,
    issues_by_severity: issuesBySeverity,
    top_10_improvements: top10Improvements,
    quick_wins: quickWins,
    long_term_improvements: longTermImprovements,
    total_pages_analyzed: pages.length,
    pages_with_issues: validations.filter((v) => v.validation_status !== 'pass').length,
    generated_at: new Date().toISOString(),
  });
});

// GET /seo-validation/schema-validation/:pageId
router.get('/schema-validation/:pageId', async (req, res) => {
  const { pageId } = req.params;

  if (!pageId) {
    return res.status(400).json({ error: 'Page ID is required' });
  }

  logger.info(`Validating schema markup for page: ${pageId}`);

  // Fetch page from seo_settings collection
  const page = await pb.collection('seo_settings').getOne(pageId).catch(() => null);

  if (!page) {
    return res.status(404).json({ error: `Page with ID ${pageId} not found` });
  }

  const errors = [];
  const warnings = [];
  let isValid = true;

  if (!page.schema_markup) {
    errors.push('Schema markup is missing');
    isValid = false;
  } else {
    try {
      const schema = typeof page.schema_markup === 'string' ? JSON.parse(page.schema_markup) : page.schema_markup;

      // Validate schema structure
      if (!schema['@context']) {
        errors.push('Schema markup missing @context');
        isValid = false;
      }
      if (!schema['@type']) {
        errors.push('Schema markup missing @type');
        isValid = false;
      }

      // Check for required fields based on type
      if (schema['@type'] === 'Article') {
        if (!schema.headline) errors.push('Article schema missing required field: headline');
        if (!schema.description) errors.push('Article schema missing required field: description');
        if (!schema.author) warnings.push('Article schema missing recommended field: author');
        if (!schema.datePublished) warnings.push('Article schema missing recommended field: datePublished');
      } else if (schema['@type'] === 'Organization') {
        if (!schema.name) errors.push('Organization schema missing required field: name');
        if (!schema.url) errors.push('Organization schema missing required field: url');
      } else if (schema['@type'] === 'Product') {
        if (!schema.name) errors.push('Product schema missing required field: name');
        if (!schema.description) errors.push('Product schema missing required field: description');
      } else if (schema['@type'] === 'LocalBusiness') {
        if (!schema.name) errors.push('LocalBusiness schema missing required field: name');
        if (!schema.address) warnings.push('LocalBusiness schema missing recommended field: address');
      }

      if (errors.length > 0) {
        isValid = false;
      }
    } catch (error) {
      errors.push(`Invalid JSON-LD schema: ${error.message}`);
      isValid = false;
    }
  }

  logger.info(`Schema validation completed for page: ${pageId} - Valid: ${isValid}`);

  res.json({
    pageId: page.id,
    pageType: page.page_type,
    is_valid: isValid,
    errors,
    warnings,
  });
});

export default router;