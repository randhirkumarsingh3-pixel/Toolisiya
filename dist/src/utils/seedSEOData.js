import pb from '@/lib/pocketbaseClient.js';
import { generateSEOTemplate } from './seoTemplateGenerator.js';
import { calculateSEOScore, getSEOIssues } from './seoScoringEngine.js';

export const updateToolSEO = async (toolId, seoData) => {
  try {
    return await pb.collection('seo_settings').update(toolId, seoData, { $autoCancel: false });
  } catch (error) {
    console.error(`Failed to update SEO for tool ${toolId}:`, error);
    throw error;
  }
};

export const seedAllToolsSEO = async () => {
  try {
    const tools = await pb.collection('tools').getFullList({ $autoCancel: false });
    const results = { success: 0, failed: 0, details: [] };

    for (const tool of tools) {
      try {
        const slug = tool.url.replace(/^\//, '');
        const template = generateSEOTemplate(tool.name, tool.category, slug);
        
        // Check if exists
        const existing = await pb.collection('seo_settings')
          .getFirstListItem(`page_name="${slug}"`, { $autoCancel: false })
          .catch(() => null);

        if (existing) {
          await pb.collection('seo_settings').update(existing.id, template, { $autoCancel: false });
        } else {
          await pb.collection('seo_settings').create({
            page_name: slug,
            ...template
          }, { $autoCancel: false });
        }
        results.success++;
        results.details.push({ tool: tool.name, status: 'success' });
      } catch (err) {
        results.failed++;
        results.details.push({ tool: tool.name, status: 'failed', error: err.message });
      }
    }
    return results;
  } catch (error) {
    console.error('Failed to seed SEO data:', error);
    throw error;
  }
};

export const validateAllToolsSEO = async () => {
  try {
    const seoRecords = await pb.collection('seo_settings').getFullList({ $autoCancel: false });
    return seoRecords.map(record => ({
      page_name: record.page_name,
      score: calculateSEOScore(record),
      issues: getSEOIssues(record)
    }));
  } catch (error) {
    console.error('Failed to validate SEO data:', error);
    throw error;
  }
};