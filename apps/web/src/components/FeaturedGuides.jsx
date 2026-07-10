import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Clock } from 'lucide-react';
import { blogPosts } from '@/data/blogPosts.js';
import { Button } from '@/components/ui/button';

export default function FeaturedGuides() {
  // Get latest 3 blog posts
  const guides = blogPosts.slice(0, 3);

  return (
    <section className="py-24 bg-muted/20 border-y border-border px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-16 text-center sm:text-left flex flex-col sm:flex-row justify-between items-end gap-6">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight text-foreground">Knowledge Center</h2>
            <p className="text-muted-foreground text-lg">Learn how to maximize your productivity with our expert guides.</p>
          </div>
          <Button asChild variant="outline" className="border-border hover:bg-muted text-foreground">
            <Link to="/blog">View All Guides <ArrowRight className="ml-2 w-4 h-4" /></Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {guides.map((post, i) => (
            <motion.div 
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group bg-card border border-border rounded-2xl overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="aspect-video bg-muted relative overflow-hidden">
                {post.coverImage ? (
                  <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary/5 text-primary">
                    <BookOpen className="w-12 h-12 opacity-50" />
                  </div>
                )}
                <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm px-3 py-1 text-xs font-bold rounded-full text-foreground border border-border">
                  {post.category}
                </div>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-xl font-bold text-foreground mb-3 leading-snug group-hover:text-primary transition-colors">
                  <Link to={`/blog/${post.slug}`}>
                    {post.title}
                  </Link>
                </h3>
                <p className="text-muted-foreground text-sm line-clamp-3 mb-6 flex-1">
                  {post.description}
                </p>
                <div className="flex items-center justify-between text-xs text-muted-foreground pt-4 border-t border-border">
                  <span className="font-medium text-foreground">{post.author}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.readTime}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
