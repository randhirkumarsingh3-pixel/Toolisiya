import 'dotenv/config';
import express from 'express';
import pb from '../utils/pocketbaseClient.js';
import { adminAuthMiddleware } from '../middleware/index.js';
import logger from '../utils/logger.js';

const router = express.Router();

// Helper function to format date range
const getDateRange = (startDate, endDate) => {
  const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const end = endDate ? new Date(endDate) : new Date();
  return {
    start: start.toISOString(),
    end: end.toISOString(),
  };
};

// Helper function to build date filter
const buildDateFilter = (startDate, endDate) => {
  const { start, end } = getDateRange(startDate, endDate);
  return `timestamp >= "${start}" && timestamp <= "${end}"`;
};

// GET /analytics/overview
router.get('/overview', adminAuthMiddleware, async (req, res) => {
  const { startDate, endDate } = req.query;
  logger.info(`Analytics overview requested by admin: ${req.admin.email}`);

  const dateFilter = buildDateFilter(startDate, endDate);

  // Get all events in date range
  const allEvents = await pb.collection('analytics_events').getFullList({
    filter: dateFilter,
  });

  // Calculate metrics
  const totalVisits = allEvents.length;
  const uniqueVisitors = new Set(allEvents.map(e => e.user_id || e.ip_address)).size;
  const returningVisitors = allEvents.filter(e => e.is_returning).length;
  const avgSessionDuration = allEvents.length > 0
    ? allEvents.reduce((sum, e) => sum + (e.session_duration || 0), 0) / allEvents.length
    : 0;

  // Calculate bounce rate (sessions with only 1 page view)
  const sessionMap = {};
  allEvents.forEach(event => {
    const sessionId = event.session_id || event.user_id;
    sessionMap[sessionId] = (sessionMap[sessionId] || 0) + 1;
  });
  const bouncedSessions = Object.values(sessionMap).filter(count => count === 1).length;
  const bounceRate = Object.keys(sessionMap).length > 0
    ? (bouncedSessions / Object.keys(sessionMap).length) * 100
    : 0;

  res.json({
    totalVisits,
    uniqueVisitors,
    returningVisitors,
    avgSessionDuration: Math.round(avgSessionDuration),
    bounceRate: Math.round(bounceRate * 100) / 100,
    dateRange: getDateRange(startDate, endDate),
  });
});

// GET /analytics/tools
router.get('/tools', adminAuthMiddleware, async (req, res) => {
  const { startDate, endDate, limit = 10 } = req.query;
  logger.info(`Analytics tools requested by admin: ${req.admin.email}`);

  const dateFilter = buildDateFilter(startDate, endDate);

  // Get all tool events
  const toolEvents = await pb.collection('analytics_events').getFullList({
    filter: `${dateFilter} && tool_id != null && tool_id != ""`,
  });

  // Group by tool_id and count
  const toolMap = {};
  toolEvents.forEach(event => {
    if (event.tool_id) {
      toolMap[event.tool_id] = (toolMap[event.tool_id] || 0) + 1;
    }
  });

  // Sort by count and limit
  const topTools = Object.entries(toolMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, parseInt(limit, 10))
    .map(([toolId, count]) => ({
      toolId,
      usageCount: count,
      percentage: ((count / toolEvents.length) * 100).toFixed(2),
    }));

  res.json({
    tools: topTools,
    totalToolUsage: toolEvents.length,
    dateRange: getDateRange(startDate, endDate),
  });
});

// GET /analytics/geographic
router.get('/geographic', adminAuthMiddleware, async (req, res) => {
  const { startDate, endDate, groupBy = 'country' } = req.query;
  logger.info(`Analytics geographic requested by admin: ${req.admin.email}`);

  const dateFilter = buildDateFilter(startDate, endDate);

  // Get all events
  const allEvents = await pb.collection('analytics_events').getFullList({
    filter: dateFilter,
  });

  // Group by specified field
  const geoMap = {};
  allEvents.forEach(event => {
    let key;
    switch (groupBy) {
      case 'region':
        key = event.region || 'Unknown';
        break;
      case 'city':
        key = event.city || 'Unknown';
        break;
      case 'country':
      default:
        key = event.country || 'Unknown';
        break;
    }
    geoMap[key] = (geoMap[key] || 0) + 1;
  });

  // Sort by count
  const geoData = Object.entries(geoMap)
    .sort((a, b) => b[1] - a[1])
    .map(([location, count]) => ({
      location,
      visitors: count,
      percentage: ((count / allEvents.length) * 100).toFixed(2),
    }));

  res.json({
    geographic: geoData,
    groupBy,
    totalVisitors: allEvents.length,
    dateRange: getDateRange(startDate, endDate),
  });
});

