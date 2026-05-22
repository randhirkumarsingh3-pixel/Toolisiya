import React, { createContext, useState, useEffect, useContext } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Share, 
  PlusSquare, 
  MoreVertical, 
  Download, 
  Monitor, 
  Smartphone, 
  Info, 
  CheckCircle2 
} from 'lucide-react';

const PwaContext = createContext(null);

export function PwaProvider({ children }) {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [platform, setPlatform] = useState('desktop');

  const checkStandalone = () => {
    return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
  };

  const detectPlatform = () => {
    const ua = navigator.userAgent || navigator.vendor || window.opera;
    if (/iPad|iPhone|iPod/.test(ua) && !window.MSStream) {
      return 'ios';
    }
    if (/android/i.test(ua)) {
      return 'android';
    }
    return 'desktop';
  };

  useEffect(() => {
    setIsInstalled(checkStandalone());
    setPlatform(detectPlatform());

    const handleBeforeInstall = (e) => {
      // Prevent the mini-infobar on mobile
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
      console.log('Toolisiya app was installed successfully.');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Periodic check for standalone mode in case user opens from home screen
    const interval = setInterval(() => {
      setIsInstalled(checkStandalone());
    }, 2000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
      clearInterval(interval);
    };
  }, []);

  const install = async () => {
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          setIsInstalled(true);
          setIsInstallable(false);
        }
      } catch (err) {
        console.error('PWA installation prompt failed:', err);
      } finally {
        setDeferredPrompt(null);
      }
    } else {
      setShowInstructions(true);
    }
  };

  return (
    <PwaContext.Provider value={{ isInstallable, isInstalled, install, showInstructions, setShowInstructions, platform }}>
      {children}
      <PwaInstallDialog open={showInstructions} onOpenChange={setShowInstructions} defaultPlatform={platform} />
    </PwaContext.Provider>
  );
}

export function usePwa() {
  const context = useContext(PwaContext);
  if (!context) {
    throw new Error('usePwa must be used within a PwaProvider');
  }
  return context;
}

function PwaInstallDialog({ open, onOpenChange, defaultPlatform }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90vw] sm:max-w-md rounded-2xl p-6 bg-card border border-border shadow-2xl">
        <DialogHeader className="text-left">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold text-foreground">Install Toolisiya App</DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Get one-click access and offline support directly on your device.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue={defaultPlatform} className="w-full mt-2">
          <TabsList className="grid w-full grid-cols-3 bg-muted rounded-lg p-1">
            <TabsTrigger value="android" className="text-xs font-semibold py-1.5 flex items-center gap-1">
              <Smartphone className="w-3.5 h-3.5" /> Android
            </TabsTrigger>
            <TabsTrigger value="ios" className="text-xs font-semibold py-1.5 flex items-center gap-1">
              <Smartphone className="w-3.5 h-3.5" /> iOS
            </TabsTrigger>
            <TabsTrigger value="desktop" className="text-xs font-semibold py-1.5 flex items-center gap-1">
              <Monitor className="w-3.5 h-3.5" /> Desktop
            </TabsTrigger>
          </TabsList>

          <TabsContent value="android" className="space-y-4 pt-4">
            <div className="bg-muted/40 border rounded-xl p-4 text-sm text-foreground">
              <p className="font-bold flex items-center gap-2 mb-2">
                <Info className="w-4 h-4 text-primary" /> Install via Chrome:
              </p>
              <ol className="list-decimal pl-5 space-y-2 text-xs text-muted-foreground font-medium">
                <li>Tap the three vertical dots (<MoreVertical className="inline w-3.5 h-3.5 text-foreground" />) in Chrome's top-right corner.</li>
                <li>Tap <strong className="text-foreground">"Install app"</strong> or <strong className="text-foreground">"Add to Home Screen"</strong> from the menu list.</li>
                <li>Confirm by clicking <strong className="text-foreground">"Install"</strong> when prompted.</li>
              </ol>
            </div>
          </TabsContent>

          <TabsContent value="ios" className="space-y-4 pt-4">
            <div className="bg-muted/40 border rounded-xl p-4 text-sm text-foreground">
              <p className="font-bold flex items-center gap-2 mb-2">
                <Info className="w-4 h-4 text-primary" /> Install via Safari:
              </p>
              <ol className="list-decimal pl-5 space-y-2 text-xs text-muted-foreground font-medium">
                <li>Tap the <strong className="text-foreground">Share</strong> icon (<Share className="inline w-3.5 h-3.5 text-foreground" />) at the bottom of Safari.</li>
                <li>Scroll down the options list and tap <strong className="text-foreground">"Add to Home Screen"</strong> (<PlusSquare className="inline w-3.5 h-3.5 text-foreground" />).</li>
                <li>Tap <strong className="text-foreground">"Add"</strong> in the top-right corner to place it on your home screen.</li>
              </ol>
            </div>
          </TabsContent>

          <TabsContent value="desktop" className="space-y-4 pt-4">
            <div className="bg-muted/40 border rounded-xl p-4 text-sm text-foreground">
              <p className="font-bold flex items-center gap-2 mb-2">
                <Info className="w-4 h-4 text-primary" /> Install via Chrome/Edge/Safari:
              </p>
              <ol className="list-decimal pl-5 space-y-2 text-xs text-muted-foreground font-medium">
                <li>Look at the browser's address bar for an <strong className="text-foreground">Install icon</strong> (a screen with a down arrow, or a plus icon).</li>
                <li>Click it and choose <strong className="text-foreground">"Install"</strong>.</li>
                <li>Alternatively, open the browser's three-dot menu and select <strong className="text-foreground">"Install Toolisiya"</strong>.</li>
              </ol>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-3 mt-4 border-t pt-4">
          <button 
            onClick={() => onOpenChange(false)}
            className="px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-xl text-xs shadow hover:bg-primary/95 transition-all w-full sm:w-auto"
          >
            Got it
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
