import 'dotenv/config';
import express from 'express';
import bcrypt from 'bcryptjs';
import pb from '../utils/pocketbaseClient.js';
import { adminAuthMiddleware } from '../middleware/index.js';
import { loginRateLimiter } from '../middleware/rate-limiter.js';
import { generateToken } from '../utils/jwt.js';
import { sendEmail } from '../utils/emailService.js';
import { validatePassword } from '../utils/validators.js';
import logger from '../utils/logger.js';

const router = express.Router();

// In-memory store for tracking failed login attempts
// Structure: { email: { attempts: number, lastAttempt: timestamp, lockedUntil: timestamp } }
const failedLoginAttempts = new Map();

// Configuration from environment variables
const LOCKOUT_THRESHOLD = parseInt(process.env.ADMIN_LOCKOUT_THRESHOLD || '5', 10);
const LOCKOUT_DURATION = parseInt(process.env.ADMIN_LOCKOUT_DURATION || '1800000', 10); // 30 minutes

// Helper function to format admin response
const formatAdminResponse = (admin) => ({
  id: admin.id,
  email: admin.email,
  name: admin.name || null,
  role: admin.role || 'admin',
});

// Helper function to check if admin account is locked
const isAccountLocked = (email) => {
  const record = failedLoginAttempts.get(email);
  if (!record) return false;
  
  const now = Date.now();
  if (record.lockedUntil && now < record.lockedUntil) {
    return true;
  }
  
  // Unlock if lockout period has expired
  if (record.lockedUntil && now >= record.lockedUntil) {
    failedLoginAttempts.delete(email);
    return false;
  }
  
  return false;
};

// Helper function to get remaining lockout time in seconds
const getRemainingLockoutTime = (email) => {
  const record = failedLoginAttempts.get(email);
  if (!record || !record.lockedUntil) return 0;
  
  const remaining = Math.ceil((record.lockedUntil - Date.now()) / 1000);
  return remaining > 0 ? remaining : 0;
};

// Helper function to record failed login attempt
const recordFailedAttempt = async (email, ip) => {
  const now = Date.now();
  const record = failedLoginAttempts.get(email) || { attempts: 0, lastAttempt: now, lockedUntil: null };
  
  record.attempts += 1;
  record.lastAttempt = now;
  
  // Lock account if threshold reached
  if (record.attempts >= LOCKOUT_THRESHOLD) {
    record.lockedUntil = now + LOCKOUT_DURATION;
    logger.warn(`Admin account locked due to failed login attempts: ${email} from IP: ${ip}`);
  }
  
  failedLoginAttempts.set(email, record);
  
  // Log failed attempt
  try {
    await pb.collection('admin_login_logs').create({
      email,
      ip_address: ip,
      status: 'failed',
      reason: record.attempts >= LOCKOUT_THRESHOLD ? 'account_locked' : 'invalid_credentials',
      attempt_number: record.attempts,
    });
  } catch (error) {
    logger.error(`Failed to log login attempt: ${error.message}`);
  }
};

// Helper function to clear failed attempts on successful login
const clearFailedAttempts = (email) => {
  failedLoginAttempts.delete(email);
};

// Helper function to add security headers to response
const addSecurityHeaders = (res) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
};

// POST /admin/login - with rate limiting
router.post('/login', loginRateLimiter, async (req, res) => {
  const { email, password } = req.body;
  const clientIp = req.ip || req.connection.remoteAddress || 'unknown';

  // Add security headers
  addSecurityHeaders(res);

  // Validate input
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }
  if (!password) {
    return res.status(400).json({ error: 'Password is required' });
  }

  logger.info(`Admin login attempt for email: ${email} from IP: ${clientIp}`);

  // Check if account is locked
  if (isAccountLocked(email)) {
    const remainingTime = getRemainingLockoutTime(email);
    logger.warn(`Login attempt on locked account: ${email} from IP: ${clientIp}`);
    return res.status(423).json({
      error: 'Account is locked due to too many failed login attempts',
      lockedUntil: remainingTime,
      message: `Please try again in ${remainingTime} seconds`,
    });
  }

  // Authenticate against admin_users collection
  const authData = await pb.collection('admin_users').authWithPassword(email, password).catch(() => null);
  
  if (!authData) {
    logger.warn(`Failed login attempt for email: ${email} from IP: ${clientIp}`);
    await recordFailedAttempt(email, clientIp);
    throw new Error('Invalid credentials');
  }

  // Clear failed attempts on successful login
  clearFailedAttempts(email);

  logger.info(`Admin authenticated successfully: ${email}`);

  // Update last_login timestamp
  const admin = await pb.collection('admin_users').update(authData.record.id, {
    last_login: new Date().toISOString(),
  });
  logger.info(`Updated last_login for admin: ${email}`);

  // Log successful login
  try {
    await pb.collection('admin_login_logs').create({
      email,
      ip_address: clientIp,
      status: 'success',
      reason: 'valid_credentials',
      attempt_number: 1,
    });
  } catch (error) {
    logger.error(`Failed to log successful login: ${error.message}`);
  }

  // Generate JWT token with adminId
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
});

