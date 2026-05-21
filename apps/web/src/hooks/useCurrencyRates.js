import { useState, useEffect } from 'react';

export const useCurrencyRates = () => {
  const [rates, setRates] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const cached = localStorage.getItem('currencyRates');
        const cacheTime = localStorage.getItem('currencyRatesTime');
        
        // 1 hour cache
        if (cached && cacheTime && (Date.now() - Number(cacheTime) < 3600000)) {
          setRates(JSON.parse(cached));
          setLastUpdated(new Date(Number(cacheTime)));
          setLoading(false);
          return;
        }

        const response = await fetch('https://open.er-api.com/v6/latest/USD');
        if (!response.ok) throw new Error('Failed to fetch rates');
        
        const data = await response.json();
        setRates(data.rates);
        setLastUpdated(new Date());
        
        localStorage.setItem('currencyRates', JSON.stringify(data.rates));
        localStorage.setItem('currencyRatesTime', Date.now().toString());
      } catch (err) {
        setError('Failed to load currency rates. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchRates();
  }, []);

  return { rates, loading, error, lastUpdated };
};