import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight, BookOpen } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { blogPosts } from '../data/blogPosts';

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#09090b] py-12">
      <Helmet>
        <title>Blog & Resources - Toolisiya</title>
        <meta name="description" content="Read the latest articles, tutorials, and guides on web performance, document management, and developer tools from the Toolisiya team." />
      </Helmet>
      
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 bg-primary/10 text-primary border-primary/20 px-3 py-1 text-sm font-medium">
            <BookOpen className="w-4 h-4 mr-2 inline-block" />
            Resources
          </Badge>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-4">
            Toolisiya <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">Blog</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Insights, tutorials, and deep dives into productivity, web performance, and digital tools.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <Link key={post.slug} to={`/blog/${post.slug}`} className="group h-full">
              <Card className="h-full border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col">
                <CardContent className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center gap-2 mb-4">
                    <Badge variant="secondary" className="bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground text-xs font-semibold">
                      {post.category}
                    </Badge>
                    <span className="text-xs text-muted-foreground flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                  
                  <p className="text-gray-600 dark:text-gray-400 mb-6 line-clamp-3 text-sm flex-grow">
                    {post.description}
                  </p>
                  
                  <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                    <div className="flex items-center text-xs text-muted-foreground">
                      <User className="w-3 h-3 mr-1" />
                      {post.author}
                    </div>
                    <span className="text-sm font-semibold text-primary flex items-center group-hover:underline">
                      Read Article <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
