import 'dotenv/config';
import express from 'express';
import logger from '../utils/logger.js';

const router = express.Router();

// GET /robots.txt - Public endpoint (no authentication required)
router.get('/robots.txt', (req, res) => {
  logger.info('Serving robots.txt');

  const domain = process.env.DOMAIN || 'https://toolisiya.com';
  const baseUrl = domain.endsWith('/') ? domain.slice(0, -1) : domain;

  const robotsTxt = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /hcgi/

Sitemap: ${baseUrl}/sitemap.xml
`;

  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Content-Disposition', 'inline');
  res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 24 hours
  res.send(robotsTxt);
});

export default router;