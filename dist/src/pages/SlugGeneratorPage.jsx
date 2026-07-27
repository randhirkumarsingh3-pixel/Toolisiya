import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Copy, RefreshCcw, Link as LinkIcon, Settings2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import BreadcrumbNavigation from '@/components/BreadcrumbNavigation.jsx';
import NavigationButtons from '@/components/NavigationButtons.jsx';

const SlugGeneratorPage = () => {
  const [inputText, setInputText] = useState('');
  const [slug, setSlug] = useState('');
  const [separator, setSeparator] = useState('-');
  const [casing, setCasing] = useState('lowercase');

  const generateSlug = (text, sep, textCase) => {
    if (!text.trim()) return '';
    
    // Convert to target casing initially
    let processed = text.trim();
    if (textCase === 'lowercase') processed = processed.toLowerCase();
    if (textCase === 'uppercase') processed = processed.toUpperCase();
    
    // Remove special characters, keeping alphanumeric and spaces
    processed = processed.replace(/[^\w\s-]/g, '');
    
    // Replace spaces and existing dashes/underscores with the chosen separator
    processed = processed.replace(/[\s_-]+/g, sep);
    
    // Handle title case if needed
    if (textCase === 'titlecase') {
      processed = processed.split(sep)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(sep);
    }

    return processed;
  };

  useEffect(() => {
    setSlug(generateSlug(inputText, separator, casing));
  }, [inputText, separator, casing]);

  const handleCopy = () => {
    if (!slug) return;
    navigator.clipboard.writeText(slug);
    toast.success('Slug copied to clipboard');
  };

  const handleClear = () => {
    setInputText('');
    setSlug('');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>Free URL Slug Generator | Toolisiya</title>
        <meta name="description" content="Generate clean, SEO-friendly URL slugs instantly from any text string. Customize separators and casing." />
        <meta name="keywords" content="slug generator, url slug maker, SEO slug creator, string to slug" />
      </Helmet>

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <NavigationButtons />
          <BreadcrumbNavigation customTitle="Slug Generator" />

          <div className="mb-8 mt-4 text-center">
            <LinkIcon className="h-12 w-12 text-primary mx-auto mb-4" />
            <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">URL Slug Generator</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Transform any text into a clean, SEO-friendly URL slug instantly. 
              Customize separators and casing to match your routing requirements.
            </p>
          </div>

          <Card className="shadow-lg border-border">
            <CardHeader className="bg-muted/30 border-b pb-6">
              <CardTitle className="text-xl flex items-center gap-2">
                <Settings2 className="h-5 w-5 text-primary" /> Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 md:p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Separator Style</Label>
                  <Select value={separator} onValueChange={setSeparator}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select separator" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="-">Dash (-)</SelectItem>
                      <SelectItem value="_">Underscore (_)</SelectItem>
                      <SelectItem value=".">Dot (.)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Text Casing</Label>
                  <Select value={casing} onValueChange={setCasing}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select casing" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lowercase">lowercase</SelectItem>
                      <SelectItem value="uppercase">UPPERCASE</SelectItem>
                      <SelectItem value="titlecase">Title Case</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label>Original Text</Label>
                  <Button variant="ghost" size="sm" onClick={handleClear} className="h-8 px-2 text-muted-foreground hover:text-destructive">
                    <Trash2 className="h-4 w-4 mr-2" /> Clear
                  </Button>
                </div>
                <Textarea 
                  placeholder="Enter your title, phrase, or sentence here..."
                  className="min-h-[120px] text-base resize-y"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                />
              </div>

              <div className="space-y-2 pt-4 border-t border-border">
                <Label className="text-primary font-semibold text-base">Generated Slug</Label>
                <div className="relative">
                  <Textarea 
                    readOnly
                    value={slug}
                    placeholder="your-generated-slug-will-appear-here"
                    className="min-h-[100px] text-base bg-muted/50 border-primary/20 focus-visible:ring-0 resize-none pr-16"
                  />
                  <div className="absolute top-2 right-2 flex flex-col gap-2">
                    <Button size="icon" variant="secondary" onClick={handleCopy} disabled={!slug}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default SlugGeneratorPage;