import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const CopyButton = ({ textToCopy, label = "Copy", className = "", variant = "outline", size = "default" }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!textToCopy) {
      toast.error('Nothing to copy!');
      return;
    }
    
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy text');
    }
  };

  return (
    <Button 
      variant={variant} 
      size={size} 
      className={`transition-all active:scale-95 ${className}`}
      onClick={handleCopy}
      type="button"
    >
      {copied ? (
        <Check className="h-4 w-4 mr-2 text-emerald-500" />
      ) : (
        <Copy className="h-4 w-4 mr-2" />
      )}
      {copied ? "Copied!" : label}
    </Button>
  );
};

export default CopyButton;