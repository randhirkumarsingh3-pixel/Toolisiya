# Google Analytics Setup Guide

Follow these step-by-step instructions to set up Google Analytics 4 (GA4) for Toolisiya to track visitor behavior, tool usage, and conversions.

## 1. Create a Google Analytics Account
1. Go to [analytics.google.com](https://analytics.google.com).
2. Sign in with your preferred Google account.
3. Click the **Start measuring** button.
4. Enter an Account Name (e.g., "Toolisiya Network").
5. Review the data-sharing settings and click **Next**.

## 2. Set Up Property for toolisiya.com
1. **Property Name:** Enter `toolisiya.com`.
2. **Reporting Time Zone:** Select your local time zone (e.g., India Standard Time or UTC).
3. **Currency:** Select your primary currency (e.g., USD or INR).
4. Click **Next**.
5. Fill in the business details (Industry: "Internet & Telecom", Business size: "Small").
6. Select your business objectives (e.g., "Examine user behavior", "Generate leads") and click **Create**.
7. Accept the Google Analytics Terms of Service Agreement.

## 3. Get Your Measurement ID
1. You will be prompted to "Choose a platform". Select **Web**.
2. **Website URL:** Enter `toolisiya.com` (without https://).
3. **Stream Name:** Enter `Toolisiya Web Stream`.
4. Ensure "Enhanced measurement" is toggled ON.
5. Click **Create stream**.
6. The Web stream details page will open. Copy your **Measurement ID** at the top right (format: `G-XXXXXXXXXX`).

## 4. Install the Google Analytics Code
To add GA4 to the React application, you need to load the gtag script using your Measurement ID.

**Option A: Add to `index.html` (Recommended)**
Edit `apps/web/index.html` and add this inside the `<head>` tag, replacing `G-XXXXXXXXXX` with your Measurement ID: