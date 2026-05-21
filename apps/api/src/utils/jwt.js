import 'dotenv/config';
import jwt from 'jsonwebtoken';

const generateToken = (userId, email, adminId = null) => {
  const payload = { userId, email };
  if (adminId) {
    payload.adminId = adminId;
  }
  return jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

export { generateToken, verifyToken };