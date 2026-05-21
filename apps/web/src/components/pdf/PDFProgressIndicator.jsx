import React from 'react';
import { Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

const PDFProgressIndicator = ({ progress = 0, status = 'Processing...', isProcessing = false }) => {
  if (!isProcessing) return null;

  return (
    <Card className="shadow-md border-border bg-primary/5">
      <CardContent className="p-6">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <div className="w-full space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">{status}</span>
              <span className="text-sm font-bold text-primary">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PDFProgressIndicator;