import React, { useState } from 'react';
import { Map, ArrowRight, Briefcase, GraduationCap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import BreadcrumbNavigation from '@/components/BreadcrumbNavigation.jsx';
import SEOHead from '@/components/SEOHead.jsx';
import NavigationButtons from '@/components/NavigationButtons.jsx';

const CAREER_PATHS = {
  'software-engineering': [
    { level: 'Entry Level', title: 'Junior Developer', salary: '$70k - $90k', years: '0-2 years', skills: ['Basic Programming', 'Git', 'Bug Fixing'] },
    { level: 'Mid Level', title: 'Software Engineer', salary: '$90k - $130k', years: '2-5 years', skills: ['System Design', 'Code Review', 'Agile'] },
    { level: 'Senior', title: 'Senior Engineer', salary: '$130k - $180k+', years: '5-8 years', skills: ['Architecture', 'Mentoring', 'Performance Optimization'] },
    { level: 'Lead', title: 'Tech Lead / Staff Engineer', salary: '$160k - $220k+', years: '8+ years', skills: ['Cross-team Leadership', 'Strategic Planning', 'Project Management'] }
  ],
  'marketing': [
    { level: 'Entry Level', title: 'Marketing Coordinator', salary: '$45k - $60k', years: '0-2 years', skills: ['Social Media', 'Content Creation', 'Basic Analytics'] },
    { level: 'Mid Level', title: 'Marketing Specialist', salary: '$60k - $85k', years: '2-4 years', skills: ['Campaign Management', 'SEO/SEM', 'Email Marketing'] },
    { level: 'Senior', title: 'Marketing Manager', salary: '$85k - $120k', years: '4-7 years', skills: ['Strategy', 'Budgeting', 'Team Management'] },
    { level: 'Lead', title: 'Director of Marketing', salary: '$120k - $160k+', years: '7+ years', skills: ['Brand Strategy', 'Executive Leadership', 'Market Expansion'] }
  ]
};

const CareerPathPlannerPage = () => {
  const [industry, setIndustry] = useState('software-engineering');
  const path = CAREER_PATHS[industry] || [];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEOHead defaultTitle="Career Path Planner | Toolisiya" defaultDescription="Visualize your career progression and plan your next steps." />
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <NavigationButtons />
          <BreadcrumbNavigation customTitle="Career Path Planner" />
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 mt-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Career Path Planner</h1>
              <p className="text-muted-foreground">Discover typical progression steps in your industry.</p>
            </div>
            <Select value={industry} onValueChange={setIndustry}>
              <SelectTrigger className="w-[250px]"><SelectValue placeholder="Select Industry" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="software-engineering">Software Engineering</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
            {path.map((step, index) => (
              <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-background bg-primary text-primary-foreground shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                  {index + 1}
                </div>
                <Card className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start mb-1">
                      <Badge variant="secondary" className="text-xs">{step.level}</Badge>
                      <span className="text-sm text-muted-foreground font-medium">{step.years}</span>
                    </div>
                    <CardTitle className="text-xl">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold mb-4">
                      <Briefcase className="h-4 w-4" /> {step.salary}
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-2 flex items-center gap-2"><GraduationCap className="h-4 w-4" /> Key Skills Needed:</p>
                      <div className="flex flex-wrap gap-2">
                        {step.skills.map((skill, i) => (
                          <Badge key={i} variant="outline" className="bg-muted/50">{skill}</Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CareerPathPlannerPage;