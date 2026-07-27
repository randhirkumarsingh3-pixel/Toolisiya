import React, { useState } from 'react';
import { Search, CheckCircle2, Circle, BookOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import BreadcrumbNavigation from '@/components/BreadcrumbNavigation.jsx';
import SEOHead from '@/components/SEOHead.jsx';

const MOCK_QUESTIONS = [
  { id: 1, category: 'Behavioral', difficulty: 'Easy', question: 'Tell me about yourself.', answer: 'Focus on your professional journey, highlighting key achievements and how they align with the role you are applying for. Keep it concise (1-2 minutes).' },
  { id: 2, category: 'Behavioral', difficulty: 'Medium', question: 'Describe a time you faced a conflict at work.', answer: 'Use the STAR method (Situation, Task, Action, Result). Focus on your professional approach to resolving the issue and what you learned.' },
  { id: 3, category: 'Technical', difficulty: 'Medium', question: 'Explain the difference between REST and GraphQL.', answer: 'REST is an architectural style using standard HTTP methods and multiple endpoints. GraphQL is a query language allowing clients to request exactly the data they need from a single endpoint.' },
  { id: 4, category: 'HR', difficulty: 'Easy', question: 'What are your salary expectations?', answer: 'Provide a range based on market research for the role and your experience level. Express flexibility and focus on the total compensation package.' }
];

const InterviewPreparationGuidePage = () => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [practiced, setPracticed] = useState(new Set());

  const togglePracticed = (id) => {
    const newPracticed = new Set(practiced);
    if (newPracticed.has(id)) newPracticed.delete(id);
    else newPracticed.add(id);
    setPracticed(newPracticed);
  };

  const categories = ['All', 'Behavioral', 'Technical', 'HR'];

  const filteredQuestions = MOCK_QUESTIONS.filter(q => {
    const matchesSearch = q.question.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'All' || q.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const progress = Math.round((practiced.size / MOCK_QUESTIONS.length) * 100) || 0;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEOHead defaultTitle="Interview Preparation Guide | Toolisiya" defaultDescription="Practice common interview questions and track your preparation progress." />

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-5xl">
          <BreadcrumbNavigation customTitle="Interview Prep" />
          
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Interview Preparation Guide</h1>
            <p className="text-muted-foreground">Master your next interview with our curated question bank.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="md:col-span-3">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search questions..." className="pl-9" value={search} onChange={e => setSearch(e.target.value)} />
                  </div>
                  <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
                    {categories.map(cat => (
                      <Button key={cat} variant={activeCategory === cat ? 'default' : 'outline'} onClick={() => setActiveCategory(cat)} className="whitespace-nowrap">
                        {cat}
                      </Button>
                    ))}
                  </div>
                </div>

                <Accordion type="multiple" className="space-y-4">
                  {filteredQuestions.map(q => (
                    <AccordionItem key={q.id} value={`item-${q.id}`} className="border rounded-lg px-4 bg-card">
                      <div className="flex items-center gap-3">
                        <button onClick={() => togglePracticed(q.id)} className="text-primary hover:text-primary/80 transition-colors">
                          {practiced.has(q.id) ? <CheckCircle2 className="h-6 w-6 text-emerald-500" /> : <Circle className="h-6 w-6 text-muted-foreground" />}
                        </button>
                        <AccordionTrigger className="hover:no-underline flex-1 text-left py-4">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full pr-4">
                            <span className="font-medium text-base">{q.question}</span>
                            <div className="flex gap-2 sm:ml-auto">
                              <Badge variant="secondary">{q.category}</Badge>
                              <Badge variant="outline" className={q.difficulty === 'Easy' ? 'text-emerald-500' : q.difficulty === 'Medium' ? 'text-amber-500' : 'text-red-500'}>{q.difficulty}</Badge>
                            </div>
                          </div>
                        </AccordionTrigger>
                      </div>
                      <AccordionContent className="text-muted-foreground pl-9 pb-4 leading-relaxed">
                        <div className="p-4 bg-muted/30 rounded-md border border-border/50">
                          <strong className="text-foreground block mb-1">Sample Answer / Strategy:</strong>
                          {q.answer}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                  {filteredQuestions.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">No questions found matching your criteria.</div>
                  )}
                </Accordion>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card>
                <CardHeader><CardTitle className="text-lg flex items-center gap-2"><BookOpen className="h-5 w-5 text-primary" /> Progress</CardTitle></CardHeader>
                <CardContent>
                  <div className="text-center mb-2">
                    <span className="text-4xl font-bold text-primary">{progress}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2.5 mb-4">
                    <div className="bg-primary h-2.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                  </div>
                  <p className="text-sm text-center text-muted-foreground">{practiced.size} of {MOCK_QUESTIONS.length} questions practiced</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

    </div>
  );
};

export default InterviewPreparationGuidePage;