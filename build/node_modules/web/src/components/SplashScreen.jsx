import React from 'react';
import { motion } from 'framer-motion';

const LOGO_URL = "/logo-transparent.png";

export default function SplashScreen() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background">
      <div className="flex items-center justify-center bg-white rounded-full shadow-lg border border-border/10 p-4 w-32 h-32 md:w-40 md:h-40 relative">
        <motion.img 
          src={LOGO_URL} 
          alt="Toolisiya Loading..." 
          className="w-20 h-20 md:w-28 md:h-28 object-contain"
          animate={{ rotate: 360 }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>
      <motion.h1 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8 text-2xl md:text-3xl font-extrabold tracking-tight text-foreground"
      >
        Toolisiya
      </motion.h1>
    </div>
  );
}