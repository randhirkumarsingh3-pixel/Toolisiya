import process from 'node:process';
import { PassThrough, Readable } from 'node:stream';
import dotenv from 'dotenv';
import { NodeEnv } from '../constants/common.js';
import logger from '../utils/logger.js';
import pocketbaseClient from '../utils/pocketbaseClient.js';
import { seoMetadata } from '../constants/seoMetadata.js';

dotenv.config();

function generateLocalSEO(pageName) {
	const slug = pageName.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
	const predefined = seoMetadata[slug] || {};

	const name = predefined.toolName || pageName;
	const meta_title = predefined.meta_title || `${name} Online - Free Tool | Toolisiya`;
	const meta_description = predefined.meta_description || `Use our free online ${name} for quick, accurate calculations and conversions. Safe, responsive, and completely free.`;
	const meta_keywords = predefined.meta_keywords || `${name}, free online ${name}, ${name} tool, online calculator, converter`;
	const h1_tag = predefined.h1_tag || name;

	const content = `
<h2>What is the ${name} Tool?</h2>
<p>The <strong>${name}</strong> is a high-performance, web-based utility designed to help users execute operations related to ${name} quickly, accurately, and with minimal effort. Whether you are a professional, a student, or just someone looking to get quick results, our online ${name} is engineered to provide precise outcomes instantly.</p>

<p>Search engine optimization and user experience are at the core of Toolisiya. That is why our tools are built using lightweight code to load instantly on any device, including mobile phones, tablets, and desktop computers. You do not need to install any software or registry plugins; everything runs directly inside your web browser secure and sandbox-isolated.</p>

<h2>Key Features of Our ${name}</h2>
<ul>
  <li><strong>Instant and Accurate Results:</strong> Get real-time calculations and updates as you type, powered by robust frontend algorithms.</li>
  <li><strong>100% Free to Use:</strong> Access all premium options without any paywall, subscription, or hidden fees.</li>
  <li><strong>Zero Server Load:</strong> Most computations are performed locally on your device, ensuring maximum speed and complete data privacy.</li>
  <li><strong>Responsive Interface:</strong> Designed with a modern, responsive layout that works flawlessly on mobile, tablet, and desktop viewports.</li>
  <li><strong>User-Friendly Design:</strong> Simple inputs, clear labels, and intuitive guides make it accessible for users of all skill levels.</li>
</ul>

<h2>How to Use the ${name} Step-by-Step</h2>
<p>Using our web-based tool is incredibly straightforward. Follow these simple steps to perform your calculations or operations:</p>
<ol>
  <li>Navigate to the <strong>${name}</strong> page on the Toolisiya platform.</li>
  <li>Enter the required variables or values in the designated input fields. Make sure to double-check your numbers for accuracy.</li>
  <li>Select any custom preferences, options, or modes that are relevant to your calculation or conversion.</li>
  <li>Click the action button (if applicable) or review the output, which will update dynamically and automatically.</li>
  <li>Copy, export, or download your results using the integrated one-click copy buttons for seamless sharing.</li>
</ol>

<h2>Why Choose Toolisiya for ${name}?</h2>
<p>At Toolisiya, we pride ourselves on building the world's most accessible, premium static and interactive tools. Unlike other platforms cluttered with heavy ads, slow load times, and complex login requirements, our ${name} offers a clean, distraction-free environment. We prioritize user privacy, which means your sensitive inputs are processed on the client side and never stored on remote database servers. Bookmark this tool today to streamline your daily workflow and boost your productivity!</p>
	`.trim();

	return {
		meta_title,
		meta_description,
		meta_keywords,
		h1_tag,
		content
	};
}

const MessageRole = Object.freeze({
	User: 'user',
	Assistant: 'assistant',
	Tool: 'tool',
});

const SSEEventType = Object.freeze({
	Content: 'content',
	Reasoning: 'reasoning',
	ToolUse: 'tool_use',
	ToolResult: 'tool_result',
	Usage: 'usage',
	Error: 'error',
	Done: 'done',
	Completed: 'completed',
});

export const ContentBlockType = Object.freeze({
	Text: 'text',
	Image: 'image',
});

const HistoryEventTypes = new Set([
	SSEEventType.Reasoning,
	SSEEventType.Content,
	SSEEventType.ToolUse,
	SSEEventType.ToolResult,
	SSEEventType.Error,
]);

const SquashableSSEEventTypes = new Set([
	SSEEventType.Content,
	SSEEventType.Reasoning,
	SSEEventType.Error,
]);

