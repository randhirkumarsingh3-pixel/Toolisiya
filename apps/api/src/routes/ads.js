import 'dotenv/config';
import express from 'express';
import pb from '../utils/pocketbaseClient.js';
import logger from '../utils/logger.js';

const router = express.Router();

// GET /ads.txt - Public endpoint (no authentication required)
router.get('/ads.txt', async (req, res) => {
  logger.info('Serving ads.txt');

  try {
    const records = await pb.collection('website_settings').getFullList({ $autoCancel: false });
    let adsenseId = '';
    if (records.length > 0) {
      adsenseId = records[0].adsense_publisher_id || '';
    }

    if (!adsenseId) {
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      return res.send('# Google AdSense not configured yet.');
    }

    // Standard AdSense ads.txt format
    const adsTxtContent = `google.com, ${adsenseId}, DIRECT, f08c47fec0942fa0\n`;

    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Content-Disposition', 'inline');
    res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 24 hours
    res.send(adsTxtContent);
  } catch (error) {
    logger.error(`Error serving ads.txt: ${error.message}`);
    res.status(500).send('# Error loading ads.txt configuration.');
  }
});

export default router;
