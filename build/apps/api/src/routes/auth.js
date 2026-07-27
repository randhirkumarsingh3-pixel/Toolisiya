import 'dotenv/config';
import express from 'express';
import bcrypt from 'bcryptjs';
import { OAuth2Client } from 'google-auth-library';
import pb from '../utils/pocketbaseClient.js';
import { generateToken } from '../utils/jwt.js';
import { sendEmail } from '../utils/emailService.js';
import {
  validateEmail,
  validatePhoneNumber,
  validatePassword,
  validateUsername,
  generateUsername,
  generateOTP,
  generateResetToken,
} from '../utils/validators.js';
import logger from '../utils/logger.js';

const router = express.Router();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Helper function to format user response
const formatUserResponse = (user) => ({
  id: user.id,
  username: user.username,
  email: user.email,
  mobile: user.mobile || null,
  name: user.name || null,
});

// POST /auth/signup
router.post('/signup', async (req, res) => {
  const { username, email, mobile, password } = req.body;

  // Validate all fields
  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }
  if (!validateUsername(username)) {
    return res.status(400).json({ error: 'Username must be at least 3 characters and contain only letters, numbers, hyphens, and underscores' });
  }

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }
  if (!validateEmail(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  if (!mobile) {
    return res.status(400).json({ error: 'Mobile number is required' });
  }
  if (!validatePhoneNumber(mobile)) {
    return res.status(400).json({ error: 'Invalid phone number format' });
  }

  if (!password) {
    return res.status(400).json({ error: 'Password is required' });
  }
  if (!validatePassword(password)) {
    return res.status(400).json({ error: 'Password must be at least 8 characters' });
  }

  // Check if username already exists
  const existingUsername = await pb.collection('users').getFirstListItem(`username = "${username}"`, { requestKey: null }).catch(() => null);
  if (existingUsername) {
    return res.status(400).json({ error: 'Username already exists' });
  }

  // Check if email already exists
  const existingEmail = await pb.collection('users').getFirstListItem(`email = "${email}"`, { requestKey: null }).catch(() => null);
  if (existingEmail) {
    return res.status(400).json({ error: 'Email already exists' });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user record in PocketBase
  const newUser = await pb.collection('users').create({
    username,
    email,
    mobile,
    password: password,
    hashedPassword: hashedPassword,
  });

  // Send welcome email
  await sendEmail(
    email,
    'Welcome to Toolisiya',
    `Welcome ${username}! Your account has been created successfully.`
  );

  // Generate JWT token
  const token = generateToken(newUser.id, newUser.email);

  res.status(201).json({
    user: formatUserResponse(newUser),
    token,
  });
});

// POST /auth/signin
router.post('/signin', async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }
  if (!password) {
    return res.status(400).json({ error: 'Password is required' });
  }

  // Query user by email
  const user = await pb.collection('users').getFirstListItem(`email = "${email}"`, { requestKey: null }).catch(() => null);
  if (!user) {
    throw new Error('Invalid credentials');
  }

  // Compare password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid credentials');
  }

  // Generate JWT token
  const token = generateToken(user.id, user.email);

  res.json({
    user: formatUserResponse(user),
    token,
  });
});

// POST /auth/send-otp
router.post('/send-otp', async (req, res) => {
  const { email } = req.body;

  // Step 1: Validate email is provided
  logger.info('Received OTP request for email');
  if (!email) {
    logger.warn('OTP request missing email field');
    return res.status(400).json({ success: false, error: 'Email is required' });
  }

  // Step 2: Validate email format
  logger.info(`Validating email format: ${email}`);
  if (!validateEmail(email)) {
    logger.warn(`Invalid email format provided: ${email}`);
    return res.status(400).json({ success: false, error: 'Invalid email format' });
  }

  logger.info(`Requesting OTP from PocketBase for email: ${email}`);

  // Step 3: Request OTP from PocketBase
  // PocketBase will generate OTP and send email automatically
  const otpResponse = await pb.collection('users').requestOTP(email);
  logger.info(`OTP requested successfully from PocketBase for email: ${email}`);
  logger.info(`OTP ID returned: ${otpResponse.otpId}`);

  // Step 4: Return success response with otpId
  logger.info(`OTP sent successfully for email: ${email}`);
  res.status(200).json({
    success: true,
    message: 'OTP sent to email',
    otpId: otpResponse.otpId,
  });
});

// POST /auth/verify-otp
router.post('/verify-otp', async (req, res) => {
  const { otpId, code } = req.body;

  // Validate input
  if (!otpId) {
    return res.status(400).json({ success: false, error: 'OTP ID is required' });
  }
  if (!code) {
    return res.status(400).json({ success: false, error: 'OTP code is required' });
  }

  logger.info(`Verifying OTP with ID: ${otpId}`);

  // Authenticate using PocketBase authWithOTP method
  // This method validates the OTP code against the stored OTP
  const authData = await pb.collection('users').authWithOTP(otpId, code);
  logger.info(`OTP verified successfully for user: ${authData.record.id}`);

  // Extract user record from auth response
  const user = authData.record;

  // Generate JWT token
  const token = generateToken(user.id, user.email);

  logger.info(`JWT token generated for user: ${user.id}`);

  res.json({
    success: true,
    token,
    user: formatUserResponse(user),
  });
});

