import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import routes from './routes/index.js';
import { errorMiddleware } from './middleware/index.js';
import securityHeaders from './middleware/security-headers.js';
import logger from './utils/logger.js';
import { initializeEmailScheduler, stopEmailScheduler } from './utils/emailScheduler.js';


const app = express();

process.on('uncaughtException', (error) => {
	logger.error('Uncaught exception:', error);
	console.error('Uncaught exception:', error);
});
  
process.on('unhandledRejection', (reason, promise) => {
	logger.error('Unhandled rejection at:', promise, 'reason:', reason);
	console.error('Unhandled rejection at:', promise, 'reason:', reason);
});

process.on('SIGINT', async () => {
	logger.info('Interrupted');
	console.log('Interrupted');
	stopEmailScheduler();
	process.exit(0);
});

process.on('SIGTERM', async () => {
	logger.info('SIGTERM signal received');
	console.log('SIGTERM signal received');
	stopEmailScheduler();

	await new Promise(resolve => setTimeout(resolve, 3000));

	logger.info('Exiting');
	console.log('Exiting');
	process.exit();
});

app.use(helmet());
app.use(securityHeaders);
app.use(cors({
	origin: process.env.CORS_ORIGIN,
	credentials: true,
}));
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
	console.log(`[DEBUG] ${req.method} ${req.url}`);
	next();
});

app.use('/', routes());

app.use(errorMiddleware);

app.use((req, res) => {
	res.status(404).json({ error: 'Route not found' });
});

const port = process.env.PORT || 3001;

app.listen(port, () => {
	logger.info(`🚀 API Server running on http://localhost:${port}`);
	console.log(`🚀 API Server running on http://localhost:${port}`);
	
	// Initialize email scheduler
	initializeEmailScheduler();
});

export default app;