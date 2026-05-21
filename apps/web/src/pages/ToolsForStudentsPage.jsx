import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import BreadcrumbNavigation from '@/components/BreadcrumbNavigation.jsx';
import { Card, CardContent } from '@/components/ui/card';
import StickyNavigation from '@/components/StickyNavigation.jsx';

const ToolsForStudentsPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      <Helmet>
        <title>Best Free Online Tools for Students - Toolisiya</title>
        <meta name="description" content="Boost your study sessions with the best tools for students online free. Track habits, count words, and manage time easily." />
        <meta name="keywords" content="tools for students online free, student productivity tools, student calculators" />
      </Helmet>
      <main className="flex-1 container mx-auto px-4 py-8 max-w-5xl">
        <StickyNavigation />
        <BreadcrumbNavigation customTitle="Tools For Students" />
        <h1 className="text-4xl font-extrabold mb-6">Best Free Online Tools for Students</h1>
        <p className="text-lg text-muted-foreground mb-12">Discover student productivity tools that help you excel. From word counters for essays to pomodoro timers for intense study sessions.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <Link to="/productivity/pomodoro-timer"><Card className="h-full hover:shadow-soft"><CardContent className="p-6 font-semibold hover:text-primary">Pomodoro Timer</CardContent></Card></Link>
           <Link to="/developer/word-counter"><Card className="h-full hover:shadow-soft"><CardContent className="p-6 font-semibold hover:text-primary">Word Counter & Essay Stats</CardContent></Card></Link>
           <Link to="/productivity/daily-planner"><Card className="h-full hover:shadow-soft"><CardContent className="p-6 font-semibold hover:text-primary">Study Daily Planner</CardContent></Card></Link>
        </div>
      </main>
    </div>
  );
};

export default ToolsForStudentsPage;