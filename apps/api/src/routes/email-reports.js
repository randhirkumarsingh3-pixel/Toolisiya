import 'dotenv/config';
import express from 'express';
import pb from '../utils/pocketbaseClient.js';
import logger from '../utils/logger.js';
import { sendEmail } from '../utils/emailService.js';

const router = express.Router();

/**
 * HELPER FUNCTION 1: Get yesterday's date range
 * Returns start and end timestamps for yesterday
 */
const getYesterdayDateRange = () => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // Set to start of day (00:00:00)
  const startDate = new Date(yesterday);
  startDate.setHours(0, 0, 0, 0);

  // Set to end of day (23:59:59)
  const endDate = new Date(yesterday);
  endDate.setHours(23, 59, 59, 999);

  // Format date string (YYYY-MM-DD)
  const year = yesterday.getFullYear();
  const month = String(yesterday.getMonth() + 1).padStart(2, '0');
  const day = String(yesterday.getDate()).padStart(2, '0');
  const dateString = `${year}-${month}-${day}`;

  // Format display date (e.g., "April 20, 2026")
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const displayDate = `${monthNames[yesterday.getMonth()]} ${yesterday.getDate()}, ${year}`;

  return {
    startDate,
    endDate,
    dateString,
    displayDate,
    reportDate: dateString
  };
};

/**
 * HELPER FUNCTION 2: Generate yesterday's report
 * Queries analytics_events and aggregates data
 */
const generateYesterdayReport = async (startDate, endDate) => {
  logger.info('[EMAIL REPORT] Generating report for date range:', {
    start: startDate.toISOString(),
    end: endDate.toISOString()
  });

  try {
    // Query analytics_events collection
    const events = await pb.collection('analytics_events').getFullList({
      filter: `created >= "${startDate.toISOString()}" && created <= "${endDate.toISOString()}"`
    }).catch((err) => {
      logger.warn('[EMAIL REPORT] Could not fetch analytics_events:', err.message);
      return [];
    });

    logger.info(`[EMAIL REPORT] Retrieved ${events.length} analytics events`);

    // Calculate total events
    const totalEvents = events.length;

    // Calculate unique users (filter out null/empty)
    const uniqueUserIds = new Set(
      events
        .map(e => e.user_id)
        .filter(id => id && id.trim() !== '')
    );
    const uniqueUsers = uniqueUserIds.size;

    // Group events by category
    const eventsByCategory = {};
    events.forEach(event => {
      const category = event.tool_category || 'Uncategorized';
      eventsByCategory[category] = (eventsByCategory[category] || 0) + 1;
    });

    // Group events by tool name
    const eventsByTool = {};
    events.forEach(event => {
      const toolName = event.tool_name || 'Unknown Tool';
      eventsByTool[toolName] = (eventsByTool[toolName] || 0) + 1;
    });

    // Get top 5 tools
    const topTools = Object.entries(eventsByTool)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({
        name,
        count
      }));

    logger.info('[EMAIL REPORT] Report data calculated:', {
      totalEvents,
      uniqueUsers,
      categoriesCount: Object.keys(eventsByCategory).length,
      toolsCount: Object.keys(eventsByTool).length,
      topToolsCount: topTools.length
    });

    return {
      reportDate: startDate.toISOString().split('T')[0],
      displayDate: new Date(startDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      totalEvents,
      uniqueUsers,
      eventsByCategory,
      eventsByTool,
      topTools,
      generatedAt: new Date().toISOString()
    };
  } catch (error) {
    logger.error('[EMAIL REPORT] Error generating report:', error.message);
    throw error;
  }
};

/**
 * HELPER FUNCTION 3: Get admin users
 * Queries admin_users collection and filters by role
 */
const getAdminUsers = async () => {
  try {
    logger.info('[EMAIL REPORT] Fetching admin users...');

    const admins = await pb.collection('admin_users').getFullList({
      filter: 'role = "admin" || role = "super_admin"',
      fields: 'id,email,name'
    }).catch((err) => {
      logger.warn('[EMAIL REPORT] Could not fetch admin_users:', err.message);
      return [];
    });

    logger.info(`[EMAIL REPORT] Found ${admins.length} admin users`);
    return admins;
  } catch (error) {
    logger.error('[EMAIL REPORT] Error fetching admin users:', error.message);
    throw error;
  }
};

/**
 * HELPER FUNCTION 4: Generate email HTML
 * Creates professional HTML email template
 */
