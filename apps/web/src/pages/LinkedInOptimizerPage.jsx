import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { ChevronRight, Linkedin, Search, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import ToolContentDisplay from '@/components/ToolContentDisplay.jsx';
import { toolContent } from '@/data/toolContent.js';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const LinkedInOptimizerPage = () => {
  const contentData = toolContent['linkedin-optimizer'];

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
              <span className="text-foreground font-medium" aria-current="page">LinkedIn Optimizer</span>
            </nav>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight text-foreground">
                LinkedIn Profile Optimizer
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-prose">
                Transform your LinkedIn profile into a recruiter magnet. Optimize your headline, summary, and skills for maximum search visibility.
              </p>
            </motion.div>

            {/* Interactive Shell */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="mb-16">
              <Card className="shadow-lg border-[#0a66c2]/20 overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-2 bg-[#0a66c2]"></div>
                <div className="p-6 md:p-8 md:flex gap-8 items-center">
                  <div className="md:w-1/2 mb-6 md:mb-0">
                    <h3 className="text-2xl font-bold mb-2 flex items-center gap-2"><Linkedin className="h-6 w-6 text-[#0a66c2]" /> Headline Generator</h3>
                    <p className="text-muted-foreground mb-6">Your headline is the most heavily weighted SEO element on LinkedIn. Generate a keyword-rich headline tailored to recruiters.</p>
                    
                    <div className="space-y-4">
                      <Input placeholder="Current Job Title (e.g. Data Analyst)" />
                      <Input placeholder="Core Skills (e.g. Python, SQL, Tableau)" />
                      <Button className="w-full bg-[#0a66c2] hover:bg-[#0a66c2]/90" onClick={() => toast.success('Headline generation AI is starting up...')}>
                        Generate Optimal Headline
                      </Button>
                    </div>
                  </div>
                  
                  <div className="md:w-1/2 space-y-4">
                    <div className="bg-muted rounded-lg p-4 flex items-start gap-4">
                      <Search className="h-6 w-6 text-primary mt-1 shrink-0" />
                      <div>
                        <h4 className="font-semibold text-sm">Keyword Optimization</h4>
                        <p className="text-xs text-muted-foreground mt-1">Discover the exact keywords Indian tech and finance recruiters are searching for this month.</p>
                      </div>
                    </div>
                    <div className="bg-muted rounded-lg p-4 flex items-start gap-4">
                      <MessageSquare className="h-6 w-6 text-primary mt-1 shrink-0" />
                      <div>
                        <h4 className="font-semibold text-sm">Summary Storytelling</h4>
                        <p className="text-xs text-muted-foreground mt-1">Rewrite your 'About' section to focus on achievements rather than listing responsibilities.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
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

export default LinkedInOptimizerPage;