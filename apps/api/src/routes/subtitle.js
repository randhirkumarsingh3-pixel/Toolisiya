import 'dotenv/config';
import express from 'express';
import multer from 'multer';
import parser from 'srt-parser-2';
import logger from '../utils/logger.js';

const router = express.Router();

// Supported subtitle formats
const SUPPORTED_FORMATS = ['srt', 'vtt', 'ass', 'sub'];

const SUPPORTED_MIME_TYPES = [
  'text/plain',
  'text/vtt',
  'application/x-subrip',
  'application/octet-stream'
];

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (SUPPORTED_MIME_TYPES.includes(file.mimetype) || SUPPORTED_FORMATS.includes(file.originalname.split('.').pop().toLowerCase())) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only subtitle files (.srt, .vtt, .ass, .sub) are allowed.'));
    }
  }
});

// Helper function to parse SRT format
const parseSRT = (content) => {
  const subtitles = parser.fromSrt(content);
  return subtitles;
};

// Helper function to parse VTT format
const parseVTT = (content) => {
  const lines = content.split('\n');
  const subtitles = [];
  let i = 0;

  // Skip WEBVTT header
  while (i < lines.length && !lines[i].includes('-->')) {
    i++;
  }

  let index = 1;
  while (i < lines.length) {
    const line = lines[i].trim();

    if (line.includes('-->')) {
      const [startStr, endStr] = line.split('-->');
      const start = timeToMs(startStr.trim());
      const end = timeToMs(endStr.trim());

      let text = '';
      i++;
      while (i < lines.length && lines[i].trim() !== '' && !lines[i].includes('-->')) {
        text += (text ? '\n' : '') + lines[i].trim();
        i++;
      }

      if (text) {
        subtitles.push({
          index,
          startTime: msToTime(start),
          endTime: msToTime(end),
          text,
        });
        index++;
      }
    } else {
      i++;
    }
  }

  return subtitles;
};

// Helper function to parse ASS/SSA format
const parseASS = (content) => {
  const lines = content.split('\n');
  const subtitles = [];
  let inEvents = false;
  let index = 1;

  for (const line of lines) {
    if (line.trim() === '[Events]') {
      inEvents = true;
      continue;
    }

    if (inEvents && line.startsWith('Dialogue:')) {
      const parts = line.substring(9).split(',');
      if (parts.length >= 10) {
        const start = parts[1].trim();
        const end = parts[2].trim();
        const text = parts.slice(9).join(',').trim();

        // Remove ASS formatting tags
        const cleanText = text.replace(/{[^}]*}/g, '');

        subtitles.push({
          index,
          startTime: assTimeToSRT(start),
          endTime: assTimeToSRT(end),
          text: cleanText,
        });
        index++;
      }
    }
  }

  return subtitles;
};

// Helper function to parse SUB (MicroDVD) format
const parseSUB = (content) => {
  const lines = content.split('\n');
  const subtitles = [];
  let index = 1;

  for (const line of lines) {
    const match = line.match(/{(\d+)}{(\d+)}(.+)/);
    if (match) {
      const startFrames = parseInt(match[1], 10);
      const endFrames = parseInt(match[2], 10);
      const text = match[3].replace(/\|/g, '\n');

      // Assume 25 fps for frame to time conversion
      const fps = 25;
      const start = Math.floor((startFrames / fps) * 1000);
      const end = Math.floor((endFrames / fps) * 1000);

      subtitles.push({
        index,
        startTime: msToTime(start),
        endTime: msToTime(end),
        text,
      });
      index++;
    }
  }

  return subtitles;
};

// Helper function to convert time string to milliseconds
const timeToMs = (timeStr) => {
  const parts = timeStr.split(':');
  const hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);
  const secondsAndMs = parts[2].split('.');
  const seconds = parseInt(secondsAndMs[0], 10);
  const ms = parseInt((secondsAndMs[1] || '0').padEnd(3, '0'), 10);

  return hours * 3600000 + minutes * 60000 + seconds * 1000 + ms;
};

// Helper function to convert milliseconds to SRT time format
const msToTime = (ms) => {
  const hours = Math.floor(ms / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  const milliseconds = ms % 1000;

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')},${String(milliseconds).padStart(3, '0')}`;
};

// Helper function to convert ASS time format to SRT time format
const assTimeToSRT = (assTime) => {
  // ASS format: h:mm:ss.cc (centiseconds)
  const parts = assTime.split(':');
  const hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);
  const secondsAndCs = parts[2].split('.');
  const seconds = parseInt(secondsAndCs[0], 10);
  const centiseconds = parseInt((secondsAndCs[1] || '0').padEnd(2, '0'), 10);
  const milliseconds = centiseconds * 10;

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')},${String(milliseconds).padStart(3, '0')}`;
};

