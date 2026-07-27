import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { toast } from 'sonner';
import { Save, RefreshCw, UploadCloud, Download, Search, SearchCode, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import pb from '@/lib/pocketbaseClient.js';
import SEO_METADATA from '@/data/SEO_METADATA.json';

const SEOManagement = () => {
  const [pages, setPages] = useState([]);
  const [selectedPage, setSelectedPage] = useState('');
  const [formData, setFormData] = useState({
    meta_title: '',
    meta_description: '',
    h1_tag: '',
    keywords: '',
    og_title: '',
    og_description: '',
    twitter_title: '',
    twitter_description: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [currentDbId, setCurrentDbId] = useState(null);

  // Character Counts & Metrics
  const titleLength = formData.meta_title.length;
  const descLength = formData.meta_description.length;
  const keywordArray = formData.keywords.split(',').map(k => k.trim()).filter(Boolean);
  const keywordCount = keywordArray.length;

  const calculateScore = () => {
    let score = 100;
    if (titleLength < 30 || titleLength > 60) score -= 15;
    if (descLength < 120 || descLength > 160) score -= 15;
    if (!formData.h1_tag) score -= 20;
    if (keywordCount < 3) score -= 10;
    if (keywordCount > 10) score -= 5;
    if (!formData.og_title) score -= 5;
    return Math.max(0, score);
  };

  const seoScore = calculateScore();

  useEffect(() => {
    const fetchPages = async () => {
      try {
        const records = await pb.collection('seo_settings').getFullList({ sort: 'page_name', $autoCancel: false });
        
        // Merge DB pages with JSON baseline
        const jsonPages = Object.keys(SEO_METADATA);
        const dbPages = records.map(r => r.page_name);
        const uniquePages = Array.from(new Set([...jsonPages, ...dbPages])).sort();
        
        setPages(uniquePages);
        if (uniquePages.length > 0) {
          setSelectedPage(uniquePages[0]);
        }
      } catch (err) {
        toast.error("Failed to load pages");
        setPages(Object.keys(SEO_METADATA));
      }
    };
    fetchPages();
  }, []);

  useEffect(() => {
    if (!selectedPage) return;
    loadPageData(selectedPage);
  }, [selectedPage]);

  const loadPageData = async (pageName) => {
    setIsLoading(true);
    try {
      // Check DB first
      const record = await pb.collection('seo_settings').getFirstListItem(`page_name="${pageName}"`, { $autoCancel: false });
      setCurrentDbId(record.id);
      setFormData({
        meta_title: record.meta_title || '',
        meta_description: record.meta_description || '',
        h1_tag: record.h1_tag || '',
        keywords: record.meta_keywords || record.keywords || '',
        og_title: record.og_title || '',
        og_description: record.og_description || '',
        twitter_title: record.twitter_title || '',
        twitter_description: record.twitter_description || ''
      });
    } catch (err) {
      setCurrentDbId(null);
      // Fallback to JSON
      const staticData = SEO_METADATA[pageName] || {};
      setFormData({
        meta_title: staticData.meta_title || '',
        meta_description: staticData.meta_description || '',
        h1_tag: staticData.h1_tag || '',
        keywords: staticData.keywords || '',
        og_title: staticData.og_title || '',
        og_description: staticData.og_description || '',
        twitter_title: staticData.twitter_title || '',
        twitter_description: staticData.twitter_description || ''
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload = {
        page_name: selectedPage,
        meta_title: formData.meta_title,
        meta_description: formData.meta_description,
        h1_tag: formData.h1_tag,
        meta_keywords: formData.keywords,
        og_title: formData.og_title,
        og_description: formData.og_description,
        twitter_title: formData.twitter_title,
        twitter_description: formData.twitter_description
      };

      if (currentDbId) {
        await pb.collection('seo_settings').update(currentDbId, payload, { $autoCancel: false });
        toast.success("SEO Metadata updated successfully!");
      } else {
        const record = await pb.collection('seo_settings').create(payload, { $autoCancel: false });
        setCurrentDbId(record.id);
        toast.success("SEO Metadata created successfully!");
      }
    } catch (err) {
      toast.error(err.message || "Failed to save metadata");
    } finally {
      setIsSaving(false);
    }
  };

  const getColorByScore = (score) => {
    if (score >= 80) return "bg-emerald-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-destructive";
  };

  const getLengthIndicator = (current, min, max) => {
    if (current === 0) return <span className="text-xs text-muted-foreground">{current}/{max}</span>;
    if (current < min) return <span className="text-xs text-yellow-600 font-medium">{current}/{max} (Too short)</span>;
    if (current > max) return <span className="text-xs text-destructive font-bold">{current}/{max} (Too long)</span>;
    return <span className="text-xs text-emerald-600 font-medium">{current}/{max} (Optimal)</span>;
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Helmet>
        <title>SEO Management | Admin Dashboard</title>
      </Helmet>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">SEO Metadata Management</h1>
          <p className="text-muted-foreground">Manage on-page SEO settings, titles, and social cards across the platform.</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Select value={selectedPage} onValueChange={setSelectedPage}>
            <SelectTrigger className="w-full md:w-[250px] h-10 font-medium">
              <Search className="w-4 h-4 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Select Page" />
            </SelectTrigger>
            <SelectContent className="max-h-[300px]">
              {pages.map(p => (
                <SelectItem key={p} value={p}>{p}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleSave} disabled={isSaving || isLoading} className="shadow-sm font-bold">
            {isSaving ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            Save Changes
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column - Editor */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="general">General SEO</TabsTrigger>
              <TabsTrigger value="social">Social Media (OG/Twitter)</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>
            
            <TabsContent value="general" className="space-y-6">
              <Card className="shadow-sm">
                <CardHeader className="bg-muted/20 border-b pb-4">
                  <CardTitle className="text-lg">Meta Tags</CardTitle>
                  <CardDescription>Primary tags used by search engines.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 p-6">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label className="font-bold">Meta Title</Label>
                      {getLengthIndicator(titleLength, 50, 60)}
                    </div>
                    <Input 
                      value={formData.meta_title} 
                      onChange={e => setFormData({...formData, meta_title: e.target.value})} 
                      placeholder="Primary SEO Title"
                      className="font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label className="font-bold">Meta Description</Label>
                      {getLengthIndicator(descLength, 150, 160)}
                    </div>
                    <Textarea 
                      value={formData.meta_description} 
                      onChange={e => setFormData({...formData, meta_description: e.target.value})} 
                      placeholder="Compelling description to drive CTR"
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label className="font-bold">Keywords</Label>
                      <span className="text-xs text-muted-foreground">{keywordCount} keywords</span>
                    </div>
                    <Input 
                      value={formData.keywords} 
                      onChange={e => setFormData({...formData, keywords: e.target.value})} 
                      placeholder="Comma-separated keywords"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm">
                <CardHeader className="bg-muted/20 border-b pb-4">
                  <CardTitle className="text-lg">On-Page Content</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 p-6">
                  <div className="space-y-2">
                    <Label className="font-bold">H1 Heading</Label>
                    <Input 
                      value={formData.h1_tag} 
                      onChange={e => setFormData({...formData, h1_tag: e.target.value})} 
                      placeholder="Primary visible heading on page"
                    />
                    <p className="text-xs text-muted-foreground">Ensure this matches the main visual heading of the tool.</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="social" className="space-y-6">
              <Card className="shadow-sm">
                <CardHeader className="bg-muted/20 border-b pb-4">
                  <CardTitle className="text-lg">Open Graph (Facebook/LinkedIn)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 p-6">
                  <div className="space-y-2">
                    <Label className="font-bold">OG Title</Label>
                    <Input 
                      value={formData.og_title} 
                      onChange={e => setFormData({...formData, og_title: e.target.value})} 
                      placeholder="Leave blank to use Meta Title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-bold">OG Description</Label>
                    <Textarea 
                      value={formData.og_description} 
                      onChange={e => setFormData({...formData, og_description: e.target.value})} 
                      rows={2}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm">
                <CardHeader className="bg-muted/20 border-b pb-4">
                  <CardTitle className="text-lg">Twitter Cards</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 p-6">
                  <div className="space-y-2">
                    <Label className="font-bold">Twitter Title</Label>
                    <Input 
                      value={formData.twitter_title} 
                      onChange={e => setFormData({...formData, twitter_title: e.target.value})} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-bold">Twitter Description</Label>
                    <Textarea 
                      value={formData.twitter_description} 
                      onChange={e => setFormData({...formData, twitter_description: e.target.value})} 
                      rows={2}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="advanced">
              <Card className="shadow-sm border-dashed">
                <CardContent className="p-12 text-center text-muted-foreground flex flex-col items-center">
                  <SearchCode className="h-12 w-12 mb-4 opacity-50" />
                  <h3 className="font-bold text-lg text-foreground mb-2">Schema Markup & Structured Data</h3>
                  <p className="max-w-md text-sm mb-6">Advanced schema markup is generated dynamically via utility functions for Toolisiya components. Future updates will allow manual schema overrides here.</p>
                  <Button variant="outline" disabled>Schema Editor Coming Soon</Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Column - Previews & Scores */}
        <div className="space-y-6">
          <Card className="shadow-sm border-border bg-gradient-to-b from-card to-muted/20">
            <CardHeader className="pb-4">
              <CardTitle className="text-base flex items-center justify-between">
                Optimization Score
                <span className={`text-xl font-black ${seoScore >= 80 ? 'text-emerald-500' : seoScore >= 60 ? 'text-yellow-500' : 'text-destructive'}`}>
                  {seoScore}/100
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={seoScore} className={`h-2 mb-6 ${getColorByScore(seoScore)}`} />
              
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  {titleLength >= 50 && titleLength <= 60 ? <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5" /> : <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5" />}
                  <span className={titleLength >= 50 && titleLength <= 60 ? "text-foreground" : "text-muted-foreground"}>Title length is optimal (50-60 chars)</span>
                </div>
                <div className="flex items-start gap-2">
                  {descLength >= 120 && descLength <= 160 ? <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5" /> : <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5" />}
                  <span className={descLength >= 120 && descLength <= 160 ? "text-foreground" : "text-muted-foreground"}>Description length is optimal (120-160 chars)</span>
                </div>
                <div className="flex items-start gap-2">
                  {formData.h1_tag ? <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5" /> : <XCircle className="w-4 h-4 text-destructive mt-0.5" />}
                  <span className={formData.h1_tag ? "text-foreground" : "text-muted-foreground"}>H1 tag is configured</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm overflow-hidden">
            <CardHeader className="bg-muted/30 border-b py-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Search className="w-4 h-4 text-primary" /> Google SERP Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 bg-white dark:bg-slate-950">
              <div className="max-w-sm">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-[10px] font-bold">T</div>
                  <div className="flex flex-col leading-none">
                    <span className="text-[13px] text-slate-800 dark:text-slate-200">Toolisiya</span>
                    <span className="text-[11px] text-slate-500">https://toolisiya.com › {selectedPage}</span>
                  </div>
                </div>
                <h3 className="text-[18px] text-[#1a0dab] dark:text-[#8ab4f8] font-normal leading-snug mb-1 hover:underline cursor-pointer truncate">
                  {formData.meta_title || 'Enter a meta title...'}
                </h3>
                <p className="text-[13px] text-[#4d5156] dark:text-[#bdc1c6] leading-snug line-clamp-2">
                  {formData.meta_description || 'Enter a meta description to see how it will appear in search results...'}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm overflow-hidden">
            <CardHeader className="bg-muted/30 border-b py-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                Social Share Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="w-full h-40 bg-muted flex items-center justify-center border-b">
                <span className="text-muted-foreground font-medium text-sm">Primary OG Image</span>
              </div>
              <div className="p-4 bg-card">
                <div className="text-[11px] text-muted-foreground uppercase tracking-wide mb-1">toolisiya.com</div>
                <h3 className="font-bold text-[15px] leading-tight mb-1 truncate">
                  {formData.og_title || formData.meta_title || 'Social Share Title'}
                </h3>
                <p className="text-[13px] text-muted-foreground leading-snug line-clamp-1">
                  {formData.og_description || formData.meta_description || 'Social share description preview...'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SEOManagement;