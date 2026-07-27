import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Settings, Moon, Sun, Monitor, Bell, Download, Trash2, ShieldCheck, ChevronRight } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const PwaSettingsPage = () => {
  const { theme, setTheme, systemTheme } = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check notification permission
    if ('Notification' in window) {
      setNotificationsEnabled(Notification.permission === 'granted');
    }

    // Check if running as PWA
    setIsStandalone(window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone);

    // Listen for install prompt
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleNotificationToggle = async (checked) => {
    if (!('Notification' in window)) {
      toast.error('Your browser does not support notifications.');
      return;
    }

    if (checked) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setNotificationsEnabled(true);
        toast.success('Notifications enabled successfully.');
        
        // Show test notification
        new Notification('Toolisiya Alerts Active', {
          body: 'You will now receive productivity and timer alerts.',
          icon: '/logo-transparent.png'
        });
      } else {
        setNotificationsEnabled(false);
        toast.error('Notification permission denied.');
      }
    } else {
      toast.info('Notifications disabled in app. Note: You may need to disable them in your browser settings as well.');
      setNotificationsEnabled(false);
    }
  };

  const handleInstallApp = async () => {
    if (!deferredPrompt) {
      toast.info('The app is already installed or your browser does not support this action.');
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      toast.success('Thank you for installing Toolisiya!');
      setDeferredPrompt(null);
    }
  };

  const handleClearCache = async () => {
    if ('caches' in window) {
      try {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
        toast.success('App cache cleared successfully.');
        setTimeout(() => window.location.reload(), 1000);
      } catch (err) {
        toast.error('Failed to clear cache.');
      }
    }
  };

  const currentTheme = theme === 'system' ? systemTheme : theme;

  return (
    <div className="min-h-screen bg-muted/20 pb-20 md:pb-12">
      <Helmet>
        <title>App Settings - Toolisiya</title>
      </Helmet>

      <div className="bg-background border-b pt-8 pb-4 sticky top-0 z-10">
        <div className="container mx-auto px-4 max-w-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Settings className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">Settings</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-2xl py-6 space-y-6">
        
        {/* Appearance Section */}
        <section>
          <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 px-2">Appearance</h2>
          <div className="bg-card border rounded-2xl overflow-hidden divide-y">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  {currentTheme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                </div>
                <div>
                  <p className="font-medium">Theme Mode</p>
                  <p className="text-xs text-muted-foreground">Select your preferred app theme</p>
                </div>
              </div>
              <div className="flex items-center bg-muted p-1 rounded-lg">
                <button onClick={() => setTheme('light')} className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${theme === 'light' ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>Light</button>
                <button onClick={() => setTheme('dark')} className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${theme === 'dark' ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>Dark</button>
                <button onClick={() => setTheme('system')} className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${theme === 'system' ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>System</button>
              </div>
            </div>
          </div>
        </section>

        {/* Notifications & App Section */}
        <section>
          <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 px-2">App & Notifications</h2>
          <div className="bg-card border rounded-2xl overflow-hidden divide-y">
            <div className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-medium">Push Notifications</p>
                  <p className="text-xs text-muted-foreground">Receive timer alerts and reminders</p>
                </div>
              </div>
              <Switch checked={notificationsEnabled} onCheckedChange={handleNotificationToggle} />
            </div>

            {!isStandalone && deferredPrompt && (
              <button onClick={handleInstallApp} className="w-full flex items-center justify-between p-4 hover:bg-muted/30 transition-colors text-left">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                    <Download className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-medium">Install App</p>
                    <p className="text-xs text-muted-foreground">Add to Home Screen for fast access</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </button>
            )}
          </div>
        </section>

        {/* Storage & Privacy */}
        <section>
          <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 px-2">Storage & Privacy</h2>
          <div className="bg-card border rounded-2xl overflow-hidden divide-y">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-medium">Privacy Status</p>
                  <p className="text-xs text-muted-foreground">All data is processed locally</p>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">Secure</span>
            </div>

            <button onClick={handleClearCache} className="w-full flex items-center justify-between p-4 hover:bg-red-50/50 transition-colors text-left group">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center text-red-600">
                  <Trash2 className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-medium text-red-600">Clear App Cache</p>
                  <p className="text-xs text-muted-foreground">Frees up storage and reloads app</p>
                </div>
              </div>
            </button>
          </div>
        </section>

        <div className="text-center pt-8">
          <p className="text-xs text-muted-foreground">Toolisiya PWA v1.0.0</p>
        </div>
      </div>
    </div>
  );
};

export default PwaSettingsPage;
