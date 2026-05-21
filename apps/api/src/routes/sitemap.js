import 'dotenv/config';
import express from 'express';
import pb from '../utils/pocketbaseClient.js';
import logger from '../utils/logger.js';

const router = express.Router();

// Static pages configuration
const STATIC_PAGES = [
  { path: '/', changefreq: 'weekly', priority: 1.0, label: 'Home' },
  { path: '/about', changefreq: 'monthly', priority: 0.6, label: 'About' },
  { path: '/contact', changefreq: 'monthly', priority: 0.6, label: 'Contact' },
  { path: '/terms', changefreq: 'yearly', priority: 0.6, label: 'Terms' },
  { path: '/privacy', changefreq: 'yearly', priority: 0.6, label: 'Privacy' },
  { path: '/faq', changefreq: 'monthly', priority: 0.6, label: 'FAQ' },
];

// Helper function to escape XML special characters
const escapeXml = (str) => {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
};

// Helper function to format date for sitemap (YYYY-MM-DD)
const formatDate = (date) => {
  const d = new Date(date);
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${month}-${day}`;
};

// GET /sitemap.xml - Public endpoint (no authentication required)
router.get('/sitemap.xml', async (req, res) => {
  logger.info('Generating XML sitemap');

  try {
    const domain = process.env.DOMAIN || 'https://toolisiya.com';
    const baseUrl = domain.endsWith('/') ? domain.slice(0, -1) : domain;

    // Start XML document with proper declaration
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    // Add static pages
    logger.info('Adding static pages to sitemap');
    for (const page of STATIC_PAGES) {
      const lastmod = formatDate(new Date());
      xml += '  <url>\n';
      xml += `    <loc>${escapeXml(baseUrl + page.path)}</loc>\n`;
      xml += `    <lastmod>${lastmod}</lastmod>\n`;
      xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
      xml += `    <priority>${page.priority}</priority>\n`;
      xml += '  </url>\n';
    }

    // Fetch all active tools from tools collection
    logger.info('Fetching active tools');
    const tools = await pb.collection('tools').getFullList({
      filter: 'enabled = true',
      fields: 'id,category,updated',
    });

    // Extract unique categories
    const categories = new Set();
    const categoryMap = {};
    tools.forEach(tool => {
      if (tool.category) {
        categories.add(tool.category);
        if (!categoryMap[tool.category]) {
          categoryMap[tool.category] = tool.updated;
        } else if (new Date(tool.updated) > new Date(categoryMap[tool.category])) {
          categoryMap[tool.category] = tool.updated;
        }
      }
    });

    // Add categories to sitemap
    logger.info(`Adding ${categories.size} categories to sitemap`);
    for (const category of categories) {
      const lastmod = formatDate(categoryMap[category]);
      const categorySlug = encodeURIComponent(category.toLowerCase().replace(/\s+/g, '-'));
      xml += '  <url>\n';
      xml += `    <loc>${escapeXml(baseUrl + '/tools/category/' + categorySlug)}</loc>\n`;
      xml += `    <lastmod>${lastmod}</lastmod>\n`;
      xml += '    <changefreq>weekly</changefreq>\n';
      xml += '    <priority>0.8</priority>\n';
      xml += '  </url>\n';
    }

    // Add individual tools
    logger.info(`Adding ${tools.length} tools to sitemap`);
    for (const tool of tools) {
      const lastmod = formatDate(tool.updated);
      const toolSlug = encodeURIComponent(tool.id);
      xml += '  <url>\n';
      xml += `    <loc>${escapeXml(baseUrl + '/tools/' + toolSlug)}</loc>\n`;
      xml += `    <lastmod>${lastmod}</lastmod>\n`;
      xml += '    <changefreq>monthly</changefreq>\n';
      xml += '    <priority>0.7</priority>\n';
      xml += '  </url>\n';
    }

    // Close XML document
    xml += '</urlset>';

    const totalUrls = STATIC_PAGES.length + categories.size + tools.length;
    logger.info(`Sitemap generated successfully with ${totalUrls} URLs`);

    // Set proper Content-Type header for XML
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Content-Disposition', 'inline');
    res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 24 hours
    res.send(xml);
  } catch (error) {
    logger.error(`Error generating dynamic sitemap: ${error.message}. Falling back to static sitemap generation.`);
    try {
      const domain = process.env.DOMAIN || 'https://toolisiya.com';
      const baseUrl = domain.endsWith('/') ? domain.slice(0, -1) : domain;

      let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
      xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

      // Add static pages
      for (const page of STATIC_PAGES) {
        const lastmod = formatDate(new Date());
        xml += '  <url>\n';
        xml += `    <loc>${escapeXml(baseUrl + page.path)}</loc>\n`;
        xml += `    <lastmod>${lastmod}</lastmod>\n`;
        xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
        xml += `    <priority>${page.priority}</priority>\n`;
        xml += '  </url>\n';
      }

      // Add fallback categories
      const fallbackCategories = ['finance', 'career', 'developer', 'image', 'document', 'pdf', 'science', 'productivity'];
      for (const cat of fallbackCategories) {
        const lastmod = formatDate(new Date());
        xml += '  <url>\n';
        xml += `    <loc>${escapeXml(baseUrl + '/tools/category/' + cat)}</loc>\n`;
        xml += `    <lastmod>${lastmod}</lastmod>\n`;
        xml += '    <changefreq>weekly</changefreq>\n';
        xml += '    <priority>0.8</priority>\n';
        xml += '  </url>\n';
      }

      xml += '</urlset>';

      res.setHeader('Content-Type', 'application/xml; charset=utf-8');
      res.setHeader('Content-Disposition', 'inline');
      res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
      res.send(xml);
    } catch (fallbackError) {
      logger.error(`Critical fallback error generating sitemap: ${fallbackError.message}`);
      res.status(500).send('Error generating sitemap.');
    }
  }
});

export default router;