// GET /admin/dashboard-stats
router.get('/dashboard-stats', adminAuthMiddleware, async (req, res) => {
  addSecurityHeaders(res);
  logger.info(`Dashboard stats requested by admin: ${req.admin.email}`);

  // Get total users count
  const totalUsers = await pb.collection('users').getFullList({ fields: 'id' });
  const totalUsersCount = totalUsers.length;

  // Get active users (users with activity in last 30 days)
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const activeUsers = await pb.collection('activity_logs')
    .getFullList({
      filter: `created >= "${thirtyDaysAgo}"`,
      fields: 'user_id',
    })
    .then(logs => new Set(logs.map(log => log.user_id)).size);

  // Get total tools count
  const totalTools = await pb.collection('tools').getFullList({ fields: 'id' });
  const totalToolsCount = totalTools.length;

  // Get new users this month
  const thisMonthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();
  const newUsersThisMonth = await pb.collection('users')
    .getFullList({
      filter: `created >= "${thisMonthStart}"`,
      fields: 'id',
    })
    .then(users => users.length);

  // Get tool uses this month
  const toolUsesThisMonth = await pb.collection('activity_logs')
    .getFullList({
      filter: `created >= "${thisMonthStart}"`,
      fields: 'id',
    })
    .then(logs => logs.length);

  // Calculate average session duration (in seconds)
  const allLogs = await pb.collection('activity_logs').getFullList({ fields: 'session_duration' });
  const averageSessionDuration = allLogs.length > 0
    ? allLogs.reduce((sum, log) => sum + (log.session_duration || 0), 0) / allLogs.length
    : 0;

  // Calculate bounce rate (sessions with only 1 page view)
  const allSessions = await pb.collection('activity_logs').getFullList({ fields: 'session_id' });
  const sessionCounts = {};
  allSessions.forEach(log => {
    sessionCounts[log.session_id] = (sessionCounts[log.session_id] || 0) + 1;
  });
  const bouncedSessions = Object.values(sessionCounts).filter(count => count === 1).length;
  const bounceRate = Object.keys(sessionCounts).length > 0
    ? (bouncedSessions / Object.keys(sessionCounts).length) * 100
    : 0;

  res.json({
    totalUsers: totalUsersCount,
    activeUsers,
    totalTools: totalToolsCount,
    newUsersThisMonth,
    toolUsesThisMonth,
    averageSessionDuration: Math.round(averageSessionDuration),
    bounceRate: Math.round(bounceRate * 100) / 100,
  });
});

// GET /admin/users
router.get('/users', adminAuthMiddleware, async (req, res) => {
  addSecurityHeaders(res);
  const { page = 1, limit = 10, search = '', status = '', sort = '-created' } = req.query;

  logger.info(`Users list requested by admin: ${req.admin.email}`);

  let filter = '';

  // Add search filter
  if (search) {
    filter += `(username ~ "${search}" || email ~ "${search}" || name ~ "${search}")`;
  }

  // Add status filter
  if (status) {
    if (filter) filter += ' && ';
    filter += `status = "${status}"`;
  }

  try {
    const users = await pb.collection('users').getList(page, limit, {
      filter: filter || undefined,
      sort,
    });

    res.json({
      items: users.items.map(u => ({
        id: u.id,
        email: u.email,
        username: u.username,
        name: u.name,
        status: u.status || 'Active', // 'users' table might not have status
        created: u.created,
        lastLogin: u.last_login
      })),
      page: users.page,
      perPage: users.perPage,
      totalItems: users.totalItems,
      totalPages: users.totalPages,
    });
  } catch (err) {
    logger.error('Error fetching app users:', err);
    res.status(500).json({ error: 'Failed to fetch app users' });
  }
});

