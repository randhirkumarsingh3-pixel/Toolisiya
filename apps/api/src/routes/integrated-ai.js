import { Router } from 'express';
import { ContentBlockType, stream, uploadImagesToPocketBase } from '../api/integrated-ai.js';
import logger from '../utils/logger.js';
import multer from 'multer';

const router = Router();
const upload = multer();

const SystemPrompt = `You are a professional SEO expert and content strategist. 
Your goal is to help users optimize their web tools for search engines.
When generating content, follow these rules:
1. Use high-traffic, relevant keywords naturally.
2. Ensure the content is helpful and informative for humans, not just search engines.
3. Use proper HTML structure (h2, p, ul, li).
4. Maintain a professional yet engaging tone.
5. Focus on the benefits and use cases of the tool.`;

router.post('/stream', upload.any(), async (req, res) => {
	console.log('DEBUG: Integrated-ai /stream route called');
	const { message } = req.body;
	
	if (!message) {
		return res.status(400).json({ error: 'Message is required' });
	}

	let parsedMessage;
	try {
		parsedMessage = JSON.parse(message);
	} catch (e) {
		parsedMessage = message;
	}

	// Handle both array of blocks and string message
	if (typeof parsedMessage === 'string') {
		parsedMessage = [{ type: ContentBlockType.Text, text: parsedMessage }];
	}

	try {
		res.setHeader('Content-Type', 'text/event-stream');
		res.setHeader('Cache-Control', 'no-cache');
		res.setHeader('Connection', 'keep-alive');

		const sseStream = await stream({
			userId: req.pocketbaseUserId || 'admin', // Default to admin for dashboard
			systemPrompt: SystemPrompt,
			userMessage: parsedMessage,
		});

		sseStream.pipe(res);

		req.on('close', () => {
			sseStream.destroy();
		});

	} catch (error) {
		logger.error('Integrated AI route error:', error);
		if (!res.headersSent) {
			res.status(500).json({ 
				message: 'Something went wrong!',
				error: {
					name: error.name,
					message: error.message,
					stack: error.stack
				}
			});
		} else {
			res.write(`data: ${JSON.stringify({ type: 'error', data: { content: error.message } })}\n\n`);
			res.end();
		}
	}
});

export default router;
