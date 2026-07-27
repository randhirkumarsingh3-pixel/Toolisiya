import { useMemo } from 'react';

/**
 * Custom hook to compute subtotal, tax, discount, and total.
 * @param {Array} items - Array of { quantity, price } objects.
 * @param {number} taxRate - Tax percentage (e.g., 10 for 10%).
 * @param {number} discountRate - Discount percentage (e.g., 5 for 5%).
 * @returns {Object} { subtotal, taxAmount, discountAmount, total }
 */
export const useDocumentCalculations = (items = [], taxRate = 0, discountRate = 0) => {
  return useMemo(() => {
    const subtotal = items.reduce((acc, item) => {
      const qty = parseFloat(item.quantity) || 0;
      const price = parseFloat(item.price) || 0;
      return acc + (qty * price);
    }, 0);

    const discountAmount = subtotal * ((parseFloat(discountRate) || 0) / 100);
    const subtotalAfterDiscount = subtotal - discountAmount;
    const taxAmount = subtotalAfterDiscount * ((parseFloat(taxRate) || 0) / 100);
    const total = subtotalAfterDiscount + taxAmount;

    return {
      subtotal,
      discountAmount,
      taxAmount,
      total
    };
  }, [items, taxRate, discountRate]);
};