export async function stream({ userId, systemPrompt, userMessage }) {
	const userMessageText = userMessage.map(b => b.text || '').join('\n');
	const seoMatch = userMessageText.match(/web tool called "([^"]+)"/);

	if (seoMatch) {
		logger.info(`Detected SEO generation request for tool: ${seoMatch[1]}. Generating locally.`);
		const toolName = seoMatch[1];
		const passThrough = new PassThrough();

		(async () => {
			try {
				const seoData = generateLocalSEO(toolName);
				const jsonString = JSON.stringify(seoData, null, 2);

				// Stream the JSON string in small chunks with a delay to simulate typing/generation
				const chunkSize = 40;
				for (let i = 0; i < jsonString.length; i += chunkSize) {
					const chunk = jsonString.slice(i, i + chunkSize);
					passThrough.write(`data: ${JSON.stringify({ type: SSEEventType.Content, data: { content: chunk } })}\n\n`);
					await new Promise(resolve => setTimeout(resolve, 30));
				}

				// Process history saving in background
				await saveMessages({ userId, messages: [
					{ role: MessageRole.User, content: userMessage },
					{ role: MessageRole.Assistant, content: [{ type: SSEEventType.Content, data: { content: jsonString } }] },
				] });

			} catch (error) {
				logger.error('Local SEO stream error:', error);
				passThrough.write(`data: ${JSON.stringify({ type: SSEEventType.Error, data: { content: error.message } })}\n\n`);
			} finally {
				passThrough.write(`data: ${JSON.stringify({ type: SSEEventType.Completed, data: { content: '[COMPLETED]' } })}\n\n`);
				passThrough.end();
			}
		})();

		return passThrough;
	}

	const apiUrl = process.env.INTEGRATED_AI_API_URL;
	console.log('DEBUG: apiUrl is:', JSON.stringify(apiUrl));
	
	// Fallback to Gemini if proxy URL is missing or invalid
	if (!apiUrl || apiUrl === 'undefined' || !apiUrl.startsWith('http')) {
		logger.info('INTEGRATED_AI_API_URL missing or invalid, falling back to direct Gemini API');
		const { GoogleGenerativeAI } = await import('@google/generative-ai');
		const genAI = new GoogleGenerativeAI('AIzaSyDGoMTwW0pVA6hxtGGPb7FTQ1KluK2_SZs');
		const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

		const history = await getHistory({ userId });
		const passThrough = new PassThrough();

		const chat = model.startChat({
			history: history.map(msg => ({
				role: msg.role === 'user' ? 'user' : 'model',
				parts: [{ text: msg.content }],
			})),
			generationConfig: {
				maxOutputTokens: 2048,
			},
		});

		(async () => {
			try {
				const result = await chat.sendMessageStream(userMessage.map(b => b.text).join('\n'));
				let fullContent = '';

				for await (const chunk of result.stream) {
					const chunkText = chunk.text();
					fullContent += chunkText;
					passThrough.write(`data: ${JSON.stringify({ type: SSEEventType.Content, data: { content: chunkText } })}\n\n`);
				}

				// Process history saving in background
				await saveMessages({ userId, messages: [
					{ role: MessageRole.User, content: userMessage },
					{ role: MessageRole.Assistant, content: [{ type: SSEEventType.Content, data: { content: fullContent } }] },
				] });

			} catch (error) {
				logger.error('Gemini stream error:', error);
				passThrough.write(`data: ${JSON.stringify({ type: SSEEventType.Error, data: { content: error.message } })}\n\n`);
			} finally {
				passThrough.write(`data: ${JSON.stringify({ type: SSEEventType.Completed, data: { content: '[COMPLETED]' } })}\n\n`);
				passThrough.end();
			}
		})();

		return passThrough;
	}

	const history = await getHistory({ userId });

	const response = await fetch(`${apiUrl}/generate`, {
		method: 'POST',
		headers: {
			'Accept': 'text/event-stream',
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${process.env.INTEGRATED_AI_API_KEY}`,
		},
		body: JSON.stringify({
			website_id: process.env.WEBSITE_ID,
			history: [
				...history,
				mapUserMessage({ message: userMessage }),
			],
			system_prompt: systemPrompt,
			stream: true,
		}),
	});

	if (!response.ok) {
		const errorBody = await response.text().catch(() => 'Unknown error');
		throw new Error(`AI proxy request failed with status ${response.status}: ${errorBody}`);
	}

	const passThrough = new PassThrough();
	Readable.fromWeb(response.body).pipe(passThrough);

	return passThrough;
}

async function saveMessages({ userId, messages }) {
	const batch = pocketbaseClient.createBatch();

	messages.map(message => batch.collection('_integratedAiMessages').create({
		...(userId && { userId }),
		role: message.role,
		content: message.content,
	}));

	await batch.send();
}

export async function getHistory({ userId }) {
	if (!userId) return [];

	try {
		const records = await pocketbaseClient.collection('_integratedAiMessages').getFullList({
			sort: 'created',
			...(userId && { filter: pocketbaseClient.filter('userId = {:userId}', { userId }) }),
		});

		return records.map(record => ({
			role: record.role,
			content: typeof record.content === 'string' ? record.content : record.content.map(b => b.text).join('\n'),
		}));
	} catch (error) {
		logger.error('Failed to fetch history', error);
		return [];
	}
}

function mapUserMessage({ message }) {
	const textParts = message.filter(b => b.type === ContentBlockType.Text).map(b => b.text);
	return {
		role: MessageRole.User,
		content: textParts.join('\n'),
	};
}

export async function uploadImagesToPocketBase({ images }) {
	const uploadPromises = images.map(async (file) => {
		const formData = new FormData();
		const blob = new Blob([file.buffer], { type: file.mimetype });
		formData.append('file', blob, file.originalname);

		const record = await pocketbaseClient.collection('_integratedAiImages').create(formData);

		const url = pocketbaseClient.files.getURL(record, record.file);

		return url.replace('http://localhost:8090', `https://${process.env.WEBSITE_DOMAIN}/hcgi/platform`);
	});

	return Promise.all(uploadPromises);
}
