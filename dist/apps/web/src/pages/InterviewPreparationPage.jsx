import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { ChevronRight, PlayCircle, BookOpen, Star, Mic } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import ToolContentDisplay from '@/components/ToolContentDisplay.jsx';
import { toolContent } from '@/data/toolContent.js';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import NavigationButtons from '@/components/NavigationButtons.jsx';

const InterviewPreparationPage = () => {
  const contentData = toolContent['interview-preparation'];

  const resources = [
    { icon: BookOpen, title: "Behavioral Questions Bank", desc: "Top 50 STAR method questions" },
    { icon: Star, title: "Industry Specific Guides", desc: "IT, Finance, and Marketing" },
    { icon: Mic, title: "Mock Interview Simulator", desc: "Practice with AI feedback" }
  ];

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
              <span className="text-foreground font-medium" aria-current="page">Interview Prep</span>
            </nav>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight text-foreground">
                Interview Preparation Guide
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-prose">
                Master the STAR method, anticipate difficult questions, and walk into your next interview with complete confidence.
              </p>
            </motion.div>

            {/* Interactive Shell */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="mb-16">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {resources.map((resource, i) => (
                  <Card key={i} className="border border-border shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-6 flex flex-col items-center text-center">
                      <div className="h-12 w-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                        <resource.icon className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="font-bold text-lg mb-2">{resource.title}</h3>
                      <p className="text-muted-foreground text-sm mb-4">{resource.desc}</p>
                      <Button variant="secondary" className="w-full mt-auto" onClick={() => toast.info('Module unlocking soon!')}>
                        Start Practice
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <Card className="mt-6 bg-primary text-primary-foreground overflow-hidden">
                <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">Want personalized feedback?</h3>
                    <p className="text-primary-foreground/80 max-w-md">Try our new AI Mock Interview Simulator. Practice standard HR rounds and get instant tone and structure analysis.</p>
                  </div>
                  <Button variant="secondary" size="lg" className="whitespace-nowrap" onClick={() => toast.info('AI Simulator is currently in beta.')}>
                    <PlayCircle className="h-5 w-5 mr-2" /> Try Beta Simulator
                  </Button>
                </CardContent>
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

export default InterviewPreparationPage;