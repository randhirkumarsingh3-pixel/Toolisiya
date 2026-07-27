import React from 'react';
import { Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const DownloadButton = ({ onClick, loading = false, label = "Download", className = "", variant = "default", size = "default" }) => {
  return (
    <Button 
      variant={variant} 
      size={size} 
      className={`transition-all active:scale-95 ${className}`}
      onClick={onClick}
      disabled={loading}
      type="button"
    >
      {loading ? (
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      ) : (
        <Download className="h-4 w-4 mr-2" />
      )}
      {loading ? "Processing..." : label}
    </Button>
  );
};

export default DownloadButton;