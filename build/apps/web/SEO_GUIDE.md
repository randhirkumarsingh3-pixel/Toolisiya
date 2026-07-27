# Toolisiya SEO & Performance Guide

## Table of Contents
1. [Google Search Console Setup Guide](#google-search-console-setup-guide)
2. [Technical SEO Verification Findings](#technical-seo-verification-findings)
3. [Internal Linking Strategy](#internal-linking-strategy)
4. [Keyword Optimization & Mapping](#keyword-optimization--mapping)

---

## 1. Google Search Console Setup Guide

Setting up Google Search Console (GSC) is critical for monitoring organic search performance and ensuring Google indexes all your 50+ tools properly.

### Step 1: Website Ownership Verification
1. Go to [Google Search Console](https://search.google.com/search-console).
2. Add your property using the **Domain** verification method (recommended) to cover both `www` and `non-www`, as well as HTTP/HTTPS versions.
3. **Verification Process:**
   - Google will provide a `TXT` record.
   - Add this `TXT` record to your DNS configuration (via your hosting provider, e.g., Hostinger, GoDaddy, Cloudflare).
   - Wait 15-30 minutes for DNS propagation, then click "Verify" in GSC.

### Step 2: Sitemap Submission
1. Once verified, navigate to the **Sitemaps** section in the left sidebar.
2. Enter your sitemap URL: `https://toolisiya.com/sitemap.xml`.
3. Click **Submit**. Google will process the sitemap to discover all categories, tools, and static pages.

### Step 3: URL Inspection & Indexing
For priority pages (Homepage, GST Calculator, EMI Calculator, Resume Builder), you should manually request indexing:
1. Paste the exact URL (e.g., `https://toolisiya.com/finance/gst-calculator`) into the top search bar in GSC.
2. Click **Request Indexing**. This forces Google's crawler to prioritize these high-value tools immediately.

### Step 4: Performance Monitoring Routine
Set up a weekly routine to check GSC for:
- **Performance Tab:** Monitor Clicks, Impressions, CTR (Click-Through Rate), and Average Position.
- **Pages Tab (Indexing):** Check for "Crawled - currently not indexed" or "Discovered - currently not indexed" errors. 
- **Core Web Vitals:** Monitor mobile and desktop speed metrics to ensure tool calculations don't block main thread rendering.

---

## 2. Technical SEO Verification Findings

### Sitemap.xml Verification
- **Status:** Handled via backend Express route (`/api/sitemap.xml`).
- **Validation:** The dynamically generated sitemap correctly prioritizes the Homepage (`1.0`), Category pages (`0.8`), and individual tools (`0.9`). Change frequencies are correctly set to `weekly`.

### Robots.txt Verification
- **Status:** Valid. Handled via backend route.
- **Rules:**