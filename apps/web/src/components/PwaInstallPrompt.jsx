import React, { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { usePWAInstall } from '@/hooks/usePWAInstall';

const PwaInstallPrompt = () => {
  const { isInstallable, isInstalled, install } = usePWAInstall();
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Only show if the app is installable and not already installed, and hasn't been dismissed
    const dismissed = localStorage.getItem('pwa_prompt_dismissed') === 'true';
    if (isInstallable && !isInstalled && !dismissed) {
      const timer = setTimeout(() => setShowPrompt(true), 5000);
      return () => clearTimeout(timer);
    }
  }, [isInstallable, isInstalled]);

  const handleInstallClick = () => {
    install();
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa_prompt_dismissed', 'true');
  };

  if (isInstalled) return null;

  return (
    <AnimatePresence>
      {showPrompt && isInstallable && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50, transition: { duration: 0.2 } }}
          className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-50 flex items-center gap-3 bg-card border shadow-xl p-3 md:p-4 rounded-2xl max-w-[320px]"
        >
          <div className="flex-shrink-0 w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
            <img src="/logo-transparent.png" alt="Icon" className="w-8 h-8 object-contain" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-foreground truncate">Install Toolisiya App</p>
            <p className="text-xs text-muted-foreground line-clamp-2">Get fast access and offline support.</p>
          </div>
          <div className="flex flex-col gap-1 shrink-0">
             <Button size="sm" onClick={handleInstallClick} className="h-7 text-xs px-3 font-semibold rounded-lg">
               Install
             </Button>
             <Button size="sm" variant="ghost" onClick={handleDismiss} className="h-6 w-full text-[10px] text-muted-foreground hover:bg-transparent px-0">
               Not now
             </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PwaInstallPrompt;

