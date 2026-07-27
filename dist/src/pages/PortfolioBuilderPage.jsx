import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { ChevronRight, LayoutTemplate, Layers, Laptop } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import ToolContentDisplay from '@/components/ToolContentDisplay.jsx';
import { toolContent } from '@/data/toolContent.js';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const PortfolioBuilderPage = () => {
  const contentData = toolContent['portfolio-builder'];

  return (
    <>
      <Helmet>
        <title>{contentData.title} | Toolisiya</title>
        <meta name="description" content={contentData.introduction.substring(0, 150)} />
      </Helmet>
      
      <div className="min-h-screen flex flex-col bg-background">
        <main className="flex-1 py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            {/* Breadcrumbs */}
            <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
              <Link to="/" className="hover:text-foreground transition-smooth">Home</Link>
              <ChevronRight className="h-4 w-4" />
              <Link to="/career" className="hover:text-foreground transition-smooth">Career</Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-foreground font-medium" aria-current="page">Portfolio Builder</span>
            </nav>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight text-foreground">
                Professional Portfolio Builder
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-prose">
                Don't just tell them what you can do—show them. Build case studies that prove your expertise and win interviews.
              </p>
            </motion.div>

            {/* Interactive Shell */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="mb-16">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <Card className="border-border shadow-sm text-center">
                  <CardContent className="p-6 pt-8">
                    <LayoutTemplate className="h-10 w-10 mx-auto text-primary mb-4" />
                    <h3 className="font-semibold mb-2">Designers</h3>
                    <p className="text-sm text-muted-foreground mb-4">Case study templates emphasizing UX flow and UI design systems.</p>
                    <Button variant="outline" size="sm" className="w-full" onClick={() => toast.info('Design templates coming soon.')}>View Templates</Button>
                  </CardContent>
                </Card>
                <Card className="border-border shadow-sm text-center">
                  <CardContent className="p-6 pt-8">
                    <Laptop className="h-10 w-10 mx-auto text-primary mb-4" />
                    <h3 className="font-semibold mb-2">Developers</h3>
                    <p className="text-sm text-muted-foreground mb-4">Code-focused layouts highlighting architecture and performance.</p>
                    <Button variant="outline" size="sm" className="w-full" onClick={() => toast.info('Dev templates coming soon.')}>View Templates</Button>
                  </CardContent>
                </Card>
                <Card className="border-border shadow-sm text-center">
                  <CardContent className="p-6 pt-8">
                    <Layers className="h-10 w-10 mx-auto text-primary mb-4" />
                    <h3 className="font-semibold mb-2">Marketers/PMs</h3>
                    <p className="text-sm text-muted-foreground mb-4">Results-driven templates focused on metrics and growth strategy.</p>
                    <Button variant="outline" size="sm" className="w-full" onClick={() => toast.info('Marketing templates coming soon.')}>View Templates</Button>
                  </CardContent>
                </Card>
              </div>
            </motion.div>

            {/* Dynamic SEO Content Section */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <ToolContentDisplay content={contentData} />
            </motion.div>
          </div>
        </main>
      </div>
    </>
  );
};

export default PortfolioBuilderPage;