// GET /analytics/traffic-sources
router.get('/traffic-sources', adminAuthMiddleware, async (req, res) => {
  const { startDate, endDate } = req.query;
  logger.info(`Analytics traffic sources requested by admin: ${req.admin.email}`);

  const dateFilter = buildDateFilter(startDate, endDate);

  // Get all events
  const allEvents = await pb.collection('analytics_events').getFullList({
    filter: dateFilter,
  });

  // Categorize traffic sources
  const trafficMap = {
    direct: 0,
    search: 0,
    referral: 0,
    social: 0,
    other: 0,
  };

  allEvents.forEach(event => {
    const referrer = event.referrer || '';
    if (!referrer || referrer === 'direct') {
      trafficMap.direct++;
    } else if (referrer.includes('google') || referrer.includes('bing') || referrer.includes('yahoo')) {
      trafficMap.search++;
    } else if (referrer.includes('facebook') || referrer.includes('twitter') || referrer.includes('instagram') || referrer.includes('linkedin')) {
      trafficMap.social++;
    } else if (referrer.includes('reddit') || referrer.includes('quora') || referrer.includes('medium')) {
      trafficMap.referral++;
    } else {
      trafficMap.other++;
    }
  });

  const totalTraffic = allEvents.length;
  const trafficSources = Object.entries(trafficMap).map(([source, count]) => ({
    source,
    visitors: count,
    percentage: ((count / totalTraffic) * 100).toFixed(2),
  }));

  res.json({
    trafficSources,
    totalTraffic,
    dateRange: getDateRange(startDate, endDate),
  });
});

// GET /analytics/devices
router.get('/devices', adminAuthMiddleware, async (req, res) => {
  const { startDate, endDate } = req.query;
  logger.info(`Analytics devices requested by admin: ${req.admin.email}`);

  const dateFilter = buildDateFilter(startDate, endDate);

  // Get all events
  const allEvents = await pb.collection('analytics_events').getFullList({
    filter: dateFilter,
  });

  // Group by device type, browser, and OS
  const deviceMap = {};
  const browserMap = {};
  const osMap = {};

  allEvents.forEach(event => {
    const device = event.device_type || 'Unknown';
    const browser = event.browser || 'Unknown';
    const os = event.os || 'Unknown';

    deviceMap[device] = (deviceMap[device] || 0) + 1;
    browserMap[browser] = (browserMap[browser] || 0) + 1;
    osMap[os] = (osMap[os] || 0) + 1;
  });

  const totalEvents = allEvents.length;

  const devices = Object.entries(deviceMap)
    .sort((a, b) => b[1] - a[1])
    .map(([device, count]) => ({
      device,
      count,
      percentage: ((count / totalEvents) * 100).toFixed(2),
    }));

  const browsers = Object.entries(browserMap)
    .sort((a, b) => b[1] - a[1])
    .map(([browser, count]) => ({
      browser,
      count,
      percentage: ((count / totalEvents) * 100).toFixed(2),
    }));

  const operatingSystems = Object.entries(osMap)
    .sort((a, b) => b[1] - a[1])
    .map(([os, count]) => ({
      os,
      count,
      percentage: ((count / totalEvents) * 100).toFixed(2),
    }));

  res.json({
    devices,
    browsers,
    operatingSystems,
    totalEvents,
    dateRange: getDateRange(startDate, endDate),
  });
});

// GET /analytics/keywords
router.get('/keywords', adminAuthMiddleware, async (req, res) => {
  const { startDate, endDate, limit = 20 } = req.query;
  logger.info(`Analytics keywords requested by admin: ${req.admin.email}`);

  const dateFilter = buildDateFilter(startDate, endDate);

  // Get all search events
  const searchEvents = await pb.collection('analytics_events').getFullList({
    filter: `${dateFilter} && event_type = "search"`,
  });

  // Group by search keyword
  const keywordMap = {};
  searchEvents.forEach(event => {
    const keyword = event.search_keyword || 'Unknown';
    if (!keywordMap[keyword]) {
      keywordMap[keyword] = {
        count: 0,
        conversions: 0,
      };
    }
    keywordMap[keyword].count++;
    if (event.converted) {
      keywordMap[keyword].conversions++;
    }
  });

  // Sort by count and limit
  const topKeywords = Object.entries(keywordMap)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, parseInt(limit, 10))
    .map(([keyword, data]) => ({
      keyword,
      searches: data.count,
      conversions: data.conversions,
      conversionRate: ((data.conversions / data.count) * 100).toFixed(2),
    }));

  res.json({
    keywords: topKeywords,
    totalSearches: searchEvents.length,
    dateRange: getDateRange(startDate, endDate),
  });
});

