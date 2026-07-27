import 'dotenv/config';
import { verifyToken } from '../utils/jwt.js';
import logger from '../utils/logger.js';

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    logger.warn('Missing authorization header');
    return res.status(401).json({ error: 'Authorization header is required' });
  }

  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;

  const decoded = verifyToken(token);
  if (!decoded) {
    logger.warn('Invalid or expired token');
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  req.user = decoded;
  next();
};

const adminAuthMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    logger.warn('Missing authorization header for admin endpoint');
    return res.status(401).json({ error: 'Authorization header is required' });
  }

  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;

  const decoded = verifyToken(token);
  if (!decoded) {
    logger.warn('Invalid or expired token for admin endpoint');
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  // Verify admin exists and is active
  const pb = (await import('../utils/pocketbaseClient.js')).default;
  const admin = await pb.collection('admin_users').getOne(decoded.adminId, { requestKey: null }).catch(() => null);

  if (!admin || (admin.status !== 'Active' && admin.status !== '')) {
    logger.warn(`Unauthorized admin access attempt - admin ID: ${decoded.adminId}`);
    return res.status(403).json({ error: 'Admin access denied' });
  }

  req.admin = decoded;
  req.adminData = admin;
  next();
};

export { authMiddleware, adminAuthMiddleware };