// GET /admin/admin_users
router.get('/admin_users', adminAuthMiddleware, async (req, res) => {
  addSecurityHeaders(res);
  const { page = 1, limit = 50 } = req.query;
  logger.info(`Admin users list requested by admin: ${req.admin.email}`);
  try {
    const users = await pb.collection('admin_users').getList(page, limit);
    res.json({
      items: users.items.map(u => ({
        id: u.id,
        email: u.email,
        name: u.name,
        role: u.role,
        status: u.status,
        created: u.created,
        lastLogin: u.last_login
      })),
      page: users.page,
      perPage: users.perPage,
      totalItems: users.totalItems,
      totalPages: users.totalPages,
    });
  } catch (err) {
    logger.error('Error fetching admin users:', err);
    res.status(500).json({ error: 'Failed to fetch admin users' });
  }
});

// POST /admin/admin_users
router.post('/admin_users', adminAuthMiddleware, async (req, res) => {
  addSecurityHeaders(res);
  const { email, name, role, status, password, passwordConfirm } = req.body;
  logger.info(`Creating admin user: ${email} by admin: ${req.admin.email}`);
  
  const user = await pb.collection('admin_users').create({
    email,
    name,
    role,
    status,
    password,
    passwordConfirm,
    emailVisibility: true
  });
  res.status(201).json(user);
});

// PUT /admin/admin_users/:id
router.put('/admin_users/:id', adminAuthMiddleware, async (req, res) => {
  addSecurityHeaders(res);
  const { id } = req.params;
  const { name, email, role, status } = req.body;
  logger.info(`Updating admin user: ${id} by admin: ${req.admin.email}`);
  
  const updateData = {};
  if (name !== undefined) updateData.name = name;
  if (email !== undefined) updateData.email = email;
  if (role !== undefined) updateData.role = role;
  if (status !== undefined) updateData.status = status;

  const user = await pb.collection('admin_users').update(id, updateData);
  res.json(user);
});

// DELETE /admin/admin_users/:id
router.delete('/admin_users/:id', adminAuthMiddleware, async (req, res) => {
  addSecurityHeaders(res);
  const { id } = req.params;
  logger.info(`Deleting admin user: ${id} by admin: ${req.admin.email}`);
  await pb.collection('admin_users').delete(id);
  res.json({ success: true });
});

// GET /admin/users
router.get('/tools', adminAuthMiddleware, async (req, res) => {
  addSecurityHeaders(res);
  const { page = 1, limit = 10, search = '', category = '', sort = '-created' } = req.query;

  logger.info(`Tools list requested by admin: ${req.admin.email}`);

  let filter = '';

  // Add search filter
  if (search) {
    filter += `(name ~ "${search}" || description ~ "${search}")`;
  }

  // Add category filter
  if (category) {
    if (filter) filter += ' && ';
    filter += `category = "${category}"`;
  }

  const tools = await pb.collection('tools').getList(page, limit, {
    filter: filter || undefined,
    sort,
  });

  res.json({
    items: tools.items.map(tool => ({
      id: tool.id,
      name: tool.name,
      description: tool.description || null,
      category: tool.category || null,
      icon: tool.icon || null,
      thumbnail: tool.thumbnail || null,
      enabled: tool.enabled !== false,
      usageCount: tool.usage_count || 0,
      popularityRank: tool.popularity_rank || 0,
      created: tool.created,
      updated: tool.updated,
    })),
    page: tools.page,
    perPage: tools.perPage,
    totalItems: tools.totalItems,
    totalPages: tools.totalPages,
  });
});

