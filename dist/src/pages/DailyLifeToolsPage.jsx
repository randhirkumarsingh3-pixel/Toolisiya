import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import BreadcrumbNavigation from '@/components/BreadcrumbNavigation.jsx';
import { Card, CardContent } from '@/components/ui/card';
import StickyNavigation from '@/components/StickyNavigation.jsx';

const DailyLifeToolsPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      <Helmet>
        <title>Essential Tools for Daily Life - Toolisiya</title>
        <meta name="description" content="Smart tools for daily use. Convert currencies, track habits, and plan your meals completely free online." />
        <meta name="keywords" content="daily life tools online, smart tools for daily use, everyday calculators" />
      </Helmet>
      <main className="flex-1 container mx-auto px-4 py-8 max-w-5xl">
        <StickyNavigation />
        <BreadcrumbNavigation customTitle="Daily Life Tools" />
        <h1 className="text-4xl font-extrabold mb-6">Essential Tools for Daily Life</h1>
        <p className="text-lg text-muted-foreground mb-12">Simplify your everyday tasks with smart tools for daily use. Keep your habits in check and do quick math.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <Link to="/finance/currency-converter"><Card className="h-full hover:shadow-soft"><CardContent className="p-6 font-semibold hover:text-primary">Currency Converter</CardContent></Card></Link>
           <Link to="/productivity/habit-streak"><Card className="h-full hover:shadow-soft"><CardContent className="p-6 font-semibold hover:text-primary">Habit Tracker</CardContent></Card></Link>
           <Link to="/finance/age-calculator"><Card className="h-full hover:shadow-soft"><CardContent className="p-6 font-semibold hover:text-primary">Age Calculator</CardContent></Card></Link>
        </div>
      </main>
    </div>
  );
};

export default DailyLifeToolsPage;