// GET /analytics/user-behavior
router.get('/user-behavior', adminAuthMiddleware, async (req, res) => {
  const { startDate, endDate } = req.query;
  logger.info(`Analytics user behavior requested by admin: ${req.admin.email}`);

  const dateFilter = buildDateFilter(startDate, endDate);

  // Get all events
  const allEvents = await pb.collection('analytics_events').getFullList({
    filter: dateFilter,
  });

  // Calculate page views
  const pageViewEvents = allEvents.filter(e => e.event_type === 'page_view');
  const totalPageViews = pageViewEvents.length;

  // Calculate CTR (Click-Through Rate)
  const clickEvents = allEvents.filter(e => e.event_type === 'click');
  const ctr = totalPageViews > 0 ? ((clickEvents.length / totalPageViews) * 100).toFixed(2) : 0;

  // Calculate conversion rate
  const conversionEvents = allEvents.filter(e => e.converted);
  const conversionRate = allEvents.length > 0 ? ((conversionEvents.length / allEvents.length) * 100).toFixed(2) : 0;

  // User flow - top pages
  const pageMap = {};
  pageViewEvents.forEach(event => {
    const page = event.page_url || 'Unknown';
    pageMap[page] = (pageMap[page] || 0) + 1;
  });

  const topPages = Object.entries(pageMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([page, count]) => ({
      page,
      views: count,
      percentage: ((count / totalPageViews) * 100).toFixed(2),
    }));

  // Conversion funnel (simplified)
  const funnelStages = [
    { stage: 'Landing', count: pageViewEvents.length },
    { stage: 'Engagement', count: clickEvents.length },
    { stage: 'Conversion', count: conversionEvents.length },
  ];

  res.json({
    pageViews: totalPageViews,
    clickThroughRate: parseFloat(ctr),
    conversionRate: parseFloat(conversionRate),
    topPages,
    conversionFunnel: funnelStages,
    dateRange: getDateRange(startDate, endDate),
  });
});

// POST /analytics/export
router.post('/export', adminAuthMiddleware, async (req, res) => {
  const { startDate, endDate, format = 'csv' } = req.body;

  if (!format || !['csv', 'pdf'].includes(format.toLowerCase())) {
    return res.status(400).json({ error: 'Format must be csv or pdf' });
  }

  logger.info(`Analytics export requested by admin: ${req.admin.email} - Format: ${format}`);

  const dateFilter = buildDateFilter(startDate, endDate);

  // Get all events in date range
  const allEvents = await pb.collection('analytics_events').getFullList({
    filter: dateFilter,
  });

  if (format.toLowerCase() === 'csv') {
    // Generate CSV
    const headers = [
      'Event Type',
      'Tool ID',
      'Page URL',
      'Referrer',
      'Device Type',
      'Browser',
      'OS',
      'Country',
      'Region',
      'City',
      'Timestamp',
    ];

    const rows = allEvents.map(event => [
      event.event_type || '',
      event.tool_id || '',
      event.page_url || '',
      event.referrer || '',
      event.device_type || '',
      event.browser || '',
      event.os || '',
      event.country || '',
      event.region || '',
      event.city || '',
      event.timestamp || '',
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')),
    ].join('\n');

    logger.info(`CSV export generated with ${allEvents.length} events`);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="analytics-report.csv"');
    res.send(csvContent);
  } else if (format.toLowerCase() === 'pdf') {
    // For PDF, we'll return a JSON response with data that can be used to generate PDF on frontend
    // or integrate with a PDF library like pdfkit
    logger.info(`PDF export data prepared with ${allEvents.length} events`);

    const reportData = {
      title: 'Analytics Report',
      dateRange: getDateRange(startDate, endDate),
      totalEvents: allEvents.length,
      events: allEvents.slice(0, 100), // Limit to first 100 for PDF
      summary: {
        totalVisits: allEvents.length,
        uniqueVisitors: new Set(allEvents.map(e => e.user_id || e.ip_address)).size,
      },
    };

    res.json({
      success: true,
      message: 'PDF export data prepared',
      data: reportData,
      note: 'Use this data to generate PDF on frontend or integrate with pdfkit library',
    });
  }
});

export default router;