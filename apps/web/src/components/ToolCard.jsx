import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Wrench, Star } from 'lucide-react';
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 * index }}
      className={isComingSoon ? 'opacity-60' : ''}
    >
      <Link to={path} className={isComingSoon ? "cursor-default pointer-events-none" : ""} onClick={handleCardClick}>
        <Card className={`h-full transition-all duration-200 group relative overflow-hidden ${isComingSoon ? 'bg-muted/50' : 'hover:shadow-lg hover:-translate-y-1 cursor-pointer bg-card'}`}>
          {!isComingSoon && (
            <button 
              onClick={handleFavoriteClick}
              className={`absolute top-4 right-4 p-2 rounded-full z-10 transition-colors ${isFav ? 'bg-amber-100 text-amber-500 hover:bg-amber-200' : 'bg-muted/50 text-muted-foreground hover:bg-muted opacity-0 group-hover:opacity-100'}`}
              aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
            >
              <Star className={`h-4 w-4 ${isFav ? 'fill-current' : ''}`} />
            </button>
          )}
          <CardHeader>
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
              <Icon className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-xl flex items-center justify-between pr-8">
              {name}
              {isComingSoon && <span className="text-xs font-normal px-2 py-1 bg-muted rounded text-muted-foreground ml-2 shrink-0">Coming Soon</span>}
            </CardTitle>
            <CardDescription className="leading-relaxed">
              {description}
            </CardDescription>
          </CardHeader>
        </Card>
      </Link>
    </motion.div>
  );
};

export default ToolCard;