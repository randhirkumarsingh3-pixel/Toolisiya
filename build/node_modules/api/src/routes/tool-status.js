import 'dotenv/config';
import express from 'express';
import pb from '../utils/pocketbaseClient.js';
import { adminAuthMiddleware } from '../middleware/index.js';
import logger from '../utils/logger.js';

const router = express.Router();

// GET /tool-status - Fetch all tool statuses (PUBLIC - no auth required)
router.get('/', async (req, res) => {
  logger.info('Fetching all tool statuses');

  const toolStatuses = await pb.collection('tool_status').getFullList();

  logger.info(`Retrieved ${toolStatuses.length} tool statuses`);

  const formattedData = toolStatuses.map(record => ({
    toolName: record.tool_name,
    status: record.status || 'inactive',
    lastUpdated: record.updated,
  }));

  res.json(formattedData);
});

// PUT /tool-status/:toolName - Update a single tool's status (ADMIN AUTH REQUIRED)
router.put('/:toolName', adminAuthMiddleware, async (req, res) => {
  const { toolName } = req.params;
  const { status } = req.body;

  // Validate input
  if (!toolName) {
    return res.status(400).json({ error: 'Tool name is required' });
  }

  if (!status) {
    return res.status(400).json({ error: 'Status is required' });
  }

  if (!['active', 'inactive'].includes(status)) {
    return res.status(400).json({ error: 'Status must be either "active" or "inactive"' });
  }

  logger.info(`Updating tool status for: ${toolName} by admin: ${req.admin.email}`);

  // Find the tool status record by tool_name
  const existingRecord = await pb.collection('tool_status')
    .getFirstListItem(`tool_name = "${toolName}"`, { requestKey: null })
    .catch(() => null);

  if (!existingRecord) {
    throw new Error(`Tool status record not found for tool: ${toolName}`);
  }

  // Update the record
  const updatedRecord = await pb.collection('tool_status').update(existingRecord.id, {
    status,
  });

  logger.info(`Tool status updated successfully for: ${toolName}`);

  // Log admin action
  await pb.collection('admin_logs').create({
    admin_id: req.admin.adminId,
    action: 'update_tool_status',
    entity_type: 'tool_status',
    entity_id: updatedRecord.id,
    details: `Updated tool status for ${toolName} to ${status}`,
  });

  const formattedResponse = {
    toolName: updatedRecord.tool_name,
    status: updatedRecord.status,
    lastUpdated: updatedRecord.updated,
  };

  res.json(formattedResponse);
});

// POST /tool-status/bulk-update - Bulk update tool statuses (ADMIN AUTH REQUIRED)
router.post('/bulk-update', adminAuthMiddleware, async (req, res) => {
  const { tools } = req.body;

  // Validate input
  if (!tools || !Array.isArray(tools)) {
    return res.status(400).json({ error: 'Tools array is required' });
  }

  if (tools.length === 0) {
    return res.status(400).json({ error: 'Tools array cannot be empty' });
  }

  // Validate each tool object
  for (const tool of tools) {
    if (!tool.toolName) {
      return res.status(400).json({ error: 'Each tool must have a toolName' });
    }
    if (!tool.status) {
      return res.status(400).json({ error: 'Each tool must have a status' });
    }
    if (!['active', 'inactive'].includes(tool.status)) {
      return res.status(400).json({ error: `Invalid status for ${tool.toolName}: must be "active" or "inactive"` });
    }
  }

  logger.info(`Bulk updating ${tools.length} tool statuses by admin: ${req.admin.email}`);

  const results = [];
  const errors = [];

  for (const tool of tools) {
    try {
      // Find the tool status record
      const existingRecord = await pb.collection('tool_status')
        .getFirstListItem(`tool_name = "${tool.toolName}"`, { requestKey: null })
        .catch(() => null);

      if (!existingRecord) {
        errors.push({
          toolName: tool.toolName,
          error: 'Tool status record not found',
        });
        continue;
      }

      // Update the record
      const updatedRecord = await pb.collection('tool_status').update(existingRecord.id, {
        status: tool.status,
      });

      results.push({
        toolName: updatedRecord.tool_name,
        status: updatedRecord.status,
        lastUpdated: updatedRecord.updated,
        success: true,
      });

      logger.info(`Tool status updated: ${tool.toolName} -> ${tool.status}`);
    } catch (error) {
      logger.error(`Error updating tool status for ${tool.toolName}: ${error.message}`);
      errors.push({
        toolName: tool.toolName,
        error: error.message,
      });
    }
  }

  // Log admin action
  await pb.collection('admin_logs').create({
    admin_id: req.admin.adminId,
    action: 'bulk_update_tool_status',
    entity_type: 'tool_status',
    entity_id: null,
    details: `Bulk updated ${results.length} tool statuses. Errors: ${errors.length}`,
  });

  logger.info(`Bulk update completed: ${results.length} successful, ${errors.length} errors`);

  res.json({
    success: true,
    updated: results.length,
    failed: errors.length,
    results,
    errors: errors.length > 0 ? errors : null,
  });
});

export default router;