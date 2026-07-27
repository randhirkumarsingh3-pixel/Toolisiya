import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Home, Search, LayoutGrid, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SearchBar from '@/components/SearchBar.jsx';

const NotFoundPage = () => {
  const popularCategories = [
    { name: 'Developer Tools', path: '/developer' },
    { name: 'Document Tools', path: '/document' },
    { name: 'PDF Tools', path: '/pdf' },
    { name: 'Finance Tools', path: '/finance' },
    { name: 'Image Tools', path: '/image' },
    { name: 'Career Tools', path: '/career' },
  ];

  return (
    <div className="min-h-screen flex flex-col font-sans bg-background">
      <Helmet>
        <title>404 - Page Not Found | Toolisiya</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <main className="flex-1 flex flex-col items-center justify-center py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl w-full text-center space-y-8">
          {/* 404 Graphic */}
          <div className="relative inline-block">
            <h1 className="text-[120px] md:text-[180px] font-extrabold text-primary/10 leading-none tracking-tighter select-none">
              404
            </h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight bg-background/80 px-4 py-2 rounded-xl backdrop-blur-sm">
                Page Not Found
              </h2>
            </div>
          </div>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
            Oops! The tool or page you are looking for doesn't exist, has been moved, or is temporarily unavailable.
          </p>

          {/* Search Section */}
          <div className="max-w-xl mx-auto w-full relative z-40 mt-8 mb-12">
            <p className="text-sm font-medium text-muted-foreground mb-3 text-left">Try searching for a tool:</p>
            <SearchBar />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="w-full sm:w-auto h-12 px-8 font-semibold">
              <Link to="/">
                <Home className="mr-2 h-5 w-5" />
                Return to Homepage
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto h-12 px-8 font-semibold">
              <Link to="/browse-categories">
                <LayoutGrid className="mr-2 h-5 w-5" />
                Browse All Tools
              </Link>
            </Button>
          </div>

          {/* Popular Categories */}
          <div className="pt-16 mt-8 border-t border-border/50">
            <h3 className="text-lg font-semibold mb-6">Popular Categories</h3>
            <div className="flex flex-wrap justify-center gap-3">
              {popularCategories.map((cat) => (
                <Link 
                  key={cat.path} 
                  to={cat.path}
                  className="inline-flex items-center px-4 py-2 rounded-full bg-muted hover:bg-muted/80 text-sm font-medium transition-colors"
                >
                  {cat.name}
                  <ArrowRight className="ml-2 h-3 w-3 opacity-50" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NotFoundPage;