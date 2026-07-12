
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/App.jsx';
import '@/index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
);

if ('serviceWorker' in navigator && !import.meta.env.DEV) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').then(
      (registration) => {
        console.log('PWA ServiceWorker registration successful with scope: ', registration.scope);
      },
      (err) => {
        console.error('PWA ServiceWorker registration failed: ', err);
      }
    );
  });
}

// Automatically reload the page when a new version of the website is deployed
// to prevent dynamic import / Vite chunk load errors for active users.
window.addEventListener('vite:preloadError', () => {
  window.location.reload();
});

window.addEventListener('error', (event) => {
  if (event.message && event.message.includes('Failed to fetch dynamically imported module')) {
    window.location.reload();
  }
});
