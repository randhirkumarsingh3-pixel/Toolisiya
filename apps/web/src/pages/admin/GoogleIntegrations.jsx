import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Save, CheckCircle2, Loader2, AlertCircle, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient.js';

const GoogleIntegrations = () => {
  const [ga4Id, setGa4Id] = useState('');
  const [adsenseId, setAdsenseId] = useState('');
  const [searchConsoleCode, setSearchConsoleCode] = useState('');
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
          setGa4Id(settings.ga4_measurement_id || '');
          setAdsenseId(settings.adsense_publisher_id || '');
          setSearchConsoleCode(settings.search_console_verification || '');
        }
      } catch (err) {
        console.error('Failed to load Google settings:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadSettings();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const data = {
        ga4_measurement_id: ga4Id,
        adsense_publisher_id: adsenseId,
        search_console_verification: searchConsoleCode,
      };

      if (settingsRecordId) {
        await pb.collection('website_settings').update(settingsRecordId, data, { $autoCancel: false });
      } else {
        const record = await pb.collection('website_settings').create(data, { $autoCancel: false });
        setSettingsRecordId(record.id);
      }
      toast.success('Google integrations saved successfully');
    } catch (err) {
      console.error('Save error:', err);
      toast.error('Failed to save. The settings fields may not exist in the collection yet.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <Helmet><title>Google Integrations - Admin</title></Helmet>
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Google Integrations</h1>
          <p className="text-muted-foreground text-sm mt-1">Connect Google Analytics, Search Console, and AdSense.</p>
        </div>
        <Button onClick={handleSave} disabled={isSaving || isLoading} className="gap-2 bg-indigo-600 hover:bg-indigo-700">
          {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {isSaving ? 'Saving...' : 'Save Integrations'}
        </Button>
      </div>

      <div className="grid gap-6 max-w-3xl">
        <Card className="shadow-sm border-slate-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Google Analytics 4</CardTitle>
                <CardDescription>Track website traffic and user behavior.</CardDescription>
              </div>
              <Badge variant="outline" className={ga4Id ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-slate-200 text-slate-400"}>
                {ga4Id ? <><CheckCircle2 className="h-3 w-3 mr-1" /> Connected</> : <><AlertCircle className="h-3 w-3 mr-1" /> Not Set</>}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs font-medium text-slate-500">Measurement ID (G-XXXXXXXXXX)</Label>
              <Input 
                value={ga4Id} 
                onChange={(e) => setGa4Id(e.target.value)} 
                placeholder="G-" 
                className="font-mono text-sm"
                disabled={isLoading}
              />
            </div>
            {ga4Id && (
              <a href={`https://analytics.google.com`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-xs text-indigo-600 hover:text-indigo-800 gap-1">
                Open GA4 Dashboard <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Google Search Console</CardTitle>
                <CardDescription>Verify site ownership and monitor search performance.</CardDescription>
              </div>
              <Badge variant="outline" className={searchConsoleCode ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-slate-200 text-slate-400"}>
                {searchConsoleCode ? <><CheckCircle2 className="h-3 w-3 mr-1" /> Verified</> : <><AlertCircle className="h-3 w-3 mr-1" /> Not Set</>}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs font-medium text-slate-500">Verification Meta Tag Content</Label>
              <Input 
                value={searchConsoleCode} 
                onChange={(e) => setSearchConsoleCode(e.target.value)} 
                placeholder="Paste the content value from the meta tag..."
                className="font-mono text-sm"
                disabled={isLoading}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Google AdSense</CardTitle>
                <CardDescription>Monetize your platform with ads.</CardDescription>
              </div>
              <Badge variant="outline" className={adsenseId ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-slate-200 text-slate-400"}>
                {adsenseId ? <><CheckCircle2 className="h-3 w-3 mr-1" /> Connected</> : <><AlertCircle className="h-3 w-3 mr-1" /> Not Set</>}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs font-medium text-slate-500">Publisher ID (pub-XXXXXXXXXXXXXXXX)</Label>
              <Input 
                value={adsenseId} 
                onChange={(e) => setAdsenseId(e.target.value)} 
                placeholder="pub-"
                className="font-mono text-sm"
                disabled={isLoading}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GoogleIntegrations;