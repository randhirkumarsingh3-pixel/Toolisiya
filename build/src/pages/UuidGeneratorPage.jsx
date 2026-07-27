import React, { useState } from 'react';
import { Copy, RefreshCw, Download, Trash2, Fingerprint } from 'lucide-react';
import { Helmet } from 'react-helmet';
import { useSEOData } from '@/hooks/useSEOData.js';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import BreadcrumbNavigation from '@/components/BreadcrumbNavigation.jsx';
import SEOContentSection from '@/components/SEOContentSection.jsx';
import NavigationButtons from '@/components/NavigationButtons.jsx';

const UuidGeneratorPage = () => {
  const { seoData } = useSEOData('uuid-generator');
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  const [version, setVersion] = useState('v4');
  const [count, setCount] = useState(5);
  const [uuids, setUuids] = useState([]);

  const generateV1 = () => {
    let d = Date.now();
    return 'xxxxxxxx-xxxx-1xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      let r = (d + Math.random()*16)%16 | 0;
      d = Math.floor(d/16);
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
  };

  const generateV4 = () => {
    return window.crypto.randomUUID ? window.crypto.randomUUID() : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      let r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  const handleGenerate = () => {
    const num = Math.min(Math.max(1, parseInt(count) || 1), 1000);
    setCount(num);
    
    const list = [];
    for(let i=0; i<num; i++) {
      list.push({
        id: Date.now() + i,
        value: version === 'v4' ? generateV4() : generateV1()
      });
    }
    setUuids(list);
    toast.success(`Generated ${num} UUIDs`);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const copyAll = () => {
    if (!uuids.length) return;
    navigator.clipboard.writeText(uuids.map(u => u.value).join('\n'));
    toast.success('All UUIDs copied');
  };

  const downloadFile = (format) => {
    if (!uuids.length) return;
    let content = '';
    let mime = 'text/plain';
    
    if (format === 'txt') {
      content = uuids.map(u => u.value).join('\n');
    } else if (format === 'csv') {
      content = 'UUID\n' + uuids.map(u => u.value).join('\n');
      mime = 'text/csv';
    } else if (format === 'json') {
      content = JSON.stringify(uuids.map(u => u.value), null, 2);
      mime = 'application/json';
    }

    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `uuids_${Date.now()}.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const seoDescription = "Generate cryptographically secure Version 4 and Version 1 Universally Unique Identifiers (UUIDs/GUIDs) instantly. Export bulk UUIDs to CSV or JSON formats.";
  const seoFeatures = [
    "Supports highly secure, completely random Version 4 UUIDs using the Web Crypto API",
    "Generates mock time-based Version 1 UUIDs for legacy system testing",
    "Bulk generation capabilities (up to 1,000 identifiers instantly)",
    "Export generated lists directly to JSON, CSV, or TXT file formats",
    "One-click copy to clipboard for fast development workflows"
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>{seoData?.meta_title || 'Bulk UUID & GUID Generator Online | Version 4 & 1'}</title>
        {seoData?.meta_description && <meta name="description" content={seoData.meta_description} />}
        {seoData?.meta_keywords && <meta name="keywords" content={seoData.meta_keywords} />}
        {seoData?.og_title && <meta property="og:title" content={seoData.og_title} />}
        {seoData?.og_description && <meta property="og:description" content={seoData.og_description} />}
        {seoData?.og_image && <meta property="og:image" content={seoData.og_image} />}
        <meta property="og:url" content={currentUrl} />
        <meta property="og:type" content="website" />
        {seoData?.structured_data && (
          <script type="application/ld+json">
            {typeof seoData.structured_data === 'string' ? seoData.structured_data : JSON.stringify(seoData.structured_data)}
          </script>
        )}
      </Helmet>
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-5xl">
          <BreadcrumbNavigation customTitle="UUID Generator" />
          
          <div className="mb-8 mt-4 text-center animate-slide-up">
            <Fingerprint className="h-12 w-12 text-primary mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">{seoData?.h1_tag || 'UUID / GUID Generator'}</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Instantly generate cryptographically secure UUIDs for your database, keys, and session identifiers.</p>
          </div>

          <NavigationButtons />

          <Card className="shadow-lg border-border mb-8 max-w-3xl mx-auto">
            <CardHeader className="bg-muted/30 border-b pb-4">
              <CardTitle>Generator Settings</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6 items-end">
                <div className="space-y-2 flex-1">
                  <Label className="text-base font-bold">UUID Version</Label>
                  <Select value={version} onValueChange={setVersion}>
                    <SelectTrigger className="h-12 text-base">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="v4">Version 4 (Random) - Recommended</SelectItem>
                      <SelectItem value="v1">Version 1 (Time-based Mock)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 w-full md:w-48">
                  <Label className="text-base font-bold">Quantity (1-1000)</Label>
                  <Input type="number" min="1" max="1000" value={count} onChange={e => setCount(e.target.value)} className="h-12 text-lg font-mono text-center" />
                </div>
                <Button size="lg" className="h-12 w-full md:w-auto px-8 text-lg shadow-md font-bold" onClick={handleGenerate}>
                  <RefreshCw className="h-5 w-5 mr-2" /> Generate
                </Button>
              </div>
            </CardContent>
          </Card>

          {uuids.length > 0 && (
            <Card className="shadow-md border-border max-w-3xl mx-auto overflow-hidden animate-fade-in mb-12">
              <div className="p-4 bg-muted/30 border-b flex flex-wrap justify-between items-center gap-4">
                <span className="font-bold text-lg px-2 text-primary">{uuids.length} Identifiers Created</span>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" onClick={() => downloadFile('txt')} className="bg-background font-medium"><Download className="h-4 w-4 mr-2"/> TXT</Button>
                  <Button variant="outline" size="sm" onClick={() => downloadFile('csv')} className="bg-background font-medium"><Download className="h-4 w-4 mr-2"/> CSV</Button>
                  <Button variant="outline" size="sm" onClick={() => downloadFile('json')} className="bg-background font-medium"><Download className="h-4 w-4 mr-2"/> JSON</Button>
                  <Button variant="secondary" size="sm" onClick={copyAll} className="font-bold"><Copy className="h-4 w-4 mr-2"/> Copy All</Button>
                  <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10" onClick={() => setUuids([])}><Trash2 className="h-4 w-4"/></Button>
                </div>
              </div>
              <CardContent className="p-0 max-h-[500px] overflow-y-auto font-mono text-sm md:text-base">
                <div className="divide-y divide-border">
                  {uuids.map((u, i) => (
                    <div key={u.id} className="flex justify-between items-center p-4 hover:bg-muted/50 transition-colors group">
                      <span className="text-muted-foreground w-10 text-xs text-right pr-4">{i+1}.</span>
                      <span className="flex-1 font-semibold tracking-wider text-foreground">{u.value}</span>
                      <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 h-8 w-8 hover:bg-background shadow-sm border" onClick={() => copyToClipboard(u.value)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <SEOContentSection 
            description={seoDescription}
            features={seoFeatures}
            howToSteps={[]}
            faqs={[]}
            relatedTools={[]}
            categoryPath="/developer"
          />

        </div>
      </main>
    </div>
  );
};

export default UuidGeneratorPage;