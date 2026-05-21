import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MOCK_RATES } from '@/utils/financeCalculations.js';

const CurrencyConverter = ({ value, onChange }) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[100px] h-12 bg-muted/50">
        <SelectValue placeholder="Currency" />
      </SelectTrigger>
      <SelectContent>
        {Object.keys(MOCK_RATES).map(currency => (
          <SelectItem key={currency} value={currency}>{currency}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default CurrencyConverter;