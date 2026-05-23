import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import pb from '@/lib/pocketbaseClient.js';
import apiServerClient from '@/lib/apiServerClient.js';
import { Save, Loader2, CheckCircle2, XCircle, Search, LayoutTemplate } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const SEOSettings = () => {
  const [tools, setTools] = useState([]);
  const [seoRecords, setSeoRecords] = useState([]);
  const [selectedSlug, setSelectedSlug] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    meta_title: '',
    meta_description: '',
    meta_keywords: '',
    h1_tag: '',
    og_title: '',
    og_description: '',
    og_image: '',
    structured_data: ''
  });

  useEffect(() => {
    const fetchRegistry = async () => {
      setIsLoading(true);
      try {
        const toolsList = await pb.collection('tools').getFullList({ sort: 'category,name', $autoCancel: false });
        setTools(toolsList);
        
        const seoRes = await apiServerClient.fetch('/admin/seo_settings');
        const seoList = seoRes.ok ? await seoRes.json() : [];
        setSeoRecords(seoList);
        
        if (toolsList.length > 0) {
          const firstSlug = toolsList[0].url.split('/').pop() || toolsList[0].name.toLowerCase().replace(/\s+/g, '-');
          setSelectedSlug(firstSlug);
        }
      } catch (err) {
        console.error("Error fetching tools registry:", err);
        toast.error("Failed to load tools registry from database");
      } finally {
        setIsLoading(false);
      }
    };
    fetchRegistry();
  }, []);

  useEffect(() => {
    if (!selectedSlug) return;
    
    const fetchToolSEO = async () => {
      setIsLoading(true);
      try {
        const response = await apiServerClient.fetch(`/seo/${selectedSlug}`);
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            setFormData({
              meta_title: data.data.meta_title || '',
              meta_description: data.data.meta_description || '',
              meta_keywords: data.data.meta_keywords || '',
              h1_tag: data.data.h1_tag || '',
              og_title: data.data.og_title || '',
              og_description: data.data.og_description || '',
              og_image: data.data.og_image || '',
              structured_data: data.data.structured_data ? JSON.stringify(data.data.structured_data, null, 2) : ''
            });
          }
        } else {
          resetForm();
        }
      } catch (err) {
        console.error("Error fetching SEO data:", err);
        resetForm();
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchToolSEO();
  }, [selectedSlug]);

  const resetForm = () => {
    setFormData({
      meta_title: '', meta_description: '', meta_keywords: '', h1_tag: '', og_title: '', og_description: '', og_image: '', structured_data: ''
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      let parsedSchema = null;
      if (formData.structured_data) {
        try {
          parsedSchema = JSON.parse(formData.structured_data);
        } catch (e) {
          toast.error("Invalid JSON format in Structured Data");
          setIsSaving(false);
          return;
        }
      }

      const payload = {
        ...formData,
        structured_data: parsedSchema ? JSON.stringify(parsedSchema) : null
      };

      const response = await apiServerClient.fetch(`/seo/${selectedSlug}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${pb.authStore.token}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error('Failed to save SEO data');
      
      toast.success('SEO settings saved successfully');
      
      const seoRes = await apiServerClient.fetch('/admin/seo_settings');
      const seoList = seoRes.ok ? await seoRes.json() : [];
      setSeoRecords(seoList);
      
    } catch (err) {
      console.error("Save error:", err);
      toast.error(err.message || "Failed to save SEO settings");
    } finally {
      setIsSaving(false);
    }
  };

  const groupedTools = useMemo(() => {
    const groups = {};
    const filtered = tools.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()));
    
    filtered.forEach(tool => {
      const cat = tool.category || 'Uncategorized';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(tool);
    });
    return groups;
  }, [tools, searchQuery]);

  const isComplete = (slug) => {
    return seoRecords.some(r => r.page_name === slug || r.page_name.includes(slug));
  };

  const getSlugFromUrl = (url, name) => {
    if (url) return url.split('/').pop();
    return name.toLowerCase().replace(/\s+/g, '-');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 animate-in fade-in">
      <Helmet><title>SEO Management | Admin</title></Helmet>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">SEO Management</h1>
          <p className="text-muted-foreground mt-1">Manage Meta Tags, Open Graph, and Schema for all 55+ tools.</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={selectedSlug} onValueChange={setSelectedSlug} disabled={isLoading || isSaving}>
            <SelectTrigger className="w-[320px] bg-background">
              <SelectValue placeholder="Select a tool to edit" />
            </SelectTrigger>
            <SelectContent className="max-h-[500px]">
              <div className="px-2 py-2 sticky top-0 bg-popover z-10 border-b mb-2">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search tools..." 
                    className="h-9 pl-8 text-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.stopPropagation()}
                  />
                </div>
              </div>
              
              {Object.entries(groupedTools).map(([category, categoryTools]) => (
                <SelectGroup key={category}>
                  <SelectLabel className="font-bold text-primary bg-muted/30 py-2">{category}</SelectLabel>
                  {categoryTools.map(tool => {
                    const slug = getSlugFromUrl(tool.url, tool.name);
                    const complete = isComplete(slug);
                    return (
                      <SelectItem key={tool.id} value={slug} className="cursor-pointer">
                        <div className="flex items-center justify-between w-full gap-4">
                          <span>{tool.name}</span>
                          {complete ? (
                            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px] h-4 px-1">Done</Badge>
                          ) : (
                            <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20 text-[10px] h-4 px-1">Missing</Badge>
                          )}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectGroup>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleSave} disabled={isLoading || isSaving} className="shrink-0">
            {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />} 
            Save SEO Data
          </Button>
        </div>
      </div>

      <Card className="bg-card shadow-sm border-border/50">
        <CardHeader className="border-b pb-4 mb-4 bg-muted/20">
          <CardTitle className="flex items-center gap-2">
            <LayoutTemplate className="h-5 w-5 text-primary" /> 
            SEO Configuration for: <span className="text-primary">{selectedSlug}</span>
          </CardTitle>
          <CardDescription>Update search engine metadata and social sharing cards.</CardDescription>
        </CardHeader>

        {isLoading ? (
          <CardContent className="py-20 flex justify-center">
             <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </CardContent>
        ) : (
          <CardContent className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h3 className="text-lg font-semibold border-b pb-2">Search Engine Tags</h3>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-end">
                    <label className="text-sm font-medium">Meta Title</label>
                    <span className={`text-xs ${formData.meta_title.length > 60 ? 'text-destructive font-bold' : 'text-muted-foreground'}`}>
                      {formData.meta_title.length}/60
                    </span>
                  </div>
                  <Input 
                    value={formData.meta_title} 
                    onChange={e => setFormData({...formData, meta_title: e.target.value})} 
                    placeholder="e.g. Free Income Tax Calculator | Calculate Your Tax Liability"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-end">
                    <label className="text-sm font-medium">Meta Description</label>
                    <span className={`text-xs ${formData.meta_description.length > 160 ? 'text-destructive font-bold' : 'text-muted-foreground'}`}>
                      {formData.meta_description.length}/160
                    </span>
                  </div>
                  <Textarea 
                    value={formData.meta_description} 
                    onChange={e => setFormData({...formData, meta_description: e.target.value})} 
                    rows={4}
                    placeholder="e.g. Calculate your income tax instantly with our free calculator..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">H1 Tag (Main Heading)</label>
                  <Input 
                    value={formData.h1_tag} 
                    onChange={e => setFormData({...formData, h1_tag: e.target.value})} 
                    placeholder="e.g. Income Tax Calculator 2024-25"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Meta Keywords</label>
                  <Input 
                    value={formData.meta_keywords} 
                    onChange={e => setFormData({...formData, meta_keywords: e.target.value})} 
                    placeholder="e.g. tax calculator, income tax, tax brackets"
                  />
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-lg font-semibold border-b pb-2">Open Graph (Social Media)</h3>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">OG Title</label>
                  <Input 
                    value={formData.og_title} 
                    onChange={e => setFormData({...formData, og_title: e.target.value})} 
                    placeholder="Title for Facebook/LinkedIn sharing"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">OG Description</label>
                  <Textarea 
                    value={formData.og_description} 
                    onChange={e => setFormData({...formData, og_description: e.target.value})} 
                    rows={3}
                    placeholder="Description for social sharing"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">OG Image URL</label>
                  <Input 
                    value={formData.og_image} 
                    onChange={e => setFormData({...formData, og_image: e.target.value})} 
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-6 border-t">
              <div className="flex justify-between items-end">
                <label className="text-sm font-medium">Structured Data (JSON-LD)</label>
                <span className="text-xs font-mono bg-muted px-2 py-1 rounded text-muted-foreground">application/ld+json</span>
              </div>
              <Textarea 
                value={formData.structured_data} 
                onChange={e => setFormData({...formData, structured_data: e.target.value})}
                rows={10} 
                className="font-mono text-sm bg-muted/30" 
                placeholder='{&#10;  "@context": "https://schema.org",&#10;  "@type": "SoftwareApplication",&#10;  "name": "Tool Name"&#10;}'
              />
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default SEOSettings;