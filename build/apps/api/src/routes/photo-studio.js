import { Router } from 'express';
import multer from 'multer';

const router = Router();

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage, limits: { fileSize: 10 * 1024 * 1024 } }); // 10MB limit

// In-memory queue simulation
const jobs = new Map();

router.post('/remove-bg', upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No image file provided' });
        }

        const jobId = `job_${Date.now()}_${Math.random().toString(36).substring(7)}`;
        
        // Convert buffer to base64 data URL
        const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

        // Store job in memory
        jobs.set(jobId, {
            status: 'processing',
            image: base64Image,
            startTime: Date.now(),
        });

        console.log(`[Photo Studio] Created BG removal job: ${jobId}`);

        return res.json({ jobId, status: 'processing' });
    } catch (error) {
        console.error('BG removal simulation error:', error);
        res.status(500).json({ error: 'Failed to process image' });
    }
});

router.get('/job/:id', (req, res) => {
    const { id } = req.params;
    const job = jobs.get(id);

    if (!job) {
        return res.status(404).json({ error: 'Job not found' });
    }

    // Simulate 3 seconds processing time
    if (Date.now() - job.startTime > 3000) {
        if (job.status === 'processing') {
            job.status = 'completed';
            console.log(`[Photo Studio] Completed BG removal job: ${id}`);
        }
        return res.json({
            jobId: id,
            status: 'completed',
            // In a real app, this would be the transparent PNG from the AI model
            resultUrl: job.image, 
        });
    }

    // Still processing
    return res.json({
        jobId: id,
        status: 'processing',
    });
});

export default router;
