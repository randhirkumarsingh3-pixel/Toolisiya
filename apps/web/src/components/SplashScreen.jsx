import React from 'react';
import { motion } from 'framer-motion';

const LOGO_URL = "https://horizons-cdn.hostinger.com/bdd6546f-fbd6-4325-a50e-17d2da2d4211/cee60d0209af8e0fbb7ee09e30a392b9.png";

export default function SplashScreen() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear"
        }}
        className="w-32 h-32 md:w-40 md:h-40"
      >
        <img 
          src={LOGO_URL} 
          alt="Toolisiya Loading..." 
          className="w-full h-full object-contain drop-shadow-lg"
        />
      </motion.div>
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