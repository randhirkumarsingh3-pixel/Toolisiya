import React, { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { usePWAInstall } from '@/hooks/usePWAInstall';

const PwaInstallPrompt = () => {
  const { isInstalled, install } = usePWAInstall();
  const [showPrompt, setShowPrompt] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // No automatic prompt popups anymore as per user request
  }, [isInstalled]);

  if (isInstalled) return null;

  return (
    <AnimatePresence>
      {!isInstalled && (
        <motion.button
          key="pwa-fab"
          onClick={install}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
          className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-50 flex items-center justify-center w-12 h-12 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg border border-emerald-500/20 cursor-pointer"
          title="Download Toolisiya App"
        >
          <Download className="w-5 h-5 text-white animate-pulse" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default PwaInstallPrompt;


