import { generateYesterdayReport } from './routes/email-reports.js';

async function test() {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const startDate = new Date(yesterday);
  startDate.setHours(0, 0, 0, 0);
  const endDate = new Date(yesterday);
  endDate.setHours(23, 59, 59, 999);
  
  try {
    const data = await generateYesterdayReport(startDate, endDate);
    console.log(data);
  } catch (err) {
    console.error('ERROR:', err);
  }
}
test();