// POST /admin/tools
router.post('/tools', adminAuthMiddleware, async (req, res) => {
  addSecurityHeaders(res);
  const { name, description, category, icon, thumbnail, enabled } = req.body;

  // Validate required fields
  if (!name) {
    return res.status(400).json({ error: 'Tool name is required' });
  }

  logger.info(`Creating new tool: ${name} by admin: ${req.admin.email}`);

  const tool = await pb.collection('tools').create({
    name,
    description: description || null,
    category: category || null,
    icon: icon || null,
    thumbnail: thumbnail || null,
    enabled: enabled !== false,
  });

  logger.info(`Tool created successfully with ID: ${tool.id}`);

  // Log admin action
  await pb.collection('admin_logs').create({
    admin_id: req.admin.adminId,
    action: 'create_tool',
    entity_type: 'tool',
    entity_id: tool.id,
    details: `Created tool: ${name}`,
  });

  res.status(201).json({
    id: tool.id,
    name: tool.name,
    description: tool.description || null,
    category: tool.category || null,
    icon: tool.icon || null,
    thumbnail: tool.thumbnail || null,
    enabled: tool.enabled,
    created: tool.created,
  });
});

// PUT /admin/tools/:toolId
router.put('/tools/:toolId', adminAuthMiddleware, async (req, res) => {
  addSecurityHeaders(res);
  const { toolId } = req.params;
  const { name, description, category, icon, thumbnail, status, url, usageCount, popularityRank } = req.body;

  logger.info(`Updating tool: ${toolId} by admin: ${req.admin.email}`);

  const updateData = {};
  if (name !== undefined) updateData.name = name;
  if (description !== undefined) updateData.description = description;
  if (category !== undefined) updateData.category = category;
  if (icon !== undefined) updateData.icon = icon;
  if (thumbnail !== undefined) updateData.thumbnail = thumbnail;
  if (status !== undefined) updateData.status = status;
  if (url !== undefined) updateData.url = url;
  if (usageCount !== undefined) updateData.usage_count = usageCount;
  if (popularityRank !== undefined) updateData.popularity_rank = popularityRank;

  const tool = await pb.collection('tools').update(toolId, updateData);

  logger.info(`Tool updated successfully: ${toolId}`);

  // Log admin action
  await pb.collection('admin_logs').create({
    admin_id: req.admin.adminId,
    action: 'update_tool',
    entity_type: 'tool',
    entity_id: toolId,
    details: `Updated tool: ${tool.name}`,
  });

  res.json({
    id: tool.id,
    name: tool.name,
    description: tool.description || null,
    category: tool.category || null,
    icon: tool.icon || null,
    thumbnail: tool.thumbnail || null,
    enabled: tool.enabled,
    usageCount: tool.usage_count || 0,
    popularityRank: tool.popularity_rank || 0,
    updated: tool.updated,
  });
});

// DELETE /admin/tools/:toolId
router.delete('/tools/:toolId', adminAuthMiddleware, async (req, res) => {
  addSecurityHeaders(res);
  const { toolId } = req.params;

  logger.info(`Deleting tool: ${toolId} by admin: ${req.admin.email}`);

  // Get tool name before deletion for logging
  const tool = await pb.collection('tools').getOne(toolId);

  await pb.collection('tools').delete(toolId);

  logger.info(`Tool deleted successfully: ${toolId}`);

  // Log admin action
  await pb.collection('admin_logs').create({
    admin_id: req.admin.adminId,
    action: 'delete_tool',
    entity_type: 'tool',
    entity_id: toolId,
    details: `Deleted tool: ${tool.name}`,
  });

  res.json({
    success: true,
    message: `Tool "${tool.name}" deleted successfully`,
  });
});

// POST /admin/categories
router.post('/categories', adminAuthMiddleware, async (req, res) => {
  addSecurityHeaders(res);
  const { name, slug, icon, description, is_active, order } = req.body;

  if (!name || !slug) {
    return res.status(400).json({ error: 'Name and slug are required' });
  }

  logger.info(`Creating new category: ${name} by admin: ${req.admin.email}`);

  const category = await pb.collection('categories').create({
    name,
    slug,
    icon: icon || 'Layers',
    description: description || null,
    is_active: is_active !== false,
    order: order || 0,
  });

  // Log admin action
  await pb.collection('admin_logs').create({
    admin_id: req.admin.adminId,
    action: 'create_category',
    entity_type: 'category',
    entity_id: category.id,
    details: `Created category: ${name}`,
  });

  res.status(201).json(category);
});

