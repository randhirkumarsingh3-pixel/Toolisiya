import React from 'react';
import { Helmet } from 'react-helmet';
import { 
  Download, 
  Smartphone, 
  Monitor, 
  Share, 
  PlusSquare, 
  MoreVertical, 
  Info, 
  CheckCircle2, 
  ShieldCheck, 
  Zap, 
  AppWindow 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePWAInstall } from '@/hooks/usePWAInstall';

export default function PwaDownloadPage() {
  const { isInstalled, install } = usePWAInstall();

  return (
    <div className="min-h-screen bg-muted/20 relative overflow-x-hidden w-full font-sans transition-colors duration-300 pb-20">
      <Helmet>
        <title>Download Toolisiya App - Install PWA for Android, iOS & Desktop</title>
        <meta name="description" content="Install Toolisiya App on your Android, iOS, or Desktop device. Get 1-click access, full-screen offline support, and native performance." />
      </Helmet>

      {/* Dynamic Background Mesh */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[40%] -left-[10%] w-[70%] h-[70%] rounded-full bg-primary/5 blur-[120px] mix-blend-normal"></div>
        <div className="absolute top-[20%] -right-[20%] w-[60%] h-[60%] rounded-full bg-emerald-500/5 blur-[120px] mix-blend-normal"></div>
      </div>

      <div className="container mx-auto px-4 max-w-4xl pt-12 md:pt-16 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-card/80 border border-border mb-6 backdrop-blur-sm text-xs font-semibold text-foreground shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Official Toolisiya App
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4 text-foreground">
            Download Toolisiya App
          </h1>
          <p className="text-muted-foreground text-base md:text-lg font-medium">
            Get lightning-fast access, offline capability, and native full-screen performance. Installing takes less than a second and consumes under 1MB of space.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Action Card */}
          <div className="md:col-span-7 bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col justify-between h-full relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-primary/10 blur-[80px] rounded-full pointer-events-none"></div>
            
            <div className="relative z-10 flex-1">
              <h2 className="text-2xl font-bold mb-6 text-foreground flex items-center gap-2">
                <AppWindow className="w-6 h-6 text-primary" /> Application Installer
              </h2>

              {isInstalled ? (
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 mb-8 text-center">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-600 mx-auto mb-4">
                    <CheckCircle2 className="w-6 h-6 animate-pulse" />
                  </div>
                  <h3 className="text-lg font-bold text-emerald-600 mb-1">Toolisiya Installed Successfully</h3>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                    The app is active and running in standalone display mode. You can launch it directly from your device's home screen or app drawer.
                  </p>
                </div>
              ) : (
                <div className="space-y-6 mb-8">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Toolisiya is a Progressive Web App (PWA). Instead of visiting bloated app stores, you can download it directly in one click using your browser.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button 
                      onClick={install} 
                      size="lg" 
                      className="h-14 px-8 text-base font-bold rounded-xl shadow-lg bg-emerald-600 hover:bg-emerald-700 text-white gap-2 flex-1 transform active:scale-95 transition-all duration-200"
                    >
                      <Download className="w-5 h-5 animate-bounce" /> Install App Now
                    </Button>
                  </div>
                </div>
              )}

              {/* Benefits list */}
              <div className="border-t border-border pt-6 space-y-4">
                <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Why Install Toolisiya?</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <Zap className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="text-sm font-semibold text-foreground">Zero Bloat</h5>
                      <p className="text-xs text-muted-foreground">Uses less than 1MB of space.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="text-sm font-semibold text-foreground">Offline Support</h5>
                      <p className="text-xs text-muted-foreground">Access core tools without internet.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="text-sm font-semibold text-foreground">Full-Screen Mode</h5>
                      <p className="text-xs text-muted-foreground">standalone experience with no URL bar.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <Smartphone className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="text-sm font-semibold text-foreground">Instant Launch</h5>
                      <p className="text-xs text-muted-foreground">Home screen shortcut icon.</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Platform Guide Card */}
          <div className="md:col-span-5 bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-xl">
            <h3 className="text-lg font-bold mb-4 text-foreground flex items-center gap-2">
              <Info className="w-5 h-5 text-primary" /> Platform Instructions
            </h3>
            <p className="text-xs text-muted-foreground mb-6">
              If the download button above doesn't trigger the prompt on your browser, follow these platform-specific steps:
            </p>

            <Tabs defaultValue="android" className="w-full">
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
                <div className="bg-muted/30 border rounded-2xl p-4 text-sm text-foreground">
                  <p className="font-bold flex items-center gap-2 mb-2 text-xs">
                    <Info className="w-3.5 h-3.5 text-primary" /> Install via Chrome:
                  </p>
                  <ol className="list-decimal pl-5 space-y-2 text-xs text-muted-foreground font-medium">
                    <li>Tap Chrome's options icon (<MoreVertical className="inline w-3 h-3 text-foreground" />) in the top-right.</li>
                    <li>Tap <strong className="text-foreground">"Install app"</strong> or <strong className="text-foreground">"Add to Home Screen"</strong>.</li>
                    <li>Confirm by clicking <strong className="text-foreground">"Install"</strong>.</li>
                  </ol>
                </div>
              </TabsContent>

              <TabsContent value="ios" className="space-y-4 pt-4">
                <div className="bg-muted/30 border rounded-2xl p-4 text-sm text-foreground">
                  <p className="font-bold flex items-center gap-2 mb-2 text-xs">
                    <Info className="w-3.5 h-3.5 text-primary" /> Install via Safari:
                  </p>
                  <ol className="list-decimal pl-5 space-y-2 text-xs text-muted-foreground font-medium">
                    <li>Tap the Safari <strong className="text-foreground">Share</strong> icon (<Share className="inline w-3 h-3 text-foreground" />) at the bottom.</li>
                    <li>Scroll down and tap <strong className="text-foreground">"Add to Home Screen"</strong> (<PlusSquare className="inline w-3 h-3 text-foreground" />).</li>
                    <li>Tap <strong className="text-foreground">"Add"</strong> in the top-right corner to complete.</li>
                  </ol>
                </div>
              </TabsContent>

              <TabsContent value="desktop" className="space-y-4 pt-4">
                <div className="bg-muted/30 border rounded-2xl p-4 text-sm text-foreground">
                  <p className="font-bold flex items-center gap-2 mb-2 text-xs">
                    <Info className="w-3.5 h-3.5 text-primary" /> Install via Browser:
                  </p>
                  <ol className="list-decimal pl-5 space-y-2 text-xs text-muted-foreground font-medium">
                    <li>Look for the <strong className="text-foreground">Install Icon</strong> (monitor with down arrow, or "+" symbol) in your browser's top URL address bar.</li>
                    <li>Click it and click <strong className="text-foreground">"Install"</strong>.</li>
                    <li>Or, open the browser's menu and select <strong className="text-foreground">"Install Toolisiya"</strong>.</li>
                  </ol>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
