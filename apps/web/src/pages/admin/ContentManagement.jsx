import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import pb from '@/lib/pocketbaseClient.js';
import { Save, Plus, Trash2, GripVertical, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

const ContentManagement = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Form states per tab
  const [heroData, setHeroData] = useState({ 
    title: 'Free Online Tools for Everyone', 
    description: 'Access 50+ Free Tools for Productivity, Finance, Conversion & More', 
    content: 'Discover a comprehensive collection of free online tools designed to simplify your daily tasks. From financial calculators to document generators, we have everything you need.',
    metadata: { ctaText: 'Explore All Tools', ctaLink: '/tools', background: 'Modern gradient' }
  });
  
  const [featuresData, setFeaturesData] = useState({ 
    title: 'Why Choose Our Tools?', 
    description: 'We provide the best free online tools with these key benefits',
    metadata: { items: [
      { title: 'Fast & Reliable', description: 'Instant results without waiting.', icon: 'Zap' },
      { title: '100% Free', description: 'No hidden costs or subscriptions.', icon: 'Gift' },
      { title: 'No Registration', description: 'Start using tools immediately.', icon: 'UserX' },
      { title: 'Secure & Private', description: 'Your data is never stored.', icon: 'Shield' },
      { title: 'Mobile Friendly', description: 'Works perfectly on all devices.', icon: 'Smartphone' },
      { title: 'Regular Updates', description: 'New tools added frequently.', icon: 'RefreshCw' }
    ]} 
  });

  const [aboutData, setAboutData] = useState({ 
    title: 'About Toolisiya - Free Online Tools Platform', 
    description: 'Learn about our mission to provide free, reliable, and easy-to-use online tools for everyone', 
    content: '## Mission\nTo democratize access to essential digital utilities.\n\n## Vision\nBecoming the internet\'s default toolkit.\n\n## Values\nPrivacy, Speed, Accessibility.\n\n## History\nStarted in 2024 to solve everyday problems.\n\n## Team\nBuilt by passionate developers.\n\n## Contact\nsupport@toolisiya.com' 
  });

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      setIsLoading(true);
      const records = await pb.collection('content_pages').getFullList({ $autoCancel: false });

      // Pre-fill states if they exist in DB
      const hero = records.find(r => r.page_type === 'homepage_hero');
      if (hero) {
        setHeroData({ 
          id: hero.id, 
          title: hero.title || heroData.title, 
          description: hero.description || heroData.description, 
          content: hero.content || heroData.content,
          metadata: hero.metadata || heroData.metadata
        });
      }

      const features = records.find(r => r.page_type === 'homepage_features');
      if (features) {
        setFeaturesData({ 
          id: features.id, 
          title: features.title || featuresData.title, 
          description: features.description || featuresData.description,
          metadata: features.metadata || featuresData.metadata 
        });
      }

      const about = records.find(r => r.page_type === 'about');
      if (about) {
        setAboutData({ 
          id: about.id, 
          title: about.title || aboutData.title, 
          description: about.description || aboutData.description, 
          content: about.content || aboutData.content 
        });
      }

    } catch (err) {
      console.error('Failed to load content', err);
      toast.error('Failed to load content pages.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (pageType, data) => {
    setIsSaving(true);
    try {
      if (data.id) {
        await pb.collection('content_pages').update(data.id, data, { $autoCancel: false });
      } else {
        const created = await pb.collection('content_pages').create({ ...data, page_type: pageType, published: true }, { $autoCancel: false });
        // Update local ID
        if (pageType === 'homepage_hero') setHeroData(prev => ({ ...prev, id: created.id }));
        if (pageType === 'homepage_features') setFeaturesData(prev => ({ ...prev, id: created.id }));
        if (pageType === 'about') setAboutData(prev => ({ ...prev, id: created.id }));
      }
      toast.success(`${pageType.replace('_', ' ')} content saved successfully.`);
    } catch (err) {
      console.error('Save error', err);
      toast.error('Failed to save changes.');
    } finally {
      setIsSaving(false);
    }
  };

  const addFeature = () => {
    const newItems = [...(featuresData.metadata?.items || []), { title: '', description: '', icon: 'CheckCircle' }];
    setFeaturesData({ ...featuresData, metadata: { ...featuresData.metadata, items: newItems } });
  };

  const removeFeature = (idx) => {
    const newItems = featuresData.metadata.items.filter((_, i) => i !== idx);
    setFeaturesData({ ...featuresData, metadata: { ...featuresData.metadata, items: newItems } });
  };

  const updateFeature = (idx, field, value) => {
    const newItems = [...featuresData.metadata.items];
    newItems[idx][field] = value;
    setFeaturesData({ ...featuresData, metadata: { ...featuresData.metadata, items: newItems } });
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-6 pb-12">
      <Helmet><title>Content Management - Admin</title></Helmet>

      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Content Management</h1>
        <p className="text-muted-foreground mt-1">Manage landing page sections and static pages content.</p>
      </div>

      <Tabs defaultValue="hero" className="w-full">
        <TabsList className="bg-muted p-1 mb-6 flex flex-wrap h-auto gap-2">
          <TabsTrigger value="hero">Hero Section</TabsTrigger>
          <TabsTrigger value="features">Features Section</TabsTrigger>
          <TabsTrigger value="about">About Page</TabsTrigger>
        </TabsList>

        <TabsContent value="hero" className="space-y-4 animate-in fade-in">
          <Card>
            <CardHeader>
              <CardTitle>Homepage Hero</CardTitle>
              <CardDescription>Main headline and introductory text on the homepage.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Hero Title</label>
                <Input 
                  value={heroData.title} 
                  onChange={e => setHeroData({...heroData, title: e.target.value})} 
                  className="bg-background text-foreground"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Hero Subtitle</label>
                <Input 
                  value={heroData.description} 
                  onChange={e => setHeroData({...heroData, description: e.target.value})} 
                  className="bg-background text-foreground"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Hero Description</label>
                <Textarea 
                  value={heroData.content} 
                  onChange={e => setHeroData({...heroData, content: e.target.value})}
                  rows={3}
                  className="bg-background text-foreground"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">CTA Button Text</label>
                  <Input 
                    value={heroData.metadata?.ctaText || ''} 
                    onChange={e => setHeroData({...heroData, metadata: {...heroData.metadata, ctaText: e.target.value}})}
                    className="bg-background text-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">CTA Button Link</label>
                  <Input 
                    value={heroData.metadata?.ctaLink || ''} 
                    onChange={e => setHeroData({...heroData, metadata: {...heroData.metadata, ctaLink: e.target.value}})}
                    className="bg-background text-foreground"
                  />
                </div>
              </div>
              <Button onClick={() => handleSave('homepage_hero', heroData)} disabled={isSaving} className="mt-4">
                {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />} Save Hero Section
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="space-y-4 animate-in fade-in">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Why Choose Us (Features)</CardTitle>
                  <CardDescription>Manage the feature blocks displayed on the homepage.</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={addFeature}>
                  <Plus className="h-4 w-4 mr-2" /> Add Feature
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Section Title</label>
                <Input 
                  value={featuresData.title} 
                  onChange={e => setFeaturesData({...featuresData, title: e.target.value})} 
                  className="bg-background text-foreground"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Section Description</label>
                <Textarea 
                  value={featuresData.description} 
                  onChange={e => setFeaturesData({...featuresData, description: e.target.value})} 
                  rows={2}
                  className="bg-background text-foreground"
                />
              </div>

              <div className="space-y-4">
                <label className="text-sm font-medium block">Feature Blocks</label>
                {(featuresData.metadata?.items || []).map((item, idx) => (
                  <div key={idx} className="flex gap-4 items-start p-4 border rounded-lg bg-muted/30">
                    <GripVertical className="h-5 w-5 text-muted-foreground mt-2 shrink-0 cursor-grab" />
                    <div className="flex-1 space-y-3">
                      <div className="grid grid-cols-2 gap-4">
                        <Input 
                          placeholder="Feature Title" 
                          value={item.title} 
                          onChange={(e) => updateFeature(idx, 'title', e.target.value)} 
                          className="bg-background text-foreground"
                        />
                        <Input 
                          placeholder="Icon Name (e.g. Zap, Shield)" 
                          value={item.icon} 
                          onChange={(e) => updateFeature(idx, 'icon', e.target.value)} 
                          className="bg-background text-foreground"
                        />
                      </div>
                      <Textarea 
                        placeholder="Feature Description" 
                        value={item.description} 
                        onChange={(e) => updateFeature(idx, 'description', e.target.value)} 
                        rows={2}
                        className="bg-background text-foreground"
                      />
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => removeFeature(idx)} className="text-destructive hover:bg-destructive/10 shrink-0">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {(!featuresData.metadata?.items || featuresData.metadata.items.length === 0) && (
                  <p className="text-sm text-muted-foreground text-center py-4 border rounded-lg border-dashed">No features added yet.</p>
                )}
              </div>

              <Button onClick={() => handleSave('homepage_features', featuresData)} disabled={isSaving}>
                {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />} Save Features
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="about" className="space-y-4 animate-in fade-in">
          <Card>
            <CardHeader>
              <CardTitle>About Page Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Page Title</label>
                <Input 
                  value={aboutData.title} 
                  onChange={e => setAboutData({...aboutData, title: e.target.value})} 
                  className="bg-background text-foreground"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Page Description</label>
                <Textarea 
                  value={aboutData.description} 
                  onChange={e => setAboutData({...aboutData, description: e.target.value})} 
                  rows={2}
                  className="bg-background text-foreground"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Main Content (Markdown/HTML supported)</label>
                <Textarea 
                  value={aboutData.content} 
                  onChange={e => setAboutData({...aboutData, content: e.target.value})}
                  rows={15}
                  className="font-mono text-sm bg-background text-foreground"
                />
              </div>
              <Button onClick={() => handleSave('about', aboutData)} disabled={isSaving}>
                {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />} Save About Page
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
};

export default ContentManagement;