import React from 'react';
import { Helmet } from 'react-helmet';
import { Upload, Image as ImageIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import BreadcrumbNavigation from '@/components/BreadcrumbNavigation.jsx';
import SEOHead from '@/components/SEOHead.jsx';
import ExtraToolTips from '@/components/ExtraToolTips.jsx';
import RelatedToolsSection from '@/components/RelatedToolsSection.jsx';
import ToolContentDisplay from '@/components/ToolContentDisplay.jsx';
import { toolContent } from '@/data/toolContent.js';
import { toast } from 'sonner';

const WatermarkRemoverPage = () => {
  const contentData = toolContent['image-watermark']; // Using the watermark content as requested

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEOHead 
        defaultTitle={`${contentData.title} | Toolisiya`}
        defaultDescription={contentData.introduction.substring(0, 150)}
        toolData={{
          name: "Image Watermark",
          description: contentData.introduction,
          applicationCategory: "MultimediaApplication"
        }}
        schemaType="software"
      />

      
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <BreadcrumbNavigation customTitle="Image Watermark" />

          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight text-foreground">
              {contentData.title}
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-prose">
              Add or remove watermarks from your images securely in your browser.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
            <Card className="lg:col-span-12 shadow-lg border-border">
              <CardHeader className="bg-muted/30 border-b pb-6">
                <CardTitle>Watermark Studio</CardTitle>
              </CardHeader>
              <CardContent className="p-12 text-center">
                <div className="border-2 border-dashed border-primary/30 rounded-xl p-12 max-w-2xl mx-auto hover:bg-primary/5 transition-colors cursor-pointer">
                  <ImageIcon className="h-12 w-12 text-primary mx-auto mb-4 opacity-50" />
                  <h3 className="text-xl font-semibold mb-2">Watermark Editor Coming Soon</h3>
                  <p className="text-muted-foreground mb-6">We are building an advanced canvas editor to let you add custom text and logo watermarks.</p>
                  <Button onClick={() => toast.info('Feature in development')}>Notify Me When Ready</Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <ExtraToolTips toolName="Image Watermark" />
          <ToolContentDisplay content={contentData} />
          <RelatedToolsSection currentCategory="Images" currentPath="/image/image-watermark" />
        </div>
      </main>
      

    </div>
  );
};

export default WatermarkRemoverPage;