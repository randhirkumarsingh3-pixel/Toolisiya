import { useState, useCallback } from 'react';
import apiServerClient from '@/lib/apiServerClient.js';

export const useAnalytics = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAnalyticsData = useCallback(async (endpoint, queryParams = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      const queryString = new URLSearchParams(queryParams).toString();
      const url = queryString ? `/analytics/${endpoint}?${queryString}` : `/analytics/${endpoint}`;
      
      const response = await apiServerClient.fetch(url);
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Failed to fetch analytics data');
      }
      
      const data = await response.json();
      setIsLoading(false);
      return data;
    } catch (err) {
      console.error(`Analytics Error (${endpoint}):`, err);
      setError(err.message);
      setIsLoading(false);
      return null;
    }
  }, []);

  const getOverview = (params) => fetchAnalyticsData('overview', params);
  const getTools = (params) => fetchAnalyticsData('tools', params);
  const getGeographic = (params) => fetchAnalyticsData('geographic', params);
  const getTrafficSources = (params) => fetchAnalyticsData('traffic-sources', params);
  const getDevices = (params) => fetchAnalyticsData('devices', params);
  const getKeywords = (params) => fetchAnalyticsData('keywords', params);
  const getUserBehavior = (params) => fetchAnalyticsData('user-behavior', params);

  return {
    isLoading,
    error,
    getOverview,
    getTools,
    getGeographic,
    getTrafficSources,
    getDevices,
    getKeywords,
    getUserBehavior
  };
};