// PUT /admin/categories/:categoryId
router.put('/categories/:categoryId', adminAuthMiddleware, async (req, res) => {
  addSecurityHeaders(res);
  const { categoryId } = req.params;
  const { name, slug, icon, description, is_active, order } = req.body;

  logger.info(`Updating category: ${categoryId} by admin: ${req.admin.email}`);

  const updateData = {};
  if (name !== undefined) updateData.name = name;
  if (slug !== undefined) updateData.slug = slug;
  if (icon !== undefined) updateData.icon = icon;
  if (description !== undefined) updateData.description = description;
  if (is_active !== undefined) updateData.is_active = is_active;
  if (order !== undefined) updateData.order = order;

  const category = await pb.collection('categories').update(categoryId, updateData);

  // Log admin action
  await pb.collection('admin_logs').create({
    admin_id: req.admin.adminId,
    action: 'update_category',
    entity_type: 'category',
    entity_id: categoryId,
    details: `Updated category: ${category.name}`,
  });

  res.json(category);
});

// DELETE /admin/categories/:categoryId
router.delete('/categories/:categoryId', adminAuthMiddleware, async (req, res) => {
  addSecurityHeaders(res);
  const { categoryId } = req.params;

  logger.info(`Deleting category: ${categoryId} by admin: ${req.admin.email}`);
  const category = await pb.collection('categories').getOne(categoryId);
  await pb.collection('categories').delete(categoryId);

  // Log admin action
  await pb.collection('admin_logs').create({
    admin_id: req.admin.adminId,
    action: 'delete_category',
    entity_type: 'category',
    entity_id: categoryId,
    details: `Deleted category: ${category.name}`,
  });

  res.json({ success: true });
});

// GET /admin/settings
router.get('/settings', adminAuthMiddleware, async (req, res) => {
  addSecurityHeaders(res);
  logger.info(`Settings requested by admin: ${req.admin.email}`);

  const settings = await pb.collection('website_settings').getFullList();

  res.json(
    settings.map(setting => ({
      id: setting.id,
      key: setting.setting_key,
      value: setting.setting_value,
      created: setting.created,
      updated: setting.updated,
    }))
  );
});

// POST /admin/settings
router.post('/settings', adminAuthMiddleware, async (req, res) => {
  addSecurityHeaders(res);
  const { setting_key, setting_value } = req.body;

  // Validate required fields
  if (!setting_key) {
    return res.status(400).json({ error: 'Setting key is required' });
  }
  if (setting_value === undefined) {
    return res.status(400).json({ error: 'Setting value is required' });
  }

  logger.info(`Creating/updating setting: ${setting_key} by admin: ${req.admin.email}`);

  // Check if setting exists
  const existing = await pb.collection('website_settings')
    .getFirstListItem(`setting_key = "${setting_key}"`, { requestKey: null })
    .catch(() => null);

  let setting;
  if (existing) {
    setting = await pb.collection('website_settings').update(existing.id, {
      setting_value,
    });
    logger.info(`Setting updated: ${setting_key}`);
  } else {
    setting = await pb.collection('website_settings').create({
      setting_key,
      setting_value,
    });
    logger.info(`Setting created: ${setting_key}`);
  }

  // Log admin action
  await pb.collection('admin_logs').create({
    admin_id: req.admin.adminId,
    action: 'update_setting',
    entity_type: 'setting',
    entity_id: setting.id,
    details: `Updated setting: ${setting_key}`,
  });

  res.json({
    id: setting.id,
    key: setting.setting_key,
    value: setting.setting_value,
    updated: setting.updated,
  });
});

// GET /admin/seo-settings
router.get('/seo-settings', adminAuthMiddleware, async (req, res) => {
  addSecurityHeaders(res);
  logger.info(`SEO settings requested by admin: ${req.admin.email}`);

  const seoSettings = await pb.collection('seo_settings').getFullList();

  res.json(
    seoSettings.map(setting => ({
      id: setting.id,
      pageType: setting.page_type,
      pageId: setting.page_id || null,
      metaTitle: setting.meta_title,
      metaDescription: setting.meta_description || null,
      metaKeywords: setting.meta_keywords || null,
      slug: setting.slug || null,
      created: setting.created,
      updated: setting.updated,
    }))
  );
});