const generateEmailHTML = (reportData, displayDate) => {
  const topToolsHTML = reportData.topTools
    .map((tool, index) => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${index + 1}. ${tool.name}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right; font-weight: bold; color: #007bff;">${tool.count} events</td>
      </tr>
    `)
    .join('');

  const categoriesHTML = Object.entries(reportData.eventsByCategory)
    .sort((a, b) => b[1] - a[1])
    .map(([category, count]) => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${category}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right; font-weight: bold; color: #007bff;">${count} events</td>
      </tr>
    `)
    .join('');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333;
      background-color: #f5f5f5;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 800px;
      margin: 0 auto;
      background-color: #ffffff;
      padding: 40px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .header {
      text-align: center;
      border-bottom: 3px solid #007bff;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .header h1 {
      margin: 0;
      color: #007bff;
      font-size: 28px;
    }
    .header p {
      margin: 5px 0 0 0;
      color: #666;
      font-size: 14px;
    }
    .section {
      margin-bottom: 30px;
    }
    .section h2 {
      color: #007bff;
      font-size: 20px;
      border-bottom: 2px solid #e0e0e0;
      padding-bottom: 10px;
      margin-bottom: 15px;
    }
    .summary {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 20px;
    }
    .summary-card {
      background-color: #f9f9f9;
      padding: 15px;
      border-radius: 6px;
      border-left: 4px solid #007bff;
    }
    .summary-card h3 {
      margin: 0 0 10px 0;
      color: #666;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .summary-card .value {
      font-size: 24px;
      font-weight: bold;
      color: #007bff;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 10px;
    }
    table th {
      background-color: #f0f0f0;
      padding: 12px;
      text-align: left;
      font-weight: 600;
      border-bottom: 2px solid #ddd;
    }
    .footer {
      text-align: center;
      margin-top: 40px;
      padding-top: 20px;
      border-top: 2px solid #e0e0e0;
      color: #666;
      font-size: 12px;
    }
    .footer a {
      color: #007bff;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📊 Daily Report</h1>
      <p>${displayDate}</p>
    </div>

    <!-- Summary Section -->
    <div class="section">
      <h2>Summary</h2>
      <div class="summary">
        <div class="summary-card">
          <h3>Total Events</h3>
          <div class="value">${reportData.totalEvents}</div>
        </div>
        <div class="summary-card">
          <h3>Unique Users</h3>
          <div class="value">${reportData.uniqueUsers}</div>
        </div>
      </div>
    </div>

    <!-- Top Tools Section -->
    <div class="section">
      <h2>🔧 Top 5 Tools</h2>
      <table>
        <thead>
          <tr>
            <th>Tool Name</th>
            <th style="text-align: right;">Events</th>
          </tr>
        </thead>
        <tbody>
          ${topToolsHTML}
        </tbody>
      </table>
    </div>

    <!-- Events by Category Section -->
    <div class="section">
      <h2>📂 Events by Category</h2>
      <table>
        <thead>
          <tr>
            <th>Category</th>
            <th style="text-align: right;">Events</th>
          </tr>
        </thead>
        <tbody>
          ${categoriesHTML}
        </tbody>
      </table>
    </div>

    <div class="footer">
      <p>This is an automated daily report from Toolisiya. Please do not reply to this email.</p>
      <p>Generated on ${new Date().toLocaleString('en-US', { timeZone: 'UTC' })} UTC</p>
    </div>
  </div>
</body>
</html>
  `;
};

/**
 * HELPER FUNCTION 5: Send email to single admin
 * Sends email and logs the result
 */
const sendEmailToAdmin = async (adminUser, emailHTML, reportDate) => {
  try {
    logger.info(`[EMAIL REPORT] Sending email to admin: ${adminUser.email}`);

    // Send email using custom emailService
    await sendEmail(
      adminUser.email,
      `Daily Report - ${reportDate}`,
      emailHTML
    );

    logger.info(`[EMAIL REPORT] Email sent successfully to ${adminUser.email}`);

    // Log to email_logs collection
    try {
      await pb.collection('email_logs').create({
        report_date: reportDate,
        admin_email: adminUser.email,
        admin_name: adminUser.name || null,
        status: 'sent',
        error_message: null,
        sent_at: new Date().toISOString()
      });
      logger.info(`[EMAIL REPORT] Email log created for ${adminUser.email}`);
    } catch (logError) {
      logger.warn(`[EMAIL REPORT] Could not create email log: ${logError.message}`);
    }

    return { success: true, error: null };
  } catch (error) {
    logger.error(`[EMAIL REPORT] Error sending email to ${adminUser.email}:`, error.message);

    // Log failure to email_logs collection
    try {
      await pb.collection('email_logs').create({
        report_date: reportDate,
        admin_email: adminUser.email,
        admin_name: adminUser.name || null,
        status: 'failed',
        error_message: error.message,
        sent_at: new Date().toISOString()
      });
      logger.info(`[EMAIL REPORT] Email failure log created for ${adminUser.email}`);
    } catch (logError) {
      logger.warn(`[EMAIL REPORT] Could not create email failure log: ${logError.message}`);
    }

    return { success: false, error: error.message };
  }
};

/**
 * HELPER FUNCTION 6: Send daily report to all admins
 * Sends email to each admin and tracks results
 */
const sendDailyReportToAllAdmins = async (reportData, emailHTML, reportDate) => {
  try {
    logger.info('[EMAIL REPORT] Starting to send emails to all admins...');

    const admins = await getAdminUsers();

    if (admins.length === 0) {
      logger.warn('[EMAIL REPORT] No admin users found');
      return { sentCount: 0, failedCount: 0, errors: ['No admin users found'] };
    }

    logger.info(`[EMAIL REPORT] Sending emails to ${admins.length} admin(s)`);

    const results = [];
    const errors = [];

    for (const admin of admins) {
      const result = await sendEmailToAdmin(admin, emailHTML, reportDate);
      results.push(result);
      if (!result.success) {
        errors.push(`${admin.email}: ${result.error}`);
      }
    }

    const sentCount = results.filter(r => r.success).length;
    const failedCount = results.filter(r => !r.success).length;

    logger.info(`[EMAIL REPORT] Email sending complete: ${sentCount} sent, ${failedCount} failed`);

    return { sentCount, failedCount, errors };
  } catch (error) {
    logger.error('[EMAIL REPORT] Error sending emails to admins:', error.message);
    throw error;
  }
};

/**
 * ENDPOINT 1: POST /send-daily-report
 * Generates and sends daily report to all admins
 */
router.post('/send-daily-report', async (req, res) => {
  logger.info('[EMAIL REPORT] POST /send-daily-report - Starting daily report generation');

  try {
    // Get yesterday's date range
    const dateRange = getYesterdayDateRange();
    logger.info(`[EMAIL REPORT] Generating report for ${dateRange.displayDate}`);

    // Generate report data
    const reportData = await generateYesterdayReport(dateRange.startDate, dateRange.endDate);
    logger.info('[EMAIL REPORT] Report generated successfully');

    // Generate email HTML
    const emailHTML = generateEmailHTML(reportData, dateRange.displayDate);
    logger.info('[EMAIL REPORT] Email HTML generated');

    // Send emails to all admins
    const emailResult = await sendDailyReportToAllAdmins(reportData, emailHTML, dateRange.reportDate);
    logger.info('[EMAIL REPORT] Email sending complete');

    // Return success response
    res.json({
      success: true,
      message: `Daily report sent successfully to ${emailResult.sentCount} admin(s)`,
      reportDate: dateRange.reportDate,
      displayDate: dateRange.displayDate,
      emailsSent: emailResult.sentCount,
      emailsFailed: emailResult.failedCount,
      errors: emailResult.errors.length > 0 ? emailResult.errors : null,
      reportData: {
        totalEvents: reportData.totalEvents,
        uniqueUsers: reportData.uniqueUsers,
        topTools: reportData.topTools,
        eventsByCategory: reportData.eventsByCategory,
        generatedAt: reportData.generatedAt
      }
    });
  } catch (error) {
    logger.error('[EMAIL REPORT] Error in daily report endpoint:', error.message);
    throw error; // Let errorMiddleware handle it
  }
});

/**
 * ENDPOINT 2: GET /email-logs
 * Retrieves email sending logs
 */
router.get('/email-logs', async (req, res) => {
  logger.info('[EMAIL REPORT] GET /email-logs - Fetching email logs');

  try {
    // Query email_logs collection
    const logs = await pb.collection('email_logs').getFullList({
      sort: '-created',
      limit: 100
    }).catch((err) => {
      logger.warn('[EMAIL REPORT] Could not fetch email_logs:', err.message);
      return [];
    });

    logger.info(`[EMAIL REPORT] Retrieved ${logs.length} email logs`);

    res.json({
      success: true,
      count: logs.length,
      logs: logs.map(log => ({
        id: log.id,
        reportDate: log.report_date,
        adminEmail: log.admin_email,
        adminName: log.admin_name,
        status: log.status,
        errorMessage: log.error_message,
        sentAt: log.sent_at,
        created: log.created
      }))
    });
  } catch (error) {
    logger.error('[EMAIL REPORT] Error fetching email logs:', error.message);
    throw error;
  }
});

/**
 * ENDPOINT 3: POST /test-email
 * Sends a test email with sample report data
 */
router.post('/test-email', async (req, res) => {
  logger.info('[EMAIL REPORT] POST /test-email - Sending test email');

  try {
    const testEmail = req.body.email;

    if (!testEmail) {
      return res.status(400).json({ error: 'Email address is required in request body' });
    }

    logger.info(`[EMAIL REPORT] Sending test email to ${testEmail}`);

    // Create test report data
    const testReportData = {
      reportDate: '2026-04-20',
      displayDate: 'April 20, 2026 (Test)',
      totalEvents: 245,
      uniqueUsers: 42,
      topTools: [
        { name: 'Calculator', count: 45 },
        { name: 'PDF Converter', count: 38 },
        { name: 'Image Compressor', count: 32 },
        { name: 'JSON Formatter', count: 28 },
        { name: 'Password Generator', count: 22 }
      ],
      eventsByCategory: {
        'Converters': 120,
        'Generators': 85,
        'Calculators': 40
      },
      generatedAt: new Date().toISOString()
    };

    // Generate email HTML
    const emailHTML = generateEmailHTML(testReportData, testReportData.displayDate);

    // Send test email using custom emailService
    await sendEmail(
      testEmail,
      'Test Email - Daily Report System',
      emailHTML
    );

    logger.info(`[EMAIL REPORT] Test email sent successfully to ${testEmail}`);

    res.json({
      success: true,
      message: `Test email sent to ${testEmail}`,
      email: testEmail,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('[EMAIL REPORT] Error sending test email:', error.message);
    throw error;
  }
});

export default router;