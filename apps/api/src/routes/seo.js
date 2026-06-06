import 'dotenv/config';
import express from 'express';
import { seoMetadata, defaultSeoMetadata } from '../constants/seoMetadata.js';
import pb from '../utils/pocketbaseClient.js';
import logger from '../utils/logger.js';

const router = express.Router();

// Helper function to normalize slug (convert to lowercase, replace spaces with hyphens)
const normalizeSlug = (slug) => {
  return slug.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
};

// GET /seo/settings/:pageName - Retrieve dynamic SEO settings from database
router.get('/settings/:pageName', async (req, res) => {
  const { pageName } = req.params;
  try {
    const record = await pb.collection('seo_settings')
      .getFirstListItem(`page_name="${pageName}"`, { requestKey: null });
    res.json(record);
  } catch (error) {
    // Return 200 OK with success: false to prevent browser from spamming 404 console errors
    res.json({ success: false, data: null, error: 'SEO settings not found' });
  }
});

// GET /seo/:toolName - Retrieve SEO settings for a tool
router.get('/:toolName', async (req, res) => {
  const { toolName } = req.params;

  if (!toolName) {
    return res.status(400).json({ error: 'Tool name is required' });
  }

  const normalizedSlug = normalizeSlug(toolName);
  logger.info(`Fetching SEO metadata for tool slug: ${normalizedSlug}`);

  // Look up the tool in the seoMetadata object
  const toolSeoData = seoMetadata[normalizedSlug];

  if (!toolSeoData) {
    logger.warn(`SEO metadata not found for tool slug: ${normalizedSlug}, returning default metadata`);
    return res.json({
      success: true,
      data: defaultSeoMetadata,
    });
  }

  logger.info(`SEO metadata found for tool slug: ${normalizedSlug}`);

  res.json({
    success: true,
    data: toolSeoData,
  });
});

export default router;