// POST /admin/seo-settings
router.post('/seo-settings', adminAuthMiddleware, async (req, res) => {
  addSecurityHeaders(res);
  const { page_type, page_id, meta_title, meta_description, meta_keywords, slug } = req.body;

  // Validate required fields
  if (!page_type) {
    return res.status(400).json({ error: 'Page type is required' });
  }
  if (!meta_title) {
    return res.status(400).json({ error: 'Meta title is required' });
  }

  logger.info(`Creating/updating SEO setting for page: ${page_type} by admin: ${req.admin.email}`);

  // Check if SEO setting exists for this page
  let filter = `page_type = "${page_type}"`;
  if (page_id) {
    filter += ` && page_id = "${page_id}"`;
  }

  const existing = await pb.collection('seo_settings')
    .getFirstListItem(filter, { requestKey: null })
    .catch(() => null);

  let seoSetting;
  if (existing) {
    seoSetting = await pb.collection('seo_settings').update(existing.id, {
      meta_title,
      meta_description: meta_description || null,
      meta_keywords: meta_keywords || null,
      slug: slug || null,
    });
    logger.info(`SEO setting updated for page: ${page_type}`);
  } else {
    seoSetting = await pb.collection('seo_settings').create({
      page_type,
      page_id: page_id || null,
      meta_title,
      meta_description: meta_description || null,
      meta_keywords: meta_keywords || null,
      slug: slug || null,
    });
    logger.info(`SEO setting created for page: ${page_type}`);
  }

  // Log admin action
  await pb.collection('admin_logs').create({
    admin_id: req.admin.adminId,
    action: 'update_seo_setting',
    entity_type: 'seo_setting',
    entity_id: seoSetting.id,
    details: `Updated SEO setting for page: ${page_type}`,
  });

  res.json({
    id: seoSetting.id,
    pageType: seoSetting.page_type,
    pageId: seoSetting.page_id || null,
    metaTitle: seoSetting.meta_title,
    metaDescription: seoSetting.meta_description || null,
    metaKeywords: seoSetting.meta_keywords || null,
    slug: seoSetting.slug || null,
    updated: seoSetting.updated,
  });
});

// GET /admin/social-links
router.get('/social-links', adminAuthMiddleware, async (req, res) => {
  addSecurityHeaders(res);
  logger.info(`Social links requested by admin: ${req.admin.email}`);

  const socialLinks = await pb.collection('social_links').getFullList();

  res.json(
    socialLinks.map(link => ({
      id: link.id,
      platform: link.platform,
      url: link.url,
      enabled: link.enabled !== false,
      created: link.created,
      updated: link.updated,
    }))
  );
});

// POST /admin/social-links
router.post('/social-links', adminAuthMiddleware, async (req, res) => {
  addSecurityHeaders(res);
  const { platform, url, enabled } = req.body;

  // Validate required fields
  if (!platform) {
    return res.status(400).json({ error: 'Platform is required' });
  }
  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  logger.info(`Creating/updating social link for platform: ${platform} by admin: ${req.admin.email}`);

  // Check if social link exists for this platform
  const existing = await pb.collection('social_links')
    .getFirstListItem(`platform = "${platform}"`, { requestKey: null })
    .catch(() => null);

  let socialLink;
  if (existing) {
    socialLink = await pb.collection('social_links').update(existing.id, {
      url,
      enabled: enabled !== false,
    });
    logger.info(`Social link updated for platform: ${platform}`);
  } else {
    socialLink = await pb.collection('social_links').create({
      platform,
      url,
      enabled: enabled !== false,
    });
    logger.info(`Social link created for platform: ${platform}`);
  }

  // Log admin action
  await pb.collection('admin_logs').create({
    admin_id: req.admin.adminId,
    action: 'update_social_link',
    entity_type: 'social_link',
    entity_id: socialLink.id,
    details: `Updated social link for platform: ${platform}`,
  });

  res.json({
    id: socialLink.id,
    platform: socialLink.platform,
    url: socialLink.url,
    enabled: socialLink.enabled,
    updated: socialLink.updated,
  });
});

// GET /admin/notifications
router.get('/notifications', adminAuthMiddleware, async (req, res) => {
  addSecurityHeaders(res);
  const { page = 1, limit = 10, read = '' } = req.query;

  logger.info(`Notifications requested by admin: ${req.admin.email}`);

  let filter = `admin_id = "${req.admin.adminId}"`;

  // Add read filter
  if (read === 'true') {
    filter += ' && is_read = true';
  } else if (read === 'false') {
    filter += ' && is_read = false';
  }

  const notifications = await pb.collection('notifications').getList(page, limit, {
    filter,
    sort: '-created',
  });

  res.json({
    items: notifications.items.map(notif => ({
      id: notif.id,
      title: notif.title,
      message: notif.message,
      type: notif.type || 'info',
      isRead: notif.is_read,
      created: notif.created,
    })),
    page: notifications.page,
    perPage: notifications.perPage,
    totalItems: notifications.totalItems,
    totalPages: notifications.totalPages,
  });
});

