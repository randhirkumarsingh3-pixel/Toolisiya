import { useState, useEffect, useCallback } from 'react';
import apiServerClient from '@/lib/apiServerClient.js';

export function useToolStatus() {
  const [toolStatuses, setToolStatuses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const getToken = useCallback(() => {
    // Try pb_auth first (PocketBase default)
    const pbAuth = localStorage.getItem('pocketbase_auth') || localStorage.getItem('pb_auth');
    if (pbAuth) {
      try {
        const parsed = JSON.parse(pbAuth);
        if (parsed.token) return parsed.token;
      } catch (e) {
        // Ignore parse error
      }
    }
    // Fallback to other keys
    return localStorage.getItem('admin_token') || localStorage.getItem('auth_token');
  }, []);

  const fetchWithRetry = async (url, options, retries = 3, delay = 1000) => {
    try {
      const response = await apiServerClient.fetch(url, options);
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Session expired. Please log in again.');
        }
        if (response.status === 403) {
          throw new Error('You do not have permission to modify tool status.');
        }
        if (response.status >= 500) {
          throw new Error('Server error. Please try again.');
        }
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (err) {
      if (retries > 0 && !['Session expired. Please log in again.', 'You do not have permission to modify tool status.'].includes(err.message)) {
        await new Promise(resolve => setTimeout(resolve, delay));
        return fetchWithRetry(url, options, retries - 1, delay);
      }
      throw err;
    }
  };

  const fetchStatuses = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const token = getToken();
      setIsAuthenticated(!!token);

      const data = await fetchWithRetry('/tool-status', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      setToolStatuses(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching tool statuses:', err);
      setError(err.message || 'Failed to load tool statuses');
    } finally {
      setIsLoading(false);
    }
  }, [getToken]);

  useEffect(() => {
    fetchStatuses();
  }, [fetchStatuses]);

  const updateToolStatus = async (toolName, newStatus) => {
    try {
      setError(null);
      
      const token = getToken();
      if (!token) {
        throw new Error('Admin authentication required. Please log in.');
      }

      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };

      // Optimistic update
      setToolStatuses(prev => 
        prev.map(t => t.toolName === toolName ? { ...t, status: newStatus } : t)
      );

      await fetchWithRetry(`/tool-status/${encodeURIComponent(toolName)}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ status: newStatus }),
      }, 0);

      return true;
    } catch (err) {
      console.error('Error updating tool status:', err);
      setError(err.message || 'Failed to update tool status');
      fetchStatuses(); // Revert optimistic update
      throw err;
    }
  };

  return {
    toolStatuses,
    isLoading,
    error,
    isAuthenticated,
    updateToolStatus,
    refresh: fetchStatuses
  };
}