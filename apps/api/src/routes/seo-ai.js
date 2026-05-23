import { Router } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import logger from '../utils/logger.js';
import dotenv from 'dotenv';
dotenv.config();

const router = Router();

const SYSTEM_PROMPT = `You are a professional SEO expert and content strategist.
Your task is to generate highly optimized, AdSense-safe, and Google-friendly SEO metadata for a given page on a web tools platform called Toolisiya.

Rules for generation:
1. Meta Title: Must be exactly 50-60 characters long. Include primary keywords naturally. Must be catchy and clearly state the tool's purpose.
2. Meta Description: Must be exactly 140-160 characters long. Must include a clear value proposition and CTA (e.g., "for free", "online"). Avoid keyword stuffing.
3. Keywords: Provide 5-8 highly relevant, comma-separated keywords (mix of short and long-tail).
4. H1 Tag: Clean, readable, matching the primary intent of the page. Usually 2-5 words.

DO NOT output any markdown blocks, conversational text, or explanations.
You MUST output ONLY a raw, valid JSON object with the following exact keys:
{
  "meta_title": "...",
  "meta_description": "...",
  "keywords": "...",
  "h1_tag": "..."
}
`;

router.post('/auto-generate', async (req, res) => {
  const { pageName, context } = req.body;

  if (!pageName) {
    return res.status(400).json({ error: 'pageName is required' });
  }

  try {
    // Fallback to the provided key if environment variable is missing on Hostinger
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY || 'AIzaSyDGoMTwW0pVA6hxtGGPb7FTQ1KluK2_SZs';
    if (!apiKey) {
      // Fallback local generation if no API key is present
      logger.warn('GOOGLE_GEMINI_API_KEY missing, using local fallback for SEO generation');
      const name = pageName.trim();
      return res.json({
        meta_title: `${name} Online - Free Tool | Toolisiya`,
        meta_description: `Use our free online ${name} for quick, accurate calculations and conversions. Safe, responsive, and completely free.`,
        keywords: `${name.toLowerCase()}, free online ${name.toLowerCase()}, ${name.toLowerCase()} tool, online calculator, converter`,
        h1_tag: name
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `Generate SEO metadata for the following page:
Page Name: "${pageName}"
Additional Context: "${context || 'A free online web tool'}"

Remember to return ONLY valid JSON matching the specified structure.`;

    const chat = model.startChat({
      history: [
        { role: 'user', parts: [{ text: SYSTEM_PROMPT }] },
        { role: 'model', parts: [{ text: 'Understood. I will provide strictly valid JSON without markdown wrapping.' }] }
      ],
      generationConfig: {
        maxOutputTokens: 1024,
        temperature: 0.7,
      },
    });

    const result = await chat.sendMessage(prompt);
    let output = result.response.text().trim();

    // Clean up markdown wrapping if the LLM adds it despite instructions
    if (output.startsWith('\`\`\`json')) {
      output = output.replace(/^\`\`\`json\n/, '').replace(/\n\`\`\`$/, '');
    } else if (output.startsWith('\`\`\`')) {
      output = output.replace(/^\`\`\`\n/, '').replace(/\n\`\`\`$/, '');
    }

    const parsedJson = JSON.parse(output);

    return res.json(parsedJson);

  } catch (error) {
    logger.error('Error generating SEO metadata:', error);
    return res.status(500).json({
      error: 'Failed to generate SEO metadata',
      details: error.message
    });
  }
});

export default router;
