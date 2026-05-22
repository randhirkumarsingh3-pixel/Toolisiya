import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load env vars
dotenv.config({ path: path.join(__dirname, 'apps/api/.env') });

const supabaseUrl = process.env.SUPABASE_URL || 'https://kexwtzdfkcyqjuisskrk.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseKey) {
  console.error('❌ Error: SUPABASE_SERVICE_ROLE_KEY is not defined in apps/api/.env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const STATIC_PAGES = [
  { path: '/', changefreq: 'weekly', priority: 1.0 },
  { path: '/about', changefreq: 'monthly', priority: 0.6 },
  { path: '/contact', changefreq: 'monthly', priority: 0.6 },
  { path: '/terms', changefreq: 'yearly', priority: 0.6 },
  { path: '/privacy', changefreq: 'yearly', priority: 0.6 },
  { path: '/faq', changefreq: 'monthly', priority: 0.6 },
  { path: '/download', changefreq: 'monthly', priority: 0.7 },
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

    // Fetch active tools from tools table
    console.log('Fetching active tools from Supabase...');
    const { data: tools, error } = await supabase
      .from('tools')
      .select('id, category, updated_at')
      .eq('status', 'active');

    if (error) {
      throw error;
    }

    console.log(`Fetched ${tools.length} active tools.`);

    // Extract unique categories
    const categories = new Set();
    const categoryMap = {};
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
      const toolSlug = encodeURIComponent(tool.id);
      xml += '  <url>\n';
      xml += `    <loc>${escapeXml(baseUrl + '/tools/' + toolSlug)}</loc>\n`;
      xml += `    <lastmod>${lastmod}</lastmod>\n`;
      xml += '    <changefreq>monthly</changefreq>\n';
      xml += '    <priority>0.7</priority>\n';
      xml += '  </url>\n';
    }

    xml += '</urlset>';

    // Write to apps/web/public/sitemap.xml
    const publicDir = path.join(__dirname, 'apps', 'web', 'public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    const sitemapPath = path.join(publicDir, 'sitemap.xml');
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

    const robotsPath = path.join(publicDir, 'robots.txt');
    fs.writeFileSync(robotsPath, robotsTxt, 'utf8');
    console.log(`✅ Static robots.txt created successfully at: ${robotsPath}`);

  } catch (err) {
    console.error('❌ Error generating static SEO files:', err.message);
    process.exit(1);
  }
}

main();
