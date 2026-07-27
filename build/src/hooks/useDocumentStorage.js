import { useState, useEffect } from 'react';

/**
 * Custom hook for persisting document data to local storage.
 * @param {string} key - The local storage key.
 * @param {Object} initialValue - The default value if none exists.
 * @returns {[Object, Function]} The stored value and a setter function.
 */
export const useDocumentStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
};