// Hostinger Node.js Passenger entry point
// Hostinger looks for app.js or server.js in the root directory by default.
import { execSync } from 'child_process';

try {
    // Check if nodemailer can be loaded
    await import('nodemailer');
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

// Load main API server
await import('./apps/api/src/main.js');
