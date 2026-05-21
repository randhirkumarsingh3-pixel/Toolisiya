import pb from './pocketbaseClient.js';

// In development: Vite proxy forwards /hcgi/api → localhost:3001
// In production:  VITE_API_URL points to https://api.toolisiya.com
const API_SERVER_URL = import.meta.env.VITE_API_URL || "/hcgi/api";

const apiServerClient = {
    fetch: async (url, options = {}) => {
        const headers = { ...options.headers };
        if (pb.authStore && pb.authStore.token) {
            headers['Authorization'] = `Bearer ${pb.authStore.token}`;
        }
        return await window.fetch(API_SERVER_URL + url, {
            ...options,
            headers
        });
    }
};

export default apiServerClient;

export { apiServerClient };
