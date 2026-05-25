import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Wrench, Star, ArrowRight, Zap, Sparkles, TrendingUp } from 'lucide-react';
import { useActiveTools } from '@/contexts/ActiveToolsContext.jsx';
import { useAppUsage } from '@/contexts/AppUsageContext.jsx';

const ToolCard = ({ tool, index = 0 }) => {
  const { activeUrls, isLoading } = useActiveTools();
  const { addRecentTool, toggleFavorite, isFavorite } = useAppUsage();

  if (!tool) return null;

  const Icon = tool.icon || Wrench;
  const name = tool.name || tool.title || 'Unknown Tool';
  const description = tool.description || 'No description available';
  
  let path = tool.path || '#';
  if (path === '#' && !tool.isComingSoon && tool.id) {
     const categorySlug = tool.category ? tool.category.toLowerCase().replace(/\s+/g, '-') : 'utilities';
     path = `/${categorySlug}/${tool.id}`;
  }
  
  // Hide tool if it is not in the activeUrls set, UNLESS it's explicitly marked as coming soon
  if (!isLoading && !tool.isComingSoon && path !== '#' && !activeUrls.has(path)) {
    return null;
  }
  
  const isComingSoon = path === '#' || tool.isComingSoon;

  const handleCardClick = () => {
    if (!isComingSoon) {
      addRecentTool(tool);
    }
  };

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(tool);
  };

  const isFav = isFavorite(path);

  // Derive badges based on tool properties or category
  const isAI = tool.category === 'AI Tools' || name.toLowerCase().includes('generator') || name.toLowerCase().includes('remover');
  const isTrending = tool.show_in_menu || index < 4;
  const isFast = tool.category === 'Image Tools' || tool.category === 'Converters';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 * index }}
      className={isComingSoon ? 'opacity-60' : ''}
    >
      <Link to={path} className={isComingSoon ? "cursor-default pointer-events-none block h-full" : "block h-full"} onClick={handleCardClick}>
        <Card className={`h-full transition-all duration-300 group relative overflow-hidden flex flex-col justify-between ${isComingSoon ? 'bg-muted/50' : 'hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 cursor-pointer bg-card border-border/60 hover:border-primary/30'}`}>
          {!isComingSoon && (
            <button 
              onClick={handleFavoriteClick}
              className={`absolute top-4 right-4 p-2 rounded-full z-20 transition-all duration-200 ${isFav ? 'bg-amber-100 text-amber-500 hover:bg-amber-200' : 'bg-muted/50 text-muted-foreground hover:bg-muted opacity-0 group-hover:opacity-100'}`}
              aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
            >
              <Star className={`h-4 w-4 ${isFav ? 'fill-current' : ''}`} />
            </button>
          )}
          
          <CardHeader className="flex-1 pb-4 relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-blue-500/10 flex items-center justify-center shadow-inner border border-primary/10 group-hover:scale-110 transition-transform duration-300">
                <Icon className="h-6 w-6 text-primary" />
              </div>
              
              <div className="flex gap-1.5 pr-8">
                {isComingSoon && <span className="text-[10px] font-bold px-2 py-1 bg-muted rounded-full text-muted-foreground uppercase tracking-wider">Coming Soon</span>}
                {!isComingSoon && isAI && <span className="text-[10px] font-bold px-2 py-1 bg-purple-100 text-purple-700 rounded-full flex items-center gap-1 uppercase tracking-wider"><Sparkles className="w-3 h-3"/> AI</span>}
                {!isComingSoon && !isAI && isTrending && <span className="text-[10px] font-bold px-2 py-1 bg-orange-100 text-orange-700 rounded-full flex items-center gap-1 uppercase tracking-wider"><TrendingUp className="w-3 h-3"/> Hot</span>}
                {!isComingSoon && !isAI && !isTrending && isFast && <span className="text-[10px] font-bold px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full flex items-center gap-1 uppercase tracking-wider"><Zap className="w-3 h-3"/> Fast</span>}
              </div>
            </div>
            
            <CardTitle className="text-xl mb-2 group-hover:text-primary transition-colors line-clamp-1">
              {name}
            </CardTitle>
            <CardDescription className="leading-relaxed line-clamp-2">
              {description}
            </CardDescription>
          </CardHeader>

          {!isComingSoon && (
            <div className="px-6 pb-5 pt-2 flex items-center text-sm font-semibold text-primary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 relative z-10">
              Launch Tool <ArrowRight className="w-4 h-4 ml-1.5" />
            </div>
          )}
          
          {/* Subtle background glow effect on hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
        </Card>
      </Link>
    </motion.div>
  );
};

export default ToolCard;