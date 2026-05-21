import React, { useState } from 'react';
import { CheckCircle2, AlertCircle, RefreshCcw } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import BreadcrumbNavigation from '@/components/BreadcrumbNavigation.jsx';
import SEOHead from '@/components/SEOHead.jsx';
import NavigationButtons from '@/components/NavigationButtons.jsx';

const QUIZ_QUESTIONS = [
  { id: 1, category: 'Technical', text: 'What does HTML stand for?', options: ['Hyper Text Markup Language', 'High Text Machine Language', 'Hyperloop Machine Language', 'None of the above'], correct: 0 },
  { id: 2, category: 'Technical', text: 'Which of the following is a CSS framework?', options: ['React', 'Tailwind', 'Node.js', 'MongoDB'], correct: 1 },
  { id: 3, category: 'Soft Skills', text: 'When facing a tight deadline, you should:', options: ['Panic', 'Prioritize tasks and communicate', 'Ignore quality', 'Work 24/7 without sleep'], correct: 1 },
  { id: 4, category: 'Leadership', text: 'A good leader primarily:', options: ['Micromanages', 'Takes all credit', 'Empowers the team', 'Avoids responsibility'], correct: 2 }
];

const SkillsAssessmentToolPage = () => {
  const [currentStep, setCurrentStep] = useState('intro'); // intro, quiz, results
  const [answers, setAnswers] = useState({});
  const [currentQIndex, setCurrentQIndex] = useState(0);

  const handleStart = () => {
    setAnswers({});
    setCurrentQIndex(0);
    setCurrentStep('quiz');
  };

  const handleAnswer = (val) => {
    setAnswers({ ...answers, [currentQIndex]: parseInt(val) });
  };

  const handleNext = () => {
    if (currentQIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentQIndex(currentQIndex + 1);
    } else {
      setCurrentStep('results');
    }
  };

  const calculateResults = () => {
    let score = 0;
    const categoryScores = { Technical: 0, 'Soft Skills': 0, Leadership: 0 };
    const categoryTotals = { Technical: 0, 'Soft Skills': 0, Leadership: 0 };

    QUIZ_QUESTIONS.forEach((q, index) => {
      categoryTotals[q.category]++;
      if (answers[index] === q.correct) {
        score++;
        categoryScores[q.category]++;
      }
    });

    const chartData = Object.keys(categoryScores).map(cat => ({
      name: cat,
      score: categoryTotals[cat] > 0 ? Math.round((categoryScores[cat] / categoryTotals[cat]) * 100) : 0
    }));

    const percentage = Math.round((score / QUIZ_QUESTIONS.length) * 100);
    let level = 'Beginner';
    if (percentage >= 80) level = 'Expert';
    else if (percentage >= 60) level = 'Advanced';
    else if (percentage >= 40) level = 'Intermediate';

    return { score, percentage, level, chartData };
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEOHead defaultTitle="Skills Assessment | Toolisiya" defaultDescription="Evaluate your professional skills and get personalized recommendations." />

      <main className="flex-1 py-8 flex items-center justify-center">
        <div className="container mx-auto px-4 max-w-3xl">
          <NavigationButtons />
          <BreadcrumbNavigation customTitle="Skills Assessment" />
          
          {currentStep === 'intro' && (
            <Card className="text-center py-12 shadow-lg">
              <CardHeader>
                <CardTitle className="text-3xl mb-2">Professional Skills Assessment</CardTitle>
                <p className="text-muted-foreground">Take this quick quiz to evaluate your technical, soft, and leadership skills.</p>
              </CardHeader>
              <CardContent>
                <Button size="lg" onClick={handleStart} className="mt-4">Start Assessment</Button>
              </CardContent>
            </Card>
          )}

          {currentStep === 'quiz' && (
            <Card className="shadow-lg">
              <CardHeader className="border-b bg-muted/30">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-muted-foreground">Question {currentQIndex + 1} of {QUIZ_QUESTIONS.length}</span>
                  <span className="text-sm font-medium text-primary">{QUIZ_QUESTIONS[currentQIndex].category}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-1.5">
                  <div className="bg-primary h-1.5 rounded-full transition-all" style={{ width: `${((currentQIndex + 1) / QUIZ_QUESTIONS.length) * 100}%` }}></div>
                </div>
              </CardHeader>
              <CardContent className="p-6 sm:p-8">
                <h2 className="text-xl font-semibold mb-6">{QUIZ_QUESTIONS[currentQIndex].text}</h2>
                <RadioGroup value={answers[currentQIndex]?.toString()} onValueChange={handleAnswer} className="space-y-3">
                  {QUIZ_QUESTIONS[currentQIndex].options.map((opt, i) => (
                    <div key={i} className={`flex items-center space-x-3 border p-4 rounded-lg cursor-pointer transition-colors ${answers[currentQIndex] === i ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'}`}>
                      <RadioGroupItem value={i.toString()} id={`opt-${i}`} />
                      <Label htmlFor={`opt-${i}`} className="flex-1 cursor-pointer text-base">{opt}</Label>
                    </div>
                  ))}
                </RadioGroup>
                <div className="mt-8 flex justify-end">
                  <Button onClick={handleNext} disabled={answers[currentQIndex] === undefined}>
                    {currentQIndex === QUIZ_QUESTIONS.length - 1 ? 'See Results' : 'Next Question'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {currentStep === 'results' && (() => {
            const res = calculateResults();
            return (
              <div className="space-y-6 animate-fade-in">
                <Card className="text-center py-8 shadow-lg border-t-4 border-t-primary">
                  <CardContent>
                    <CheckCircle2 className="h-16 w-16 text-emerald-500 mx-auto mb-4" />
                    <h2 className="text-3xl font-bold mb-2">Assessment Complete!</h2>
                    <p className="text-muted-foreground mb-6">You scored {res.score} out of {QUIZ_QUESTIONS.length} ({res.percentage}%)</p>
                    <div className="inline-block px-6 py-2 rounded-full bg-primary/10 text-primary font-bold text-xl mb-6">
                      Level: {res.level}
                    </div>
                    <div className="flex justify-center gap-4">
                      <Button variant="outline" onClick={handleStart}><RefreshCcw className="h-4 w-4 mr-2" /> Retake Quiz</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader><CardTitle>Skill Breakdown</CardTitle></CardHeader>
                  <CardContent>
                    <div className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={res.chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" opacity={0.2} vertical={false} />
                          <XAxis dataKey="name" />
                          <YAxis domain={[0, 100]} tickFormatter={(val) => `${val}%`} />
                          <Tooltip cursor={{fill: 'transparent'}} formatter={(val) => `${val}%`} />
                          <Bar dataKey="score" fill="#2563eb" radius={[4, 4, 0, 0]} maxBarSize={60} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })()}
        </div>
      </main>

    </div>
  );
};

export default SkillsAssessmentToolPage;