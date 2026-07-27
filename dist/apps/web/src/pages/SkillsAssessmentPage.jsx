import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { ChevronRight, CheckCircle2, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import ToolContentDisplay from '@/components/ToolContentDisplay.jsx';
import { toolContent } from '@/data/toolContent.js';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import NavigationButtons from '@/components/NavigationButtons.jsx';

const SkillsAssessmentPage = () => {
  const contentData = toolContent['skills-assessment'];

  return (
    <>
      <Helmet>
        <title>{contentData.title} | Toolisiya</title>
        <meta name="description" content={contentData.introduction.substring(0, 150)} />
      </Helmet>
      
      <div className="min-h-screen flex flex-col bg-background">
        <main className="flex-1 py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            <NavigationButtons />
            
            {/* Breadcrumbs */}
            <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
              <Link to="/" className="hover:text-foreground transition-smooth">Home</Link>
              <ChevronRight className="h-4 w-4" />
              <Link to="/career" className="hover:text-foreground transition-smooth">Career</Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-foreground font-medium" aria-current="page">Skills Assessment</span>
            </nav>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight text-foreground">
                Skills Assessment Tool
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-prose">
                Identify your blind spots. Evaluate your technical and soft skills against current industry benchmarks to direct your learning.
              </p>
            </motion.div>

            {/* Interactive Shell */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="mb-16">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="shadow-md border-border bg-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-emerald-500" /> Self-Evaluation Matrix</CardTitle>
                    <CardDescription>Rate your current proficiency levels</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-6">Create a baseline inventory of your hard and soft skills. Rate yourself honestly to identify high-ROI areas for improvement.</p>
                    <Button variant="outline" className="w-full" onClick={() => toast.info('Assessment matrices are loading...')}>Open Matrix Builder</Button>
                  </CardContent>
                </Card>
                <Card className="shadow-md border-border bg-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5 text-primary" /> Industry Benchmark</CardTitle>
                    <CardDescription>Compare against job requirements</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-6">Paste a target job description. We will extract the required skills and map them against your self-evaluation to highlight gaps.</p>
                    <Button className="w-full" onClick={() => toast.info('AI JD parsing feature coming soon.')}>Analyze Job Description</Button>
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

export default SkillsAssessmentPage;