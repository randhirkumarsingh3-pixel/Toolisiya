import 'dotenv/config';
import cron from 'node-cron';
import logger from './logger.js';

// Store cron job reference
let dailyReportJob = null;

/**
 * Initialize daily email scheduler
 * Runs daily at 9 AM UTC
 */
export function initializeEmailScheduler() {
  try {
    logger.info('[EMAIL SCHEDULER] Initializing email scheduler...');
    console.log('[EMAIL SCHEDULER] Initializing email scheduler...');

    // Schedule cron job: 0 9 * * * = 9 AM every day UTC
    dailyReportJob = cron.schedule('0 9 * * *', async () => {
      try {
        const now = new Date().toISOString();
        logger.info(`[EMAIL SCHEDULER] Daily email report cron job triggered at ${now}`);
        console.log(`[EMAIL SCHEDULER] Daily email report cron job triggered at ${now}`);

        // Call the send-daily-report endpoint
        const response = await fetch('http://localhost:3001/hcgi/api/email-reports/send-daily-report', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        logger.info('[EMAIL SCHEDULER] Daily email report sent successfully:', {
          emailsSent: result.emailsSent,
          emailsFailed: result.emailsFailed,
          totalEvents: result.reportData.totalEvents
        });
        console.log('[EMAIL SCHEDULER] Daily email report sent successfully:', {
          emailsSent: result.emailsSent,
          emailsFailed: result.emailsFailed,
          totalEvents: result.reportData.totalEvents
        });
      } catch (error) {
        logger.error('[EMAIL SCHEDULER] Error in daily email cron job:', error.message);
        console.error('[EMAIL SCHEDULER] Error in daily email cron job:', error.message);
      }
    });

    logger.info('[EMAIL SCHEDULER] Email scheduler initialized successfully');
    logger.info('[EMAIL SCHEDULER] Daily report will be sent at 9 AM UTC every day');
    console.log('[EMAIL SCHEDULER] Email scheduler initialized successfully');
    console.log('[EMAIL SCHEDULER] Daily report will be sent at 9 AM UTC every day');
  } catch (error) {
    logger.error('[EMAIL SCHEDULER] Failed to initialize email scheduler:', error.message);
    console.error('[EMAIL SCHEDULER] Failed to initialize email scheduler:', error.message);
    throw error;
  }
}

/**
 * Stop the email scheduler (for graceful shutdown)
 */
export function stopEmailScheduler() {
  if (dailyReportJob) {
    dailyReportJob.stop();
    logger.info('[EMAIL SCHEDULER] Email scheduler stopped');
    console.log('[EMAIL SCHEDULER] Email scheduler stopped');
  }
}

export default { initializeEmailScheduler, stopEmailScheduler };