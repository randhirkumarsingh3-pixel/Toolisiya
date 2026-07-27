import React from 'react';
import { Link2, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import ToolPageTemplate from '@/components/ToolPageTemplate.jsx';
import { toolPageData } from '@/data/toolPageData.js';

const UrlEncoderPage = () => {
  return (
    <ToolPageTemplate toolData={toolPageData['url-encoder']}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
        <Card className="lg:col-span-12 shadow-lg border-border">
          <CardHeader className="bg-muted/30 border-b pb-6">
            <CardTitle className="flex items-center gap-2">
              <Link2 className="h-5 w-5 text-primary" /> URL Studio
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 md:p-12 text-center">
            <div className="border-2 border-dashed border-primary/30 rounded-2xl p-12 max-w-2xl mx-auto hover:bg-primary/5 transition-colors cursor-pointer group">
              <Link2 className="h-12 w-12 text-primary mx-auto mb-4 opacity-50 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold mb-2">URL Engine Loading</h3>
              <p className="text-muted-foreground mb-6">Our client-side URL encoding and decoding engine is being deployed.</p>
              <Button onClick={() => toast.info('URL Encoder coming soon!')}>
                <Plus className="h-4 w-4 mr-2" /> Open Encoder
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </ToolPageTemplate>
  );
};

export default UrlEncoderPage;