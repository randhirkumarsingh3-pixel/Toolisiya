import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Languages } from 'lucide-react';

const BilingualInput = ({ 
  label, 
  englishValue, 
  hindiValue, 
  onEnglishChange, 
  onHindiChange,
  placeholder,
  required = false,
  className = ''
}) => {
  const [activeLanguage, setActiveLanguage] = useState('english');

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">
          {label} {required && <span className="text-destructive">*</span>}
        </Label>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setActiveLanguage(activeLanguage === 'english' ? 'hindi' : 'english')}
          className="h-7 gap-2 text-xs"
        >
          <Languages className="h-3.5 w-3.5" />
          {activeLanguage === 'english' ? 'Switch to Hindi' : 'Switch to English'}
        </Button>
      </div>
      
      {activeLanguage === 'english' ? (
        <Input
          type="text"
          value={englishValue}
          onChange={(e) => onEnglishChange(e.target.value)}
          placeholder={placeholder || `Enter ${label} in English`}
          required={required}
          className="bilingual-input"
          dir="ltr"
        />
      ) : (
        <Input
          type="text"
          value={hindiValue}
          onChange={(e) => onHindiChange(e.target.value)}
          placeholder={placeholder || `${label} हिंदी में दर्ज करें`}
          className="bilingual-input font-devanagari"
          dir="ltr"
        />
      )}
      
      <div className="flex gap-2 text-xs text-muted-foreground">
        <span className={activeLanguage === 'english' ? 'font-medium text-foreground' : ''}>
          EN: {englishValue || '—'}
        </span>
        <span>|</span>
        <span className={`font-devanagari ${activeLanguage === 'hindi' ? 'font-medium text-foreground' : ''}`}>
          HI: {hindiValue || '—'}
        </span>
      </div>
    </div>
  );
};

export default BilingualInput;