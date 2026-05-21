import { useState, useEffect } from 'react';
import apiServerClient from '@/lib/apiServerClient.js';

export const useSEOData = (slug) => {
  const [seoData, setSeoData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Debug logging for slug value
    console.log('useSEOData hook called with slug:', slug);

    // Guard condition to prevent fetching with empty or undefined slug
    if (!slug || typeof slug !== 'string' || slug.trim() === '') {
      console.log('useSEOData: Empty slug detected, returning early.');
      setIsLoading(false);
      setSeoData(null);
      setError(null);
      return;
    }

    const fetchSEO = async () => {
      setIsLoading(true);
      try {
        const response = await apiServerClient.fetch(`/seo/${slug}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch SEO data for slug: ${slug}`);
        }
        const data = await response.json();
        if (data.success && data.data) {
          setSeoData(data.data);
        } else {
          setSeoData(null);
        }
      } catch (err) {
        console.error(`SEO fetch error for ${slug}:`, err);
        setError(err.message);
        setSeoData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSEO();
  }, [slug]);

  return { seoData, isLoading, error };
};

export default useSEOData;