// PUT /admin/notifications/:notificationId
router.put('/notifications/:notificationId', adminAuthMiddleware, async (req, res) => {
  addSecurityHeaders(res);
  const { notificationId } = req.params;
  const { read } = req.body;

  logger.info(`Updating notification: ${notificationId} by admin: ${req.admin.email}`);

  const notification = await pb.collection('notifications').update(notificationId, {
    is_read: read === true,
  });

  logger.info(`Notification updated: ${notificationId}`);

  res.json({
    id: notification.id,
    title: notification.title,
    message: notification.message,
    type: notification.type || 'info',
    isRead: notification.is_read,
    updated: notification.updated,
  });
});

// POST /admin/logs
router.post('/logs', adminAuthMiddleware, async (req, res) => {
  addSecurityHeaders(res);
  const { action, entity_type, entity_id, details } = req.body;

  // Validate required fields
  if (!action) {
    return res.status(400).json({ error: 'Action is required' });
  }
  if (!entity_type) {
    return res.status(400).json({ error: 'Entity type is required' });
  }

  logger.info(`Creating admin log: ${action} by admin: ${req.admin.email}`);

  const log = await pb.collection('admin_logs').create({
    admin_id: req.admin.adminId,
    action,
    entity_type,
    entity_id: entity_id || null,
    details: details || null,
  });

  logger.info(`Admin log created with ID: ${log.id}`);

  res.status(201).json({
    id: log.id,
    action: log.action,
    entityType: log.entity_type,
    entityId: log.entity_id || null,
    details: log.details || null,
    created: log.created,
  });
});

// POST /admin/update-password
router.post('/update-password', adminAuthMiddleware, async (req, res) => {
  addSecurityHeaders(res);
  const { currentPassword, newPassword, confirmPassword, adminId } = req.body;

  // Validate required fields
  if (!newPassword) {
    return res.status(400).json({ error: 'New password is required' });
  }
  if (!confirmPassword) {
    return res.status(400).json({ error: 'Password confirmation is required' });
  }
  if (!adminId) {
    return res.status(400).json({ error: 'Admin ID is required' });
  }

  // Validate new password strength
  if (!validatePassword(newPassword)) {
    return res.status(400).json({ error: 'Password must be at least 8 characters' });
  }

  // Validate passwords match
  if (newPassword !== confirmPassword) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  // Validate that adminId matches the authenticated admin
  if (adminId !== req.admin.adminId) {
    logger.warn(`Unauthorized password update attempt - admin ID mismatch: ${req.admin.adminId} vs ${adminId}`);
    throw new Error('Unauthorized: Cannot update password for another admin');
  }

  logger.info(`Password update requested for admin: ${req.admin.email}`);

  // If currentPassword is provided, verify it
  if (currentPassword) {
    logger.info(`Verifying current password for admin: ${req.admin.email}`);
    const admin = await pb.collection('admin_users').getOne(adminId);
    const isPasswordValid = await bcrypt.compare(currentPassword, admin.password);
    if (!isPasswordValid) {
      logger.warn(`Invalid current password provided for admin: ${req.admin.email}`);
      throw new Error('Current password is incorrect');
    }
  }

  // Hash new password
  logger.info(`Hashing new password for admin: ${req.admin.email}`);
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Update password in admin_users collection
  logger.info(`Updating password in database for admin: ${req.admin.email}`);
  await pb.collection('admin_users').update(adminId, {
    password: hashedPassword,
    passwordConfirm: hashedPassword,
  });

  logger.info(`Password updated successfully for admin: ${req.admin.email}`);

  // Send password reset confirmation email via PocketBase hook
  // The email will be sent through PocketBase's built-in mailer
  logger.info(`Sending password reset confirmation email to: ${req.admin.email}`);
  await sendEmail(
    req.admin.email,
    'Password Changed Successfully',
    `Your admin password has been changed successfully. If you did not make this change, please contact support immediately.`
  );

  // Log admin action
  await pb.collection('admin_logs').create({
    admin_id: req.admin.adminId,
    action: 'update_password',
    entity_type: 'admin_user',
    entity_id: adminId,
    details: `Password updated for admin: ${req.admin.email}`,
  });

  logger.info(`Password update completed for admin: ${req.admin.email}`);

  res.json({
    success: true,
    message: 'Password updated successfully',
  });
});

