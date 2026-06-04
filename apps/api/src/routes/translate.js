import { Router } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import logger from '../utils/logger.js';

const router = Router();

// Endpoint for OCR translation
router.post('/', async (req, res) => {
  const { text, targetLanguage } = req.body;

  if (!text) return res.status(400).json({ error: 'Text is required' });
  if (!targetLanguage) return res.status(400).json({ error: 'Target language is required' });

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Translation API key is not configured.' });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Translate the following text into ${targetLanguage}. Maintain the original formatting, paragraphs, and lists as much as possible. Return ONLY the translated text without any conversational filler or markdown formatting around it unless it was in the original text.\n\nText to translate:\n${text}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const translatedText = response.text();

    res.json({ translatedText });
  } catch (error) {
    logger.error('Translation error:', error);
    res.status(500).json({ error: 'Translation failed', details: error.message });
  }
});

export default router;
