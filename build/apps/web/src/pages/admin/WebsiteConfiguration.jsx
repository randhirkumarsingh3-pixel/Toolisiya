import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Save, LayoutTemplate } from 'lucide-react';
import pb from '@/lib/pocketbaseClient.js';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';

const WebsiteConfiguration = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [recordId, setRecordId] = useState(null);
  
  const [formData, setFormData] = useState({
    siteName: '',
    siteDescription: '',
    contactEmail: '',
    footerText: '',
    socialLinks: {
      facebook: '',
      twitter: '',
      linkedin: '',
      instagram: ''
    }
  });

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const records = await pb.collection('website_settings').getFullList({
          filter: 'setting_key="site_config"',
          $autoCancel: false
        });
        
        if (records.length > 0) {
          const record = records[0];
          setRecordId(record.id);
          if (record.setting_value) {
            const parsed = JSON.parse(record.setting_value);
            setFormData(prev => ({ ...prev, ...parsed }));
          }
        }
      } catch (error) {
        console.error('Error fetching website config:', error);
        toast.error('Failed to load configuration');
      } finally {
        setIsLoading(false);
      }
    };

    fetchConfig();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('social_')) {
      const platform = name.replace('social_', '');
      setFormData(prev => ({
        ...prev,
        socialLinks: { ...prev.socialLinks, [platform]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    if (!formData.siteName) {
      toast.error('Site Name is required');
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        setting_key: 'site_config',
        setting_type: 'json',
        setting_value: JSON.stringify(formData)
      };

      if (recordId) {
        await pb.collection('website_settings').update(recordId, payload, { $autoCancel: false });
      } else {
        const newRecord = await pb.collection('website_settings').create(payload, { $autoCancel: false });
        setRecordId(newRecord.id);
      }
      
      toast.success('Website configuration saved successfully');
      window.dispatchEvent(new Event('settings-updated'));
    } catch (error) {
      console.error('Error saving config:', error);
      toast.error('Failed to save configuration');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <Card><CardContent className="p-6"><Skeleton className="h-64 w-full" /></CardContent></Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Website Configuration</h1>
        <p className="text-muted-foreground mt-2">Manage general website settings, branding, and social links.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LayoutTemplate className="h-5 w-5 text-primary" />
            General Settings
          </CardTitle>
          <CardDescription>Update your site's core information.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="siteName">Site Name</Label>
              <Input 
                id="siteName" 
                name="siteName" 
                value={formData.siteName} 
                onChange={handleInputChange} 
                placeholder="e.g., Toolisiya"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactEmail">Contact Email</Label>
              <Input 
                id="contactEmail" 
                name="contactEmail" 
                type="email"
                value={formData.contactEmail} 
                onChange={handleInputChange} 
                placeholder="contact@example.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="siteDescription">Site Description</Label>
            <Textarea 
              id="siteDescription" 
              name="siteDescription" 
              value={formData.siteDescription} 
              onChange={handleInputChange} 
              placeholder="Brief description of your website for SEO and general use."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="footerText">Footer Text</Label>
            <Input 
              id="footerText" 
              name="footerText" 
              value={formData.footerText} 
              onChange={handleInputChange} 
              placeholder="© 2026 Toolisiya. All rights reserved."
            />
          </div>

          <div className="pt-4 border-t">
            <h3 className="text-lg font-medium mb-4">Social Links</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="social_facebook">Facebook URL</Label>
                <Input id="social_facebook" name="social_facebook" value={formData.socialLinks.facebook} onChange={handleInputChange} placeholder="https://facebook.com/..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="social_twitter">Twitter URL</Label>
                <Input id="social_twitter" name="social_twitter" value={formData.socialLinks.twitter} onChange={handleInputChange} placeholder="https://twitter.com/..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="social_linkedin">LinkedIn URL</Label>
                <Input id="social_linkedin" name="social_linkedin" value={formData.socialLinks.linkedin} onChange={handleInputChange} placeholder="https://linkedin.com/..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="social_instagram">Instagram URL</Label>
                <Input id="social_instagram" name="social_instagram" value={formData.socialLinks.instagram} onChange={handleInputChange} placeholder="https://instagram.com/..." />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button onClick={handleSave} disabled={isSaving} className="gap-2">
              <Save className="h-4 w-4" />
              {isSaving ? 'Saving...' : 'Save Configuration'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WebsiteConfiguration;