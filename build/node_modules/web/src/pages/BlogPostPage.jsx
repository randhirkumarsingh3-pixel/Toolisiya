import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { ChevronLeft, Calendar, User, Clock, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getBlogPost } from '@/data/blogPosts.js';
import BreadcrumbNavigation from '@/components/BreadcrumbNavigation.jsx';
import NotFoundPage from './NotFoundPage.jsx';

export default function BlogPostPage() {
  const { slug } = useParams();
  const post = getBlogPost(slug);

  if (!post) {
    return <NotFoundPage />;
  }

  // Simple Markdown Parser to render basic styling dynamically
  const renderContent = (text) => {
    if (!text) return null;
    return text.split('\n').map((line, i) => {
      const trimmed = line.trim();
      if (!trimmed) return null;
      
      if (trimmed.startsWith('###')) {
        return <h3 key={i} className="text-xl font-bold mt-8 mb-4 text-foreground">{trimmed.replace(/^###\s*/, '')}</h3>;
      }
      if (trimmed.startsWith('##')) {
        return <h2 key={i} className="text-2xl font-bold mt-10 mb-6 text-foreground">{trimmed.replace(/^##\s*/, '')}</h2>;
      }
      if (trimmed.startsWith('-')) {
        return (
          <li key={i} className="ml-5 list-disc text-muted-foreground mb-2 leading-relaxed text-base">
            {trimmed.replace(/^-\s*/, '')}
          </li>
        );
      }
      const numMatch = trimmed.match(/^(\d+)\.\s(.*)/);
      if (numMatch) {
        return (
          <div key={i} className="ml-4 mb-4">
            <span className="font-bold text-primary mr-2">{numMatch[1]}.</span>
            <span className="text-muted-foreground leading-relaxed text-base">{numMatch[2]}</span>
          </div>
        );
      }
      return <p key={i} className="text-muted-foreground leading-relaxed mb-6 text-base md:text-lg">{trimmed}</p>;
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Helmet>
        <title>{post.title} | Toolisiya Learning Hub</title>
        <meta name="description" content={post.description} />
      </Helmet>

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <BreadcrumbNavigation customTitle={post.title} />
          
          <div className="mt-8">
            <Button asChild variant="ghost" className="mb-6 hover:bg-muted text-muted-foreground">
              <Link to="/blog"><ArrowLeft className="w-4 h-4 mr-2" /> Back to Guides</Link>
            </Button>
          </div>

          <article className="space-y-8">
            {/* Header */}
            <div className="space-y-4">
              <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full">
                {post.category}
              </span>
              <h1 className="text-3xl md:text-5xl font-black tracking-tight text-foreground leading-tight text-balance">
                {post.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground border-y py-4 border-border/60">
                <span className="flex items-center gap-2"><User className="w-4 h-4 text-primary" /> {post.author}</span>
                <span className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {post.date}</span>
                <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> {post.readTime}</span>
              </div>
            </div>

            {/* Cover Image */}
            {post.coverImage && (
              <div className="aspect-[21/9] rounded-3xl overflow-hidden bg-muted border border-border shadow-md">
                <img 
                  src={post.coverImage} 
                  alt={post.title} 
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Content */}
            <div className="prose prose-slate dark:prose-invert max-w-none py-4">
              {renderContent(post.content)}
            </div>
          </article>
        </div>
      </main>
    </div>
  );
}
