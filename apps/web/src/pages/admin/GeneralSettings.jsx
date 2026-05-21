import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import pb from '@/lib/pocketbaseClient.js';
import { Save, Loader2, RotateCcw, Globe, Mail, Phone, MapPin, Monitor, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

const GeneralSettings = () => {
  const [formData, setFormData] = useState({
    site_name: '',
    site_description: '',
    contact_email: '',
    contact_phone: '',
    contact_address: '',
    maintenance_mode: false
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [settingsRecordId, setSettingsRecordId] = useState(null);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      const records = await pb.collection('website_settings').getFullList({ $autoCancel: false });
      if (records.length > 0) {
        // We assume the first record is the global settings record
        const settings = records[0];
        setSettingsRecordId(settings.id);
        setFormData({
          site_name: settings.site_name || '',
          site_description: settings.site_description || '',
          contact_email: settings.contact_email || '',
          contact_phone: settings.contact_phone || '',
          contact_address: settings.contact_address || '',
          maintenance_mode: !!settings.maintenance_mode
        });
      }
    } catch (err) {
      console.error('Error fetching settings', err);
      toast.error('Failed to load website settings.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSwitchChange = (name, checked) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (settingsRecordId) {
        await pb.collection('website_settings').update(settingsRecordId, formData, { $autoCancel: false });
      } else {
        const created = await pb.collection('website_settings').create(formData, { $autoCancel: false });
        setSettingsRecordId(created.id);
      }
      toast.success('Website configuration updated successfully.');
    } catch (err) {
      console.error('Save error', err);
      toast.error('Failed to save settings. Please ensure database fields match.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh] gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
        <p className="text-muted-foreground animate-pulse">Loading platform settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <Helmet><title>General Settings - Admin</title></Helmet>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">General Settings</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage global platform identity, contact info, and status.</p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button variant="outline" onClick={fetchSettings} disabled={isSaving} className="flex-1 sm:flex-none">
            <RotateCcw className="h-4 w-4 mr-2" /> Reset
          </Button>
          <Button onClick={handleSave} disabled={isSaving} className="flex-1 sm:flex-none bg-indigo-600 hover:bg-indigo-700">
            {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            Save All Settings
          </Button>
        </div>
      </div>

      <Tabs defaultValue="identity" className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px] mb-8">
          <TabsTrigger value="identity">Identity</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="status">Status</TabsTrigger>
        </TabsList>

        <TabsContent value="identity" className="space-y-6 max-w-3xl">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-indigo-500" />
                <CardTitle className="text-lg">Site Identity</CardTitle>
              </div>
              <CardDescription>Configure how your website appears to search engines and users.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  Website Name
                  <Badge variant="outline" className="text-[10px] font-normal py-0">Required</Badge>
                </label>
                <Input 
                  name="site_name"
                  value={formData.site_name} 
                  onChange={handleChange} 
                  placeholder="e.g. Toolisiya"
                  className="bg-background"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  Meta Description
                  <Info className="h-3 w-3 text-slate-400" />
                </label>
                <Textarea 
                  name="site_description"
                  value={formData.site_description} 
                  onChange={handleChange} 
                  placeholder="Describe your platform in 150-160 characters..."
                  rows={4}
                  className="bg-background resize-none"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact" className="space-y-6 max-w-3xl">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-indigo-500" />
                <CardTitle className="text-lg">Contact Information</CardTitle>
              </div>
              <CardDescription>Public contact details for your support team.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Mail className="h-3 w-3" /> Support Email
                  </label>
                  <Input 
                    name="contact_email"
                    type="email" 
                    value={formData.contact_email} 
                    onChange={handleChange} 
                    placeholder="support@toolisiya.com"
                    className="bg-background"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Phone className="h-3 w-3" /> Support Phone
                  </label>
                  <Input 
                    name="contact_phone"
                    value={formData.contact_phone} 
                    onChange={handleChange} 
                    placeholder="+91 XXXXX XXXXX"
                    className="bg-background"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <MapPin className="h-3 w-3" /> Office Address
                </label>
                <Textarea 
                  name="contact_address"
                  value={formData.contact_address} 
                  onChange={handleChange} 
                  placeholder="Full physical address..."
                  rows={3}
                  className="bg-background"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="status" className="space-y-6 max-w-3xl">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Monitor className="h-5 w-5 text-indigo-500" />
                <CardTitle className="text-lg">Platform Status</CardTitle>
              </div>
              <CardDescription>Control visibility and operational state of the website.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-2">
              <div className="flex items-center justify-between p-4 border rounded-xl bg-slate-50/50 hover:bg-slate-50 transition-colors">
                <div className="space-y-0.5">
                  <h4 className="text-sm font-semibold">Maintenance Mode</h4>
                  <p className="text-xs text-muted-foreground">Redirect all public traffic to a maintenance page.</p>
                </div>
                <Switch 
                  checked={formData.maintenance_mode} 
                  onCheckedChange={(checked) => handleSwitchChange('maintenance_mode', checked)} 
                  className="data-[state=checked]:bg-indigo-600"
                />
              </div>

              <div className="p-4 border border-amber-100 rounded-xl bg-amber-50/50 flex gap-3 items-start">
                <Info className="h-4 w-4 text-amber-600 mt-0.5" />
                <div className="text-xs text-amber-800 leading-relaxed">
                  <p className="font-semibold mb-1">Important Notice</p>
                  Enabling maintenance mode will hide all tools and pages from public visitors. Administrators can still access the console.
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GeneralSettings;