import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Flame, Clock, TrendingUp } from 'lucide-react';
import DynamicIcon from '@/components/DynamicIcon.jsx';
import { Card, CardContent } from '@/components/ui/card';

export default function TrendingToolsSection({ tools }) {
  if (!tools || tools.length === 0) return null;

  // Split into Trending and Recently Updated for UI variety
  const trending = tools.slice(0, 4);
  const recentlyUpdated = tools.slice(4, 8);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <section className="py-24 bg-background relative z-10 border-b border-border">
      <div className="container mx-auto max-w-7xl px-4">
        
        {/* Popular Searches Quick Links */}
        <div className="mb-16 text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">Popular Searches</p>
          <div className="flex flex-wrap justify-center gap-3">
            {['PDF Editor', 'GST Calculator', 'Image Compressor', 'Invoice Generator', 'Resume Builder', 'OCR Scanner'].map((search) => (
              <span key={search} className="px-4 py-2 rounded-full bg-muted text-foreground text-sm font-medium border border-border/50 hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-colors cursor-pointer shadow-sm">
                <TrendingUp className="w-3 h-3 inline-block mr-2" />
                {search}
              </span>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Trending Now */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2.5 bg-orange-500/10 rounded-xl">
                <Flame className="w-6 h-6 text-orange-500" />
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-foreground">Trending Now</h2>
            </div>
            
            <motion.div 
              variants={containerVariants} initial="hidden" whileInView="show" viewport={{ once: true }}
              className="grid sm:grid-cols-2 gap-4"
            >
              {trending.map((tool) => (
                <motion.div key={tool.id} variants={itemVariants}>
                  <Link to={tool.path} className="block group">
                    <Card className="h-full border border-border bg-card shadow-sm hover:shadow-md hover:border-orange-500/30 transition-all rounded-2xl">
                      <CardContent className="p-5 flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-muted group-hover:bg-orange-500/10 group-hover:text-orange-600 transition-colors">
                          <DynamicIcon name={tool.iconName} className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">{tool.name}</h3>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{tool.description}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Recently Updated */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2.5 bg-emerald-500/10 rounded-xl">
                <Clock className="w-6 h-6 text-emerald-500" />
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-foreground">Recently Updated</h2>
            </div>
            
            <motion.div 
              variants={containerVariants} initial="hidden" whileInView="show" viewport={{ once: true }}
              className="grid sm:grid-cols-2 gap-4"
            >
              {recentlyUpdated.map((tool) => (
                <motion.div key={tool.id} variants={itemVariants}>
                  <Link to={tool.path} className="block group">
                    <Card className="h-full border border-border bg-card shadow-sm hover:shadow-md hover:border-emerald-500/30 transition-all rounded-2xl">
                      <CardContent className="p-5 flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-muted group-hover:bg-emerald-500/10 group-hover:text-emerald-600 transition-colors">
                          <DynamicIcon name={tool.iconName} className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">{tool.name}</h3>
                          <p className="text-xs text-emerald-600 font-medium mt-1">Updated this week</p>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

      </div>
    </section>
  );
}
