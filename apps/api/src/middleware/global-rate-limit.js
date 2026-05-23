import rateLimit, { ipKeyGenerator } from 'express-rate-limit';

export const globalRateLimit = rateLimit({
	windowMs: 5 * 60 * 1000,
	max: 100,
	standardHeaders: true,
	legacyHeaders: false,
	message: { error: 'Too many requests, please try again later' },
	validate: { trustProxy: false },
	keyGenerator: ipKeyGenerator,
	skip: (req) => {
		const skipPaths = ['/health', '/sitemap.xml', '/robots.txt', '/ads.txt'];
		return skipPaths.includes(req.path);
	}
});
