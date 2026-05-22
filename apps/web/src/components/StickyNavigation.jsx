import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const StickyNavigation = ({ global = false }) => {
  const navigate = useNavigate();

  if (!global) return null;

  return (
    <div className="relative w-full bg-card/40 border-b border-border/80 px-4 py-3 flex justify-between items-center mb-4 transition-all duration-200">
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => navigate('/')} 
        className="h-9 w-9 sm:h-10 sm:w-10 rounded-full hover:bg-primary/10 text-primary transition-all duration-200 hover:scale-105 active:scale-95" 
        aria-label="Home"
      >
        <Home className="h-5 w-5 sm:h-6 sm:w-6" />
      </Button>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={() => navigate(-1)} 
        className="h-9 w-9 sm:h-10 sm:w-10 rounded-full hover:bg-primary/10 text-primary transition-all duration-200 hover:scale-105 active:scale-95" 
        aria-label="Go Back"
      >
        <ArrowLeft className="h-5 w-5 sm:h-6 sm:w-6" />
      </Button>
    </div>
  );
};

export default StickyNavigation;