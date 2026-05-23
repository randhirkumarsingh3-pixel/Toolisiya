import 'dotenv/config';
import express from 'express';
import multer from 'multer';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegStatic from 'ffmpeg-static';
import logger from '../utils/logger.js';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';

const router = express.Router();

// Set ffmpeg path
ffmpeg.setFfmpegPath(ffmpegStatic);

// Supported audio formats
const SUPPORTED_FORMATS = ['mp3', 'wav', 'ogg', 'm4a', 'flac', 'aac'];

const SUPPORTED_MIME_TYPES = [
  'audio/mpeg',
  'audio/mp3',
  'audio/wav',
  'audio/x-wav',
  'audio/vnd.wave',
  'audio/ogg',
  'application/ogg',
  'audio/mp4',
  'audio/x-m4a',
  'audio/flac',
  'audio/x-flac',
  'audio/aac',
  'audio/x-aac'
];

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit
  fileFilter: (req, file, cb) => {
    if (SUPPORTED_MIME_TYPES.includes(file.mimetype) || SUPPORTED_FORMATS.includes(file.originalname.split('.').pop().toLowerCase())) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only audio files are allowed.'));
    }
  }
});

// POST /audio/convert
router.post('/convert', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Audio file is required' });
  }

  const { format, bitrate = '192k' } = req.body;

  if (!format) {
    return res.status(400).json({ error: 'Target format is required' });
  }

  const targetFormat = format.toLowerCase();
  if (!SUPPORTED_FORMATS.includes(targetFormat)) {
    return res.status(400).json({
      error: `Unsupported format: ${format}. Supported formats: ${SUPPORTED_FORMATS.join(', ')}`,
    });
  }

  logger.info(`Converting audio to ${targetFormat} with bitrate ${bitrate}`);

  const tempDir = os.tmpdir();
  const inputPath = path.join(tempDir, `input_${Date.now()}_${Math.random().toString(36).slice(2)}`);
  const outputPath = path.join(tempDir, `output_${Date.now()}_${Math.random().toString(36).slice(2)}.${targetFormat}`);

  try {
    // Write request buffer to a temporary file
    await fs.writeFile(inputPath, req.file.buffer);

    // Convert audio using ffmpeg saving to the temporary output file path
    await new Promise((resolve, reject) => {
      let command = ffmpeg(inputPath)
        .toFormat(targetFormat);

      // Bitrate is not applicable for lossless formats (wav, flac)
      if (targetFormat !== 'wav' && targetFormat !== 'flac') {
        command = command.audioBitrate(bitrate);
      }

      command
        .on('error', (error) => {
          logger.error(`FFmpeg error: ${error.message}`);
          reject(new Error(`Audio conversion failed: ${error.message}`));
        })
        .on('end', () => {
          logger.info(`Audio conversion completed`);
          resolve();
        })
        .save(outputPath);
    });

    // Read the converted file back to a buffer
    const convertedBuffer = await fs.readFile(outputPath);

    logger.info(`Successfully converted audio to ${targetFormat}`);

    // Set appropriate content type
    const contentTypeMap = {
      mp3: 'audio/mpeg',
      wav: 'audio/wav',
      ogg: 'audio/ogg',
      m4a: 'audio/mp4',
      flac: 'audio/flac',
      aac: 'audio/aac',
    };

    res.setHeader('Content-Type', contentTypeMap[targetFormat]);
    res.setHeader('Content-Disposition', `attachment; filename="converted.${targetFormat}"`);
    res.send(convertedBuffer);
  } catch (error) {
    logger.error(`Audio conversion route error: ${error.message}`);
    res.status(500).json({ error: error.message || 'An error occurred during audio conversion.' });
  } finally {
    // Clean up temporary files
    await fs.unlink(inputPath).catch(() => {});
    await fs.unlink(outputPath).catch(() => {});
  }
});

export default router;