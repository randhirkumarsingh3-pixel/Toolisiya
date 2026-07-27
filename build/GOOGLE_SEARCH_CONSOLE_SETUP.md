# Google Search Console Setup & Monitoring Guide

This document provides comprehensive, step-by-step instructions for setting up Google Search Console (GSC) for Toolisiya.com, verifying ownership, submitting your sitemap, and monitoring your search performance.

## 1. Create a Google Search Console Account
1. Go to [Google Search Console](https://search.google.com/search-console).
2. Click **Start now**.
3. Sign in with the same Google account you used to set up Google Analytics for Toolisiya.com.

## 2. Add the Toolisiya.com Property
1. Once logged in, click the property dropdown in the top-left corner and select **Add property**.
2. You will see two property types: **Domain** and **URL prefix**.
   - **Domain (Recommended):** Enter `toolisiya.com`. This covers all subdomains (www, non-www) and protocols (http, https).
   - **URL prefix:** Enter `https://toolisiya.com/` (use this if you cannot verify via DNS).
3. Click **Continue**.

## 3. Verify Ownership
Depending on the property type you chose, verify using one of these methods:

### Option A: DNS Record (Required for Domain Property)
1. GSC will provide a TXT record (e.g., `google-site-verification=...`).
2. Log into your domain registrar (e.g., Hostinger, GoDaddy, Namecheap).
3. Navigate to DNS / Zone Management.
4. Add a new **TXT record**:
   - **Name/Host:** `@` (or leave blank depending on the provider)
   - **Value:** Paste the verification string.
5. Wait 5-10 minutes, then click **Verify** in GSC.

### Option B: Google Analytics (Easiest for URL Prefix)
*Note: You must have already added the Google Analytics `gtag.js` snippet to your `index.html` `<head>` section.*
1. In the GSC verification window, select the **Google Analytics** method.
2. Click **Verify**. Since the GA tag is already in your code and you are logged in with the same Google account, verification will happen instantly.

### Option C: HTML File Upload
1. Download the provided HTML verification file from GSC.
2. Upload this file to the `apps/web/public/` directory in your project.
3. Deploy your website so the file is accessible at `https://toolisiya.com/[filename].html`.
4. Click **Verify** in GSC.

## 4. Submit Your Sitemap
Now that your static sitemap is generated, submit it to Google so it can discover all 100+ tools.
1. In the GSC left sidebar, under **Indexing**, click **Sitemaps**.
2. In the "Add a new sitemap" field, enter `sitemap.xml` (the full URL will be `https://toolisiya.com/sitemap.xml`).
3. Click **Submit**.
4. You should see a "Sitemap submitted successfully" message. The status will initially say "Pending" and will eventually change to "Success" once Google processes it.

## 5. Monitoring Search Performance & Indexing
### Search Performance (GSC)
- Go to **Performance** > **Search results**.
- Here you can view **Total Clicks**, **Total Impressions**, **Average CTR**, and **Average Position**.
- Scroll down to see which specific Queries (keywords) and Pages are driving traffic.

### Indexing Status (GSC)
- Go to **Indexing** > **Pages**.
- This report shows how many pages are indexed vs. not indexed.
- Scroll down to "Why pages aren't indexed" to identify issues.

### Real-Time Reporting (Google Analytics)
While GSC shows historical search data (usually delayed by 24-48 hours), Google Analytics shows real-time user activity:
1. Open Google Analytics.
2. Go to **Reports** > **Realtime**.
3. Here you can see how many users are currently on the site, their geographic locations, what tools they are using, and where they came from (e.g., organic search, direct, referral).

## 6. Fixing Common Indexing Issues
If pages are not being indexed, check the "Pages" report in GSC for these common errors:
- **Discovered - currently not indexed:** Google knows about the page but hasn't crawled it yet. Give it time, or click "Request Indexing" on critical pages.
- **Crawled - currently not indexed:** Google crawled the page but decided not to index it. This usually means the page lacks high-quality text content (thin content). Ensure your tool pages have descriptive text, FAQs, and usage guides.
- **Not found (404):** A linked page no longer exists. Set up a 301 redirect or remove the dead link.
- **Excluded by 'noindex' tag:** Ensure your `SEOHead` component isn't accidentally rendering `<meta name="robots" content="noindex">` on public tool pages.