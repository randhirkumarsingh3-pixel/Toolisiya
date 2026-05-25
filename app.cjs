// CommonJS wrapper for Phusion Passenger / Hostinger
// Passenger's loader uses require(), which crashes when loading ES Modules directly.
// This wrapper uses CommonJS to start, then dynamically imports the ESM API.
const { execSync } = require('child_process');

function ensureNodeDependencies() {
    try {
        require('nodemailer');
        console.log("Nodemailer is already installed.");
    } catch (err) {
        console.log("Nodemailer is missing. Installing dependencies dynamically...");
        try {
            // Run npm install in apps/api
            execSync('npm install --prefix apps/api nodemailer', { stdio: 'inherit' });
            console.log("Successfully installed nodemailer dynamically!");
        } catch (installErr) {
            console.error("Failed to install nodemailer dynamically:", installErr);
        }
    }
}

async function startServer() {
    try {
        console.log("Starting server via CommonJS wrapper...");
        ensureNodeDependencies();
        await import('./apps/api/src/main.js');
        console.log("ESM API loaded successfully.");
    } catch (err) {
        console.error("Failed to load ESM API:", err);
    }
}

startServer();
