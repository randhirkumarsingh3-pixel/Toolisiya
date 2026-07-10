import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Resolve directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PUBLIC_DIR = path.resolve(__dirname, '../public');
const DOMAIN = 'https://toolisiya.com';

// Mock imports if they contain React (use dynamic import or read as text if it fails, but ES module import usually works for raw JS data)
import { toolPaths } from '../src/data/toolPaths.js';
import { toolSeoContent } from '../src/data/toolSeoContent.js';
import { blogPosts } from '../src/data/blogPosts.js';

const escapeXml = (unsafe) => {
    return unsafe.replace(/[<>&'"]/g, (c) => {
        switch (c) {
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '&': return '&amp;';
            case "'": return '&apos;';
            case '"': return '&quot;';
            default: return c;
        }
    });
};

const buildUrlXml = (url, lastmod, changefreq, priority, image = null) => {
    let xml = `  <url>\n    <loc>${escapeXml(url)}</loc>\n`;
    if (lastmod) xml += `    <lastmod>${lastmod}</lastmod>\n`;
    if (changefreq) xml += `    <changefreq>${changefreq}</changefreq>\n`;
    if (priority) xml += `    <priority>${priority}</priority>\n`;
    if (image) {
        xml += `    <image:image>\n      <image:loc>${escapeXml(DOMAIN + image)}</image:loc>\n    </image:image>\n`;
    }
    xml += `  </url>\n`;
    return xml;
};

const generateSitemaps = () => {
    console.log('Generating AdSense-compliant sitemaps...');
    const today = new Date().toISOString().split('T')[0];

    // 1. Pages Sitemap
    const staticPages = [
        '/', '/about', '/contact-us', '/privacy-policy', '/terms-of-service',
        '/blog', '/browse-categories', '/finance', '/pdf', '/image', '/developer',
        '/converters', '/utilities', '/generators'
    ];
    let pagesXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
    staticPages.forEach(page => {
        const priority = page === '/' ? '1.0' : '0.8';
        pagesXml += buildUrlXml(DOMAIN + page, today, 'weekly', priority);
    });
    pagesXml += `</urlset>`;
    fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap-pages.xml'), pagesXml);

    // 2. Tools Sitemap (ONLY INDEXABLE)
    let toolsXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
    let indexedToolsCount = 0;
    
    for (const [toolId, routePath] of Object.entries(toolPaths)) {
        const seoData = toolSeoContent[toolId];
        // Only include in sitemap if it's explicitly marked as indexable or has a high content score.
        if (seoData && seoData.indexable === true) {
            toolsXml += buildUrlXml(DOMAIN + routePath, seoData.lastReviewed || today, 'weekly', '0.9');
            indexedToolsCount++;
        }
    }
    toolsXml += `</urlset>`;
    fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap-tools.xml'), toolsXml);
    console.log(`Indexed Tools: ${indexedToolsCount}`);

    // 3. Blog Sitemap
    let blogXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n`;
    blogPosts.forEach(post => {
        blogXml += buildUrlXml(DOMAIN + '/blog/' + post.slug, post.date || today, 'monthly', '0.8', post.coverImage);
    });
    blogXml += `</urlset>`;
    fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap-blog.xml'), blogXml);

    // 4. Sitemap Index
    const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${DOMAIN}/sitemap-pages.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${DOMAIN}/sitemap-tools.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${DOMAIN}/sitemap-blog.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
</sitemapindex>`;
    
    fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), sitemapIndex);
    
    console.log('Sitemaps generated successfully.');
};

generateSitemaps();
