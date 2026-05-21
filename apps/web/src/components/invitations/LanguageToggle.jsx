import React from 'react';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';

const LanguageToggle = ({ currentLanguage, onToggle }) => {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onToggle}
      className="gap-2 font-medium"
    >
      <Globe className="h-4 w-4" />
      <span className={currentLanguage === 'hindi' ? 'font-devanagari' : ''}>
        {currentLanguage === 'english' ? 'English' : 'हिंदी'}
      </span>
    </Button>
  );
};

export default LanguageToggle;