// POST /auth/google-callback
router.post('/google-callback', async (req, res) => {
  const { code } = req.body;

  // Validate code is provided
  if (!code) {
    return res.status(400).json({ success: false, error: 'Authorization code is required' });
  }

  logger.info('Received Google OAuth callback');

  // Exchange authorization code for tokens
  logger.info('Exchanging authorization code for tokens');
  const { tokens } = await googleClient.getToken(code);
  logger.info('Successfully exchanged code for tokens');

  // Verify token signature with Google public keys
  logger.info('Verifying token signature with Google');
  const ticket = await googleClient.verifyIdToken({
    idToken: tokens.id_token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  logger.info('Token signature verified successfully');

  // Extract user data from token
  const payload = ticket.getPayload();
  const { email, name, picture } = payload;
  const googleId = payload.sub;

  logger.info(`Extracted user data - email: ${email}, name: ${name}`);

  // Query user by email
  let user = await pb.collection('users').getFirstListItem(`email = "${email}"`, { requestKey: null }).catch(() => null);

  if (user) {
    // Update google_id and last_login if user exists
    logger.info(`User exists, updating google_id and last_login for user: ${user.id}`);
    user = await pb.collection('users').update(user.id, {
      google_id: googleId,
      last_login: new Date().toISOString(),
    });
    logger.info(`User updated successfully: ${user.id}`);
  } else {
    // Create new user with auto-generated username
    logger.info(`Creating new user with email: ${email}`);
    const generatedUsername = generateUsername(email);
    logger.info(`Generated username: ${generatedUsername}`);
    
    user = await pb.collection('users').create({
      username: generatedUsername,
      email,
      name: name || null,
      google_id: googleId,
      profile_picture: picture || null,
      mobile: null,
      password: 'google_auth_' + Date.now(),
      passwordConfirm: 'google_auth_' + Date.now(),
    });
    logger.info(`New user created with ID: ${user.id}`);
  }

  // Generate JWT token
  const token = generateToken(user.id, user.email);

  logger.info(`Google OAuth successful for user: ${user.id}`);

  res.json({
    success: true,
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name || null,
      picture: user.profile_picture || null,
    },
  });
});

// POST /auth/admin/login
router.post('/admin/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email) return res.status(400).json({ error: 'Email is required' });
  if (!password) return res.status(400).json({ error: 'Password is required' });

  logger.info(`Admin login attempt for email: ${email}`);

  try {
    // Directly query the admin_users table — these accounts exist only in DB, not in Supabase Auth
    const { data: adminList, error: fetchError } = await (await import('../utils/supabaseClient.js')).supabase
      .from('admin_users')
      .select('*')
      .eq('email', email)
      .limit(1);

    if (fetchError) {
      logger.error('Admin lookup error:', fetchError.message);
      return res.status(500).json({ error: 'Internal server error' });
    }

    const admin = adminList?.[0];
    if (!admin) {
      logger.warn(`Admin login failed: no account found for ${email}`);
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Verify password using bcrypt against the stored hash
    const passwordMatch = await bcrypt.compare(password, admin.password);
    if (!passwordMatch) {
      logger.warn(`Admin login failed: wrong password for ${email}`);
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Update last_login timestamp
    await (await import('../utils/supabaseClient.js')).supabase
      .from('admin_users')
      .update({ last_login: new Date().toISOString(), lastLogin: new Date().toISOString() })
      .eq('id', admin.id);

    logger.info(`Admin authenticated successfully: ${email}`);

    // Generate JWT token
    const token = generateToken(admin.id, admin.email, admin.id);

    res.json({
      token,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name || null,
        role: admin.role || 'admin',
      },
      role: admin.role || 'admin',
    });
  } catch (err) {
    logger.error('Admin login error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// POST /auth/forgot-password
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  // Validate email
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }
  if (!validateEmail(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  // Query user by email (don't reveal if exists)
  const user = await pb.collection('users').getFirstListItem(`email = "${email}"`, { requestKey: null }).catch(() => null);

  if (user) {
    // Generate reset token
    const token = generateResetToken();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();

    // Store reset token in PocketBase
    await pb.collection('password_reset_tokens').create({
      email,
      token,
      expires_at: expiresAt,
    });

    // Send reset email
    const resetLink = `https://toolisiya.com/reset-password?token=${token}`;
    await sendEmail(
      email,
      'Password Reset Request',
      `Click the link to reset your password: ${resetLink}`
    );
  }

  // Always return success (security: don't reveal if email exists)
  res.json({
    success: true,
    message: 'Check your email for password reset link',
  });
});

export default router;