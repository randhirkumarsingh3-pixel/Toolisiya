import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { ChevronRight, Calendar, Clock, BookOpen, Search, GraduationCap, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { blogPosts } from '@/data/blogPosts.js';
import BreadcrumbNavigation from '@/components/BreadcrumbNavigation.jsx';

// Map blog categories to Academies
const ACADEMIES = [
  { id: 'all', name: 'Latest Updates', match: () => true },
  { id: 'pdf', name: 'PDF Academy', match: (cat) => cat.toLowerCase().includes('pdf') },
  { id: 'finance', name: 'Finance Academy', match: (cat) => cat.toLowerCase().includes('finance') || cat.toLowerCase().includes('money') },
  { id: 'image', name: 'Image Editing Academy', match: (cat) => cat.toLowerCase().includes('image') || cat.toLowerCase().includes('photo') },
  { id: 'productivity', name: 'Productivity Academy', match: (cat) => cat.toLowerCase().includes('productivity') },
  { id: 'career', name: 'Career Guides', match: (cat) => cat.toLowerCase().includes('career') || cat.toLowerCase().includes('resume') },
  { id: 'developer', name: 'Developer Guides', match: (cat) => cat.toLowerCase().includes('developer') || cat.toLowerCase().includes('tech') },
];

export default function BlogListPage() {
  const [selectedAcademy, setSelectedAcademy] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const activeAcademy = ACADEMIES.find(a => a.id === selectedAcademy);
  
  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAcademy = activeAcademy.match(post.category);
    return matchesSearch && matchesAcademy;
  });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Helmet>
        <title>Learning Center | Toolisiya Knowledge Hub</title>
        <meta name="description" content="Master your workflows with our complete tutorials, deep-dive guides, and professional productivity breakdowns across our specialized Academies." />
      </Helmet>

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <BreadcrumbNavigation customTitle="Learning Center" />
          
          <div className="mt-8 flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
            <div className="flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-6">
              <GraduationCap className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-4">
              The Learning Center
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl leading-relaxed mb-8">
              Master your workflows with our complete tutorials, deep-dive guides, and professional productivity breakdowns.
            </p>
            
            {/* Search Bar */}
            <div className="relative w-full max-w-lg mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search guides, tutorials, and workflows..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-full border border-border bg-card shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground transition-all"
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
            {/* Sidebar Academies */}
            <div className="w-full md:w-64 shrink-0 space-y-2">
              <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-4 pl-4">Academies</h3>
              <nav className="flex flex-row md:flex-col overflow-x-auto md:overflow-visible gap-2 pb-4 md:pb-0 hide-scrollbar">
                {ACADEMIES.map(academy => (
                  <button
                    key={academy.id}
                    onClick={() => setSelectedAcademy(academy.id)}
                    className={`whitespace-nowrap text-left px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      selectedAcademy === academy.id
                        ? 'bg-primary text-primary-foreground shadow-md'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    {academy.name}
                  </button>
                ))}
              </nav>
            </div>

            {/* Content Area */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
                  {searchQuery ? 'Search Results' : activeAcademy.name}
                </h2>
                <span className="text-sm font-medium bg-muted text-muted-foreground px-3 py-1 rounded-full">
                  {filteredPosts.length} Guides
                </span>
              </div>

              {filteredPosts.length === 0 ? (
                <div className="text-center py-20 bg-muted/30 border border-border rounded-3xl border-dashed">
                  <BookOpen className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-foreground mb-2">No guides found</h3>
                  <p className="text-muted-foreground">Try adjusting your search terms or exploring a different Academy.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filteredPosts.map(post => (
                    <Link key={post.id} to={`/blog/${post.slug}`} className="block group">
                      <Card className="h-full border border-border bg-card shadow-sm hover:shadow-md hover:border-primary/30 transition-all rounded-2xl overflow-hidden flex flex-col">
                        {post.coverImage && (
                          <div className="h-48 overflow-hidden bg-muted relative">
                            <img 
                              src={post.coverImage} 
                              alt={post.title} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                              loading="lazy"
                            />
                            <div className="absolute top-4 left-4">
                              <span className="bg-background/90 backdrop-blur-sm text-foreground text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                                {post.category}
                              </span>
                            </div>
                          </div>
                        )}
                        <CardContent className="p-6 flex-1 flex flex-col justify-between">
                          <div className="space-y-3">
                            <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground">
                              <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {post.date}</span>
                              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {post.readTime}</span>
                            </div>
                            <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors leading-tight">
                              {post.title}
                            </h3>
                            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                              {post.description}
                            </p>
                          </div>
                          
                          <div className="mt-6 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                                {post.author.charAt(0)}
                              </div>
                              <span className="text-sm font-medium text-muted-foreground">{post.author}</span>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-muted group-hover:bg-primary group-hover:text-primary-foreground flex items-center justify-center transition-colors">
                              <ArrowRight className="w-4 h-4" />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
}
