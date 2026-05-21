import crypto from 'crypto';

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePhoneNumber = (phone) => {
  const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

const validatePassword = (password) => {
  return password && password.length >= 8;
};

const validateUsername = (username) => {
  return username && username.length >= 3 && /^[a-zA-Z0-9_-]+$/.test(username);
};

const generateUsername = (email) => {
  const baseUsername = email.split('@')[0].replace(/[^a-zA-Z0-9_-]/g, '');
  return baseUsername || `user_${Date.now()}`;
};

// Generate 6-digit OTP code (000000-999999)
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const generateResetToken = () => {
  return crypto.randomBytes(16).toString('hex');
};

export {
  validateEmail,
  validatePhoneNumber,
  validatePassword,
  validateUsername,
  generateUsername,
  generateOTP,
  generateResetToken,
};