// Helper function to convert SRT time to milliseconds
const srtTimeToMs = (timeStr) => {
  const parts = timeStr.split(':');
  const hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);
  const secondsAndMs = parts[2].split(',');
  const seconds = parseInt(secondsAndMs[0], 10);
  const ms = parseInt(secondsAndMs[1], 10);

  return hours * 3600000 + minutes * 60000 + seconds * 1000 + ms;
};

// Helper function to convert subtitles to SRT format
const toSRT = (subtitles) => {
  return subtitles
    .map((sub) => `${sub.index}\n${sub.startTime} --> ${sub.endTime}\n${sub.text}\n`)
    .join('\n');
};

// Helper function to convert subtitles to VTT format
const toVTT = (subtitles) => {
  let vtt = 'WEBVTT\n\n';
  vtt += subtitles
    .map((sub) => `${sub.startTime.replace(',', '.')} --> ${sub.endTime.replace(',', '.')}\n${sub.text}\n`)
    .join('\n');
  return vtt;
};

// Helper function to convert subtitles to ASS format
const toASS = (subtitles) => {
  let ass = `[Script Info]
Title: Converted Subtitle

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,Arial,20,&H00FFFFFF,&H000000FF,&H00000000,&H00000000,0,0,0,0,100,100,0,0,1,0,0,2,0,0,0,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
`;

  ass += subtitles
    .map((sub) => {
      const start = sub.startTime.replace(/,/g, '.');
      const end = sub.endTime.replace(/,/g, '.');
      return `Dialogue: 0,${start},${end},Default,,0,0,0,,${sub.text}`;
    })
    .join('\n');

  return ass;
};

// Helper function to convert subtitles to SUB (MicroDVD) format
const toSUB = (subtitles) => {
  const fps = 25;
  return subtitles
    .map((sub) => {
      const startMs = srtTimeToMs(sub.startTime);
      const endMs = srtTimeToMs(sub.endTime);
      const startFrames = Math.floor((startMs / 1000) * fps);
      const endFrames = Math.floor((endMs / 1000) * fps);
      const text = sub.text.replace(/\n/g, '|');
      return `{${startFrames}}{${endFrames}}${text}`;
    })
    .join('\n');
};

// POST /subtitle/convert
router.post('/convert', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Subtitle file is required' });
  }

  const { format, timeShift = 0 } = req.body;

  if (!format) {
    return res.status(400).json({ error: 'Target format is required' });
  }

  const targetFormat = format.toLowerCase();
  if (!SUPPORTED_FORMATS.includes(targetFormat)) {
    return res.status(400).json({
      error: `Unsupported format: ${format}. Supported formats: ${SUPPORTED_FORMATS.join(', ')}`,
    });
  }

  logger.info(`Converting subtitle to ${targetFormat}`);

  // Detect source format from file extension
  const filename = req.file.originalname.toLowerCase();
  let sourceFormat = 'srt';
  for (const fmt of SUPPORTED_FORMATS) {
    if (filename.endsWith(`.${fmt}`)) {
      sourceFormat = fmt;
      break;
    }
  }

  const content = req.file.buffer.toString('utf-8');
  let subtitles;

  // Parse subtitle based on source format
  switch (sourceFormat) {
    case 'srt':
      subtitles = parseSRT(content);
      break;
    case 'vtt':
      subtitles = parseVTT(content);
      break;
    case 'ass':
      subtitles = parseASS(content);
      break;
    case 'sub':
      subtitles = parseSUB(content);
      break;
    default:
      throw new Error(`Unsupported source format: ${sourceFormat}`);
  }

  // Apply time shift if provided
  const timeShiftMs = parseInt(timeShift, 10);
  if (timeShiftMs !== 0) {
    logger.info(`Applying time shift of ${timeShiftMs}ms`);
    subtitles = subtitles.map((sub) => ({
      ...sub,
      startTime: msToTime(srtTimeToMs(sub.startTime) + timeShiftMs),
      endTime: msToTime(srtTimeToMs(sub.endTime) + timeShiftMs),
    }));
  }

  // Convert to target format
  let output;
  switch (targetFormat) {
    case 'srt':
      output = toSRT(subtitles);
      break;
    case 'vtt':
      output = toVTT(subtitles);
      break;
    case 'ass':
      output = toASS(subtitles);
      break;
    case 'sub':
      output = toSUB(subtitles);
      break;
    default:
      throw new Error(`Unsupported target format: ${targetFormat}`);
  }

  logger.info(`Successfully converted subtitle to ${targetFormat}`);

  const contentTypeMap = {
    srt: 'text/plain',
    vtt: 'text/vtt',
    ass: 'text/plain',
    sub: 'text/plain',
  };

  res.setHeader('Content-Type', contentTypeMap[targetFormat]);
  res.setHeader('Content-Disposition', `attachment; filename="converted.${targetFormat}"`);
  res.send(output);
});

export default router;