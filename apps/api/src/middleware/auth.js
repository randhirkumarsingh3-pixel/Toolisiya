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

  // Fallback to userId for backwards compatibility with older tokens
  const adminId = decoded.adminId || decoded.userId;
  const pb = (await import('../utils/pocketbaseClient.js')).default;
  
  let admin = null;
  try {
    admin = await pb.collection('admin_users').getOne(adminId, { requestKey: null });
  } catch (err) {
    logger.error(`[adminAuthMiddleware] getOne failed for adminId ${adminId}: ${err.message}`);
    console.error(`[adminAuthMiddleware] getOne failed for adminId ${adminId}:`, err);
  }

  if (!admin || (admin.status && admin.status.toLowerCase() !== 'active')) {
    logger.warn(`Unauthorized admin access attempt - admin ID: ${adminId}, Status: ${admin?.status}`);
    return res.status(403).json({ error: 'Admin access denied', details: !admin ? 'Admin not found' : 'Status inactive' });
  }

  req.admin = decoded;
  req.adminData = admin;
  next();
};

export { authMiddleware, adminAuthMiddleware };