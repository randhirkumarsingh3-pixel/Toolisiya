import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { ChevronRight, Calendar, User, Clock, BookOpen } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { blogPosts } from '@/data/blogPosts.js';
import BreadcrumbNavigation from '@/components/BreadcrumbNavigation.jsx';

export default function BlogListPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const categories = ['All', ...new Set(blogPosts.map(p => p.category))];
  
  const filteredPosts = selectedCategory === 'All' 
    ? blogPosts 
    : blogPosts.filter(p => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Helmet>
        <title>Guides & Tutorials | Toolisiya Learning Hub</title>
        <meta name="description" content="Discover professional how-to guides, file format comparisons, and developer utility tutorials to streamline your daily workflows." />
      </Helmet>

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-5xl">
          <BreadcrumbNavigation customTitle="Learning Hub" />
          
          <div className="mt-8 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b pb-8 border-border/60">
            <div>
              <div className="flex items-center gap-2 text-primary font-semibold mb-2">
                <BookOpen className="w-5 h-5" /> Learning Hub
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Guides & Tutorials</h1>
              <p className="text-muted-foreground mt-2 text-lg">Master your workflows with our quick productivity tips and document hacks.</p>
            </div>

            {/* Category Filter Badges */}
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                    selectedCategory === cat
                      ? 'bg-primary text-primary-foreground border-primary shadow-md'
                      : 'bg-card hover:bg-muted text-muted-foreground border-border'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Blog Post Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            {filteredPosts.map(post => (
              <Link key={post.id} to={`/blog/${post.slug}`} className="block group">
                <Card className="h-full border border-border bg-card shadow-sm hover:shadow-md hover:border-primary/30 transition-all rounded-2xl overflow-hidden flex flex-col">
                  {post.coverImage && (
                    <div className="h-48 overflow-hidden bg-muted relative">
                      <img 
                        src={post.coverImage} 
                        alt={post.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground font-semibold">
                        {post.category}
                      </Badge>
                    </div>
                  )}
                  <CardContent className="p-6 flex-1 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {post.date}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {post.readTime}</span>
                      </div>
                      <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors leading-tight">
                        {post.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                        {post.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 text-primary text-sm font-bold mt-6 group-hover:gap-2 transition-all">
                      Read Full Article <ChevronRight className="w-4 h-4" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
