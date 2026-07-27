import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Save, Facebook, Twitter, Instagram, Linkedin, Youtube, Loader2, ExternalLink, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient.js';

const socialFields = [
  { key: 'facebook_url', icon: Facebook, label: 'Facebook', placeholder: 'https://facebook.com/toolisiya', color: 'text-blue-600' },
  { key: 'twitter_url', icon: Twitter, label: 'Twitter / X', placeholder: 'https://twitter.com/toolisiya', color: 'text-sky-500' },
  { key: 'instagram_url', icon: Instagram, label: 'Instagram', placeholder: 'https://instagram.com/toolisiya', color: 'text-pink-500' },
  { key: 'linkedin_url', icon: Linkedin, label: 'LinkedIn', placeholder: 'https://linkedin.com/company/toolisiya', color: 'text-blue-700' },
  { key: 'youtube_url', icon: Youtube, label: 'YouTube', placeholder: 'https://youtube.com/@toolisiya', color: 'text-red-600' },
];

const SocialMediaSettings = () => {
  const [links, setLinks] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [settingsRecordId, setSettingsRecordId] = useState(null);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const records = await pb.collection('website_settings').getFullList({ $autoCancel: false });
        if (records.length > 0) {
          const settings = records[0];
          setSettingsRecordId(settings.id);
          const loaded = {};
          socialFields.forEach(f => { loaded[f.key] = settings[f.key] || ''; });
          setLinks(loaded);
        }
      } catch (err) {
        console.error('Failed to load social settings:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadSettings();
  }, []);

  const handleSave = async () => {
    // Validate URLs
    for (const field of socialFields) {
      const val = links[field.key];
      if (val && !val.startsWith('http')) {
        toast.error(`${field.label} URL must start with http:// or https://`);
        return;
      }
    }

    setIsSaving(true);
    try {
      if (settingsRecordId) {
        await pb.collection('website_settings').update(settingsRecordId, links, { $autoCancel: false });
      } else {
        const record = await pb.collection('website_settings').create(links, { $autoCancel: false });
        setSettingsRecordId(record.id);
      }
      toast.success('Social media links saved successfully');
    } catch (err) {
      console.error('Save error:', err);
      toast.error('Failed to save. Some fields may not exist in the collection yet.');
    } finally {
      setIsSaving(false);
    }
  };

  const filledCount = socialFields.filter(f => links[f.key]).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <Helmet><title>Social Media - Admin</title></Helmet>
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Social Media</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage social links displayed across the website.</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="hidden sm:flex gap-1">
            <CheckCircle2 className="h-3 w-3" /> {filledCount}/{socialFields.length} linked
          </Badge>
          <Button onClick={handleSave} disabled={isSaving || isLoading} className="gap-2 bg-indigo-600 hover:bg-indigo-700">
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {isSaving ? 'Saving...' : 'Save Links'}
          </Button>
        </div>
      </div>

      <Card className="shadow-sm max-w-3xl border-slate-200">
        <CardHeader>
          <CardTitle className="text-base">Social Profiles</CardTitle>
          <CardDescription>Links to your official social media accounts. These appear in the website footer.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {socialFields.map((field) => {
            const Icon = field.icon;
            const value = links[field.key] || '';
            return (
              <div key={field.key} className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 group-hover:bg-slate-200 transition-colors">
                  <Icon className={`h-5 w-5 ${field.color}`} />
                </div>
                <div className="flex-1 space-y-1">
                  <Label className="text-xs font-medium text-slate-500">{field.label}</Label>
                  <Input 
                    value={value}
                    onChange={(e) => setLinks(prev => ({ ...prev, [field.key]: e.target.value }))}
                    placeholder={field.placeholder}
                    className="font-mono text-sm"
                    disabled={isLoading}
                  />
                </div>
                {value && (
                  <a href={value} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-indigo-600 transition-colors shrink-0 mt-5">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
};

export default SocialMediaSettings;