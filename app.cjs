// CommonJS wrapper for Phusion Passenger / Hostinger
// Passenger's loader uses require(), which crashes when loading ES Modules directly.
// This wrapper uses CommonJS to start, then dynamically imports the ESM API.

async function startServer() {
    try {
        console.log("Starting server via CommonJS wrapper...");
        await import('./apps/api/src/main.js');
        console.log("ESM API loaded successfully.");
    } catch (err) {
        console.error("Failed to load ESM API:", err);
    }
}

startServer();
