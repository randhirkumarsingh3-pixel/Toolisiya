import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { blogPosts } from './apps/web/src/data/blogPosts.js';
import { toolPaths } from './apps/web/src/data/toolPaths.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load env vars
dotenv.config({ path: path.join(__dirname, 'apps/api/.env') });

const supabaseUrl = process.env.SUPABASE_URL || 'https://kexwtzdfkcyqjuisskrk.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const STATIC_PAGES = [
  { path: '/', changefreq: 'weekly', priority: 1.0 },
  { path: '/about', changefreq: 'monthly', priority: 0.6 },
  { path: '/contact-us', changefreq: 'monthly', priority: 0.6 },
  { path: '/terms-of-service', changefreq: 'yearly', priority: 0.6 },
  { path: '/privacy-policy', changefreq: 'yearly', priority: 0.6 },
  { path: '/download', changefreq: 'monthly', priority: 0.7 },
  { path: '/blog', changefreq: 'weekly', priority: 0.7 },
];

const escapeXml = (str) => {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
};

const formatDate = (date) => {
  if (!date) return formatDate(new Date());
  const d = new Date(date);
  if (isNaN(d.getTime())) return formatDate(new Date());
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${month}-${day}`;
};

async function main() {
  console.log('🚀 Generating static sitemap.xml and robots.txt...');
  
  const domain = 'https://toolisiya.com';
  const baseUrl = domain;
  const publicDir = path.join(__dirname, 'apps', 'web', 'public');
  const sitemapPath = path.join(publicDir, 'sitemap.xml');
  const robotsPath = path.join(publicDir, 'robots.txt');

  // If credentials are not available, handle gracefully
  if (!supabaseKey) {
    console.warn('⚠️ Warning: SUPABASE_SERVICE_ROLE_KEY is not defined in apps/api/.env.');
    if (fs.existsSync(sitemapPath) && fs.existsSync(robotsPath)) {
      console.log('✅ Found pre-existing sitemap.xml and robots.txt in git. Keeping existing files for build.');
      process.exit(0);
    } else {
      console.log('⚠️ Pre-existing sitemap/robots.txt not found. Proceeding with static fallback generation...');
    }
  }

  try {
    // Start sitemap XML
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    // Add static pages
    console.log('Adding static pages...');
    for (const page of STATIC_PAGES) {
      const lastmod = formatDate(new Date());
      xml += '  <url>\n';
      xml += `    <loc>${escapeXml(baseUrl + page.path)}</loc>\n`;
      xml += `    <lastmod>${lastmod}</lastmod>\n`;
      xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
      xml += `    <priority>${page.priority}</priority>\n`;
      xml += '  </url>\n';
    }

    let tools = [];
    let categories = new Set();
    let categoryMap = {};

    if (supabaseKey) {
      // Connect to Supabase
      const supabase = createClient(supabaseUrl, supabaseKey);

      // Fetch active tools from tools table
      console.log('Fetching active tools from Supabase...');
      const { data, error } = await supabase
        .from('tools')
        .select('id, category, updated_at')
        .eq('status', 'active');

      if (error) {
        console.error('⚠️ Supabase fetch error:', error.message);
        console.log('Falling back to static categories only.');
      } else {
        tools = data || [];
        console.log(`Fetched ${tools.length} active tools.`);
      }
    } else {
      console.log('Skipping Supabase fetch (no credentials). Using fallback static categories.');
    }

    if (tools.length > 0) {
      // Extract unique categories from fetched tools
      tools.forEach(tool => {
        if (tool.category) {
          categories.add(tool.category);
          const updated = tool.updated_at || new Date().toISOString();
          if (!categoryMap[tool.category]) {
            categoryMap[tool.category] = updated;
          } else if (new Date(updated) > new Date(categoryMap[tool.category])) {
            categoryMap[tool.category] = updated;
          }
        }
      });

      // Add categories to sitemap
      console.log(`Adding ${categories.size} categories...`);
      for (const category of categories) {
        const lastmod = formatDate(categoryMap[category]);
        const categorySlug = encodeURIComponent(category.toLowerCase().replace(/\s+/g, '-'));
        xml += '  <url>\n';
        xml += `    <loc>${escapeXml(baseUrl + '/tools/category/' + categorySlug)}</loc>\n`;
        xml += `    <lastmod>${lastmod}</lastmod>\n`;
        xml += '    <changefreq>weekly</changefreq>\n';
        xml += '    <priority>0.8</priority>\n';
        xml += '  </url>\n';
      }

      // Add individual tools
      console.log(`Adding ${tools.length} individual tools...`);
      for (const tool of tools) {
        const lastmod = formatDate(tool.updated_at || new Date());
        const relativePath = toolPaths[tool.id] || ('/tools/' + encodeURIComponent(tool.id));
        xml += '  <url>\n';
        xml += `    <loc>${escapeXml(baseUrl + relativePath)}</loc>\n`;
        xml += `    <lastmod>${lastmod}</lastmod>\n`;
        xml += '    <changefreq>monthly</changefreq>\n';
        xml += '    <priority>0.7</priority>\n';
        xml += '  </url>\n';
      }
    } else {
      // Fallback categories if database query was skipped or failed
      const fallbackCategories = ['finance', 'career', 'developer', 'image', 'document', 'pdf', 'science', 'productivity'];
      console.log(`Adding ${fallbackCategories.length} fallback categories...`);
      for (const category of fallbackCategories) {
        const lastmod = formatDate(new Date());
        xml += '  <url>\n';
        xml += `    <loc>${escapeXml(baseUrl + '/tools/category/' + category)}</loc>\n`;
        xml += `    <lastmod>${lastmod}</lastmod>\n`;
        xml += '    <changefreq>weekly</changefreq>\n';
        xml += '    <priority>0.8</priority>\n';
        xml += '  </url>\n';
      }
      
      // Add blog posts to sitemap dynamically
      console.log(`Adding ${blogPosts.length} blog posts to sitemap...`);
      for (const post of blogPosts) {
        const lastmod = formatDate(new Date());
        xml += '  <url>\n';
        xml += `    <loc>${escapeXml(baseUrl + '/blog/' + post.slug)}</loc>\n`;
        xml += `    <lastmod>${lastmod}</lastmod>\n`;
        xml += '    <changefreq>monthly</changefreq>\n';
        xml += '    <priority>0.6</priority>\n';
        xml += '  </url>\n';
      }
    }

    xml += '</urlset>';

    // Write to apps/web/public/sitemap.xml
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    fs.writeFileSync(sitemapPath, xml, 'utf8');
    console.log(`✅ Static sitemap.xml created successfully at: ${sitemapPath}`);

    // Generate robots.txt
    const robotsTxt = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /admin/
Disallow: /api/
Disallow: /hcgi/
Disallow: /profile
Disallow: /settings
Disallow: /app

Sitemap: ${baseUrl}/sitemap.xml
`;

    fs.writeFileSync(robotsPath, robotsTxt, 'utf8');
    console.log(`✅ Static robots.txt created successfully at: ${robotsPath}`);

    // Generate static ads.txt
    let adsenseId = 'pub-8044537001934396'; // Hardcoded fallback to prevent empty overwrite
    try {
      if (supabaseKey) {
        const supabase = createClient(supabaseUrl, supabaseKey);
        const { data: records, error: dbErr } = await supabase.from('website_settings').select('adsense_publisher_id').limit(1);
        if (!dbErr && records && records.length > 0 && records[0].adsense_publisher_id) {
          adsenseId = records[0].adsense_publisher_id;
        }
      }
    } catch (e) {
      console.warn('⚠️ Warning: Failed to fetch adsense_publisher_id for static ads.txt:', e.message);
    }

    const adsTxtPath = path.join(publicDir, 'ads.txt');
    const adsTxtContent = `google.com, ${adsenseId}, DIRECT, f08c47fec0942fa0\n`;
    fs.writeFileSync(adsTxtPath, adsTxtContent, 'utf8');
    console.log(`✅ Static ads.txt created successfully at: ${adsTxtPath}`);

  } catch (err) {
    console.error('❌ Error generating static SEO files:', err.message);
    if (!fs.existsSync(sitemapPath)) {
      // Don't crash build if sitemap files already exist
      process.exit(1);
    } else {
      console.warn('⚠️ Warning: Error occurred but keeping existing sitemap.xml to prevent build crash.');
    }
  }
}

main();
