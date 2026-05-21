import React, { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

const PwaInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      // Update UI notify the user they can install the PWA
      // We wait a few seconds before showing so it's not too aggressive
      setTimeout(() => setShowPrompt(true), 5000);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // If app is already installed
    window.addEventListener('appinstalled', () => {
      setShowPrompt(false);
      setDeferredPrompt(null);
      console.log('PWA was installed');
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);
    
    // We've used the prompt, and can't use it again, throw it away
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Could save to localStorage here so we don't bother them again for a while
  };

  return (
    <AnimatePresence>
      {showPrompt && deferredPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50, transition: { duration: 0.2 } }}
          className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-50 flex items-center gap-3 bg-card border shadow-xl p-3 md:p-4 rounded-2xl max-w-[320px]"
        >
          <div className="flex-shrink-0 w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
            <img src="https://horizons-cdn.hostinger.com/bdd6546f-fbd6-4325-a50e-17d2da2d4211/cee60d0209af8e0fbb7ee09e30a392b9.png" alt="Icon" className="w-8 h-8 object-contain" />
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