// GET /admin/seo_settings
router.get('/seo_settings', adminAuthMiddleware, async (req, res) => {
  addSecurityHeaders(res);
  try {
    const settings = await pb.collection('seo_settings').getFullList();
    res.json(settings);
  } catch (error) {
    logger.error(`Error fetching seo_settings: ${error.message}`);
    res.status(500).json({ error: 'Failed to fetch seo_settings' });
  }
});

// GET /admin/seo_settings/page/:pageName
router.get('/seo_settings/page/:pageName', adminAuthMiddleware, async (req, res) => {
  addSecurityHeaders(res);
  try {
    const { pageName } = req.params;
    const setting = await pb.collection('seo_settings').getFirstListItem(`page_name="${pageName}"`);
    res.json(setting);
  } catch (error) {
    logger.error(`Error fetching seo_settings for page: ${error.message}`);
    res.status(404).json({ error: 'Not found' });
  }
});

// POST /admin/seo_settings
router.post('/seo_settings', adminAuthMiddleware, async (req, res) => {
  addSecurityHeaders(res);
  try {
    const setting = await pb.collection('seo_settings').create(req.body);
    res.status(201).json(setting);
  } catch (error) {
    logger.error(`Error creating seo_settings: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
});

// PUT /admin/seo_settings/:id
router.put('/seo_settings/:id', adminAuthMiddleware, async (req, res) => {
  addSecurityHeaders(res);
  try {
    const { id } = req.params;
    const setting = await pb.collection('seo_settings').update(id, req.body);
    res.json(setting);
  } catch (error) {
    logger.error(`Error updating seo_settings: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
});

// GET /admin/menu-setup
router.get('/menu-setup', adminAuthMiddleware, async (req, res) => {
  addSecurityHeaders(res);
  try {
    const tools = await pb.collection('tools').getFullList({
      filter: "status = 'active'",
      sort: 'name',
    });
    const categories = await pb.collection('categories').getFullList({
      filter: "is_active = true",
      sort: 'order',
    });
    const menuSettings = await pb.collection('menu_settings').getFullList();

    res.json({
      tools,
      categories,
      menuSettings,
    });
  } catch (error) {
    logger.error(`Error in GET /admin/menu-setup: ${error.message}`);
    res.status(500).json({ error: 'Failed to load menu setup configuration' });
  }
});

// PUT /admin/menu-setup/tools/:toolId
router.put('/menu-setup/tools/:toolId', adminAuthMiddleware, async (req, res) => {
  addSecurityHeaders(res);
  try {
    const { toolId } = req.params;
    const { show_in_menu } = req.body;
    
    const updated = await pb.collection('tools').update(toolId, { show_in_menu });
    res.json(updated);
  } catch (error) {
    logger.error(`Error updating tool menu status: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
});

// POST /admin/menu-setup/settings
router.post('/menu-setup/settings', adminAuthMiddleware, async (req, res) => {
  addSecurityHeaders(res);
  try {
    const payload = { ...req.body };
    if (payload.toolOrder !== undefined) {
      payload.menuItems = payload.toolOrder;
      delete payload.toolOrder;
    }

    const newRecord = await pb.collection('menu_settings').create(payload);
    res.status(201).json(newRecord);
  } catch (error) {
    logger.error(`Error creating menu settings: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
});

// PUT /admin/menu-setup/settings/:id
router.put('/menu-setup/settings/:id', adminAuthMiddleware, async (req, res) => {
  addSecurityHeaders(res);
  try {
    const { id } = req.params;
    
    // Intercept and rewrite payload to fix schema cache errors
    // even if the user's browser is caching the old frontend code
    const payload = { ...req.body };
    if (payload.toolOrder !== undefined) {
      payload.menuItems = payload.toolOrder;
      delete payload.toolOrder;
    }

    const updated = await pb.collection('menu_settings').update(id, payload);
    res.json(updated);
  } catch (error) {
    logger.error(`Error updating menu settings: ${error.message}`);
    res.status(400).json({ error: error.message });
  }
});

export default router;