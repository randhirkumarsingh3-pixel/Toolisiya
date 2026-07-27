import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { PiggyBank, Plus, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import BreadcrumbNavigation from '@/components/BreadcrumbNavigation.jsx';
import NavigationButtons from '@/components/NavigationButtons.jsx';

const BudgetPlannerPage = () => {
  const [monthlyIncome, setMonthlyIncome] = useState('5000');
  const [expenses, setExpenses] = useState([
    { id: 1, category: 'Housing', amount: '1500', type: 'needs' },
    { id: 2, category: 'Food', amount: '500', type: 'needs' },
    { id: 3, category: 'Transportation', amount: '300', type: 'needs' }
  ]);
  const [savingsGoal, setSavingsGoal] = useState('1000');

  const addExpense = () => {
    setExpenses([...expenses, { id: Date.now(), category: '', amount: '', type: 'needs' }]);
  };

  const removeExpense = (id) => {
    setExpenses(expenses.filter(e => e.id !== id));
  };

  const updateExpense = (id, field, value) => {
    setExpenses(expenses.map(e => e.id === id ? { ...e, [field]: value } : e));
  };

  const totalExpenses = expenses.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);
  const income = parseFloat(monthlyIncome) || 0;
  const remaining = income - totalExpenses;
  const savingsTarget = parseFloat(savingsGoal) || 0;
  const savingsProgress = (remaining / savingsTarget) * 100;

  const needs = expenses.filter(e => e.type === 'needs').reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);
  const wants = expenses.filter(e => e.type === 'wants').reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);
  const savings = remaining;

  const needsPercent = income > 0 ? (needs / income) * 100 : 0;
  const wantsPercent = income > 0 ? (wants / income) * 100 : 0;
  const savingsPercent = income > 0 ? (savings / income) * 100 : 0;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>Budget Planner – Create Your Budget Online</title>
        <meta name="description" content="Plan your budget with our free Budget Planner. Track income, expenses, and savings goals easily." />
        <meta name="keywords" content="budget planner, budget calculator, personal budget, expense budget, financial planning" />
        <link rel="canonical" href="https://toolisiya.com/finance/budget-planner" />
        <meta property="og:title" content="Budget Planner – Create Your Budget Online" />
        <meta property="og:description" content="Plan your budget with our free Budget Planner. Track income, expenses, and savings goals easily." />
        <meta property="og:url" content="https://toolisiya.com/finance/budget-planner" />
        <meta property="og:type" content="website" />
      </Helmet>

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <BreadcrumbNavigation customTitle="Budget Planner" />
          <NavigationButtons />

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">Budget Planner – Create Your Budget</h1>
            <p className="text-lg text-muted-foreground max-w-2xl">Take control of your finances with our comprehensive budget planning tool. Track income, categorize expenses, and achieve your savings goals.</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <Card className="lg:col-span-2 shadow-lg">
              <CardHeader className="bg-muted/30 border-b">
                <CardTitle className="flex items-center gap-2"><PiggyBank className="h-5 w-5 text-primary" /> Budget Details</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label>Monthly Income</Label>
                    <Input type="number" value={monthlyIncome} onChange={(e) => setMonthlyIncome(e.target.value)} className="h-12 text-lg" />
                  </div>
                  <div className="space-y-3">
                    <Label>Monthly Savings Goal</Label>
                    <Input type="number" value={savingsGoal} onChange={(e) => setSavingsGoal(e.target.value)} className="h-12 text-lg" />
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <Label className="text-lg font-semibold">Expenses</Label>
                    <Button size="sm" onClick={addExpense}><Plus className="h-4 w-4 mr-1" /> Add Expense</Button>
                  </div>
                  {expenses.map((expense) => (
                    <div key={expense.id} className="grid grid-cols-1 md:grid-cols-4 gap-3 p-4 bg-muted/30 rounded-lg relative group">
                      <Input placeholder="Category" value={expense.category} onChange={(e) => updateExpense(expense.id, 'category', e.target.value)} />
                      <Input type="number" placeholder="Amount" value={expense.amount} onChange={(e) => updateExpense(expense.id, 'amount', e.target.value)} />
                      <Select value={expense.type} onValueChange={(val) => updateExpense(expense.id, 'type', val)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="needs">Needs</SelectItem>
                          <SelectItem value="wants">Wants</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button variant="ghost" size="icon" onClick={() => removeExpense(expense.id)} className="text-destructive opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg bg-primary/5 border-primary/20">
              <CardHeader className="border-b border-primary/20">
                <CardTitle>Budget Summary</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b">
                    <span className="text-muted-foreground">Monthly Income</span>
                    <span className="text-xl font-bold">₹{income.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b">
                    <span className="text-muted-foreground">Total Expenses</span>
                    <span className="text-xl font-bold text-destructive">-₹{totalExpenses.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b">
                    <span className="font-semibold">Remaining</span>
                    <span className={`text-2xl font-bold ${remaining >= 0 ? 'text-emerald-600' : 'text-destructive'}`}>
                      ₹{remaining.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t">
                  <div className="flex justify-between items-center text-sm">
                    <span>Savings Progress</span>
                    <span className="font-semibold">{savingsProgress.toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3">
                    <div className="bg-primary h-3 rounded-full transition-all" style={{ width: `${Math.min(savingsProgress, 100)}%` }}></div>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t">
                  <h3 className="font-semibold mb-2">50/30/20 Rule</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Needs (50%)</span>
                      <span className={needsPercent <= 50 ? 'text-emerald-600' : 'text-amber-600'}>{needsPercent.toFixed(0)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Wants (30%)</span>
                      <span className={wantsPercent <= 30 ? 'text-emerald-600' : 'text-amber-600'}>{wantsPercent.toFixed(0)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Savings (20%)</span>
                      <span className={savingsPercent >= 20 ? 'text-emerald-600' : 'text-amber-600'}>{savingsPercent.toFixed(0)}%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Understanding Section */}
          <section className="mb-12 bg-card p-6 md:p-8 rounded-2xl border shadow-sm">
            <h2 className="text-2xl font-bold mb-4">Understanding the budget planner</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                The Budget Planner is a comprehensive financial tool designed to help individuals and families take control of their money by creating a structured spending plan. A budget is essentially a roadmap for your finances, showing you where your money comes from and where it goes each month. By tracking income and expenses systematically, you can identify spending patterns, eliminate waste, and allocate resources toward your most important financial goals. This planner makes budgeting accessible and actionable, transforming what can seem like a daunting task into a manageable, empowering process.
              </p>
              <p>
                Effective budgeting follows proven frameworks like the 50/30/20 rule, which suggests allocating 50% of your income to needs (housing, food, utilities), 30% to wants (entertainment, dining out), and 20% to savings and debt repayment. Our Budget Planner automatically calculates these percentages based on your inputs, helping you see at a glance whether your spending aligns with this balanced approach. By categorizing expenses as needs or wants, you gain clarity on where adjustments might be necessary to achieve better financial health and reach your savings targets faster.
              </p>
              <p>
                Beyond simple tracking, this tool serves as a financial awareness builder and decision-making aid. When you see your remaining balance after expenses, you can make informed choices about discretionary spending, emergency fund contributions, or debt payoff strategies. Regular use of a budget planner reduces financial stress, prevents overspending, and creates accountability. Whether you're saving for a major purchase, paying off debt, or building long-term wealth, a well-maintained budget is the foundation of financial success and peace of mind.
              </p>
            </div>
          </section>

          {/* Features Section */}
          <section className="mb-12 bg-card p-6 md:p-8 rounded-2xl border shadow-sm">
            <h2 className="text-2xl font-bold mb-6">Features & functionality</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="font-semibold">Feature</Badge>
                  <h3 className="font-semibold text-lg">Income Tracking</h3>
                </div>
                <p className="text-muted-foreground text-sm">Enter your total monthly income from all sources including salary, freelance work, investments, and other revenue streams. The planner uses this as the foundation for calculating your available budget and spending limits.</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="font-semibold">Feature</Badge>
                  <h3 className="font-semibold text-lg">Expense Categorization</h3>
                </div>
                <p className="text-muted-foreground text-sm">Organize expenses into meaningful categories and classify them as needs or wants. This categorization helps you understand spending patterns and identify areas where you can cut back if necessary to meet your financial goals.</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="font-semibold">Feature</Badge>
                  <h3 className="font-semibold text-lg">Budget Allocation</h3>
                </div>
                <p className="text-muted-foreground text-sm">Automatically calculate how your income is distributed across needs, wants, and savings using the proven 50/30/20 rule. Visual indicators show whether your allocation aligns with recommended percentages, helping you make informed adjustments.</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="font-semibold">Feature</Badge>
                  <h3 className="font-semibold text-lg">Spending Comparison</h3>
                </div>
                <p className="text-muted-foreground text-sm">Compare your actual spending against your income and savings goals in real-time. The summary panel shows your remaining balance after expenses, making it easy to see if you're on track or need to adjust your spending habits.</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="font-semibold">Feature</Badge>
                  <h3 className="font-semibold text-lg">Savings Goals</h3>
                </div>
                <p className="text-muted-foreground text-sm">Set monthly savings targets and track your progress with a visual progress bar. The planner calculates what percentage of your goal you've achieved based on your remaining balance, motivating you to stay on track with your financial objectives.</p>
              </div>
            </div>
          </section>

          {/* How It Works Section */}
          <section className="mb-12 bg-card p-6 md:p-8 rounded-2xl border shadow-sm">
            <h2 className="text-2xl font-bold mb-4">How it works</h2>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">1</div>
                <div>
                  <h3 className="font-semibold mb-1">Set Income</h3>
                  <p className="text-muted-foreground text-sm">Enter your total monthly income from all sources. This establishes your budget baseline and determines how much you have available to allocate across expenses and savings.</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">2</div>
                <div>
                  <h3 className="font-semibold mb-1">Create Categories</h3>
                  <p className="text-muted-foreground text-sm">Add expense categories and classify each as a need or want. Include all regular expenses like housing, food, transportation, entertainment, and subscriptions. Be thorough to get an accurate picture of your spending.</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">3</div>
                <div>
                  <h3 className="font-semibold mb-1">Track Spending</h3>
                  <p className="text-muted-foreground text-sm">Enter the amount you spend in each category. The planner automatically calculates your total expenses and shows how much money remains after all spending, helping you see if you're living within your means.</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">4</div>
                <div>
                  <h3 className="font-semibold mb-1">Monitor Progress</h3>
                  <p className="text-muted-foreground text-sm">Review the budget summary to see your remaining balance, savings progress, and how your spending compares to the 50/30/20 rule. Use these insights to adjust your spending habits and stay on track with your financial goals.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Tips Section */}
          <section className="mb-12 bg-card p-6 md:p-8 rounded-2xl border shadow-sm">
            <h2 className="text-2xl font-bold mb-4">Tips & best practices</h2>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex gap-3">
                <span className="text-primary font-bold">•</span>
                <span>Follow the 50/30/20 rule as a guideline: allocate 50% of income to needs, 30% to wants, and 20% to savings and debt repayment. This balanced approach ensures you cover essentials while still enjoying life and building financial security.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">•</span>
                <span>Track every expense, no matter how small. Small purchases add up quickly and can derail your budget if left unaccounted for. Include coffee, snacks, and impulse buys to get a complete picture of your spending habits.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">•</span>
                <span>Review and adjust your budget monthly. Your financial situation and priorities change over time, so update your budget regularly to reflect new income, expenses, or goals. This keeps your budget relevant and effective.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">•</span>
                <span>Build an emergency fund before focusing on other savings goals. Aim for 3-6 months of expenses in a readily accessible account. This financial cushion protects you from unexpected costs and reduces the need to rely on credit cards or loans.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary font-bold">•</span>
                <span>Automate savings by setting up automatic transfers to your savings account on payday. Treating savings as a non-negotiable expense ensures you consistently build wealth and reach your financial goals faster.</span>
              </li>
            </ul>
          </section>

          {/* Use Cases Section */}
          <section className="mb-12 bg-card p-6 md:p-8 rounded-2xl border shadow-sm">
            <h2 className="text-2xl font-bold mb-4">Common use cases</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">Personal Finance</h3>
                <p className="text-muted-foreground text-sm">Manage your individual finances by tracking income from your job, side hustles, and investments. Categorize personal expenses, monitor spending patterns, and ensure you're saving enough for future goals while maintaining a comfortable lifestyle.</p>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">Household Budget</h3>
                <p className="text-muted-foreground text-sm">Create a comprehensive family budget that accounts for all household income and shared expenses. Coordinate spending across multiple family members, plan for children's activities, and ensure everyone understands and contributes to financial goals.</p>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">Debt Payoff</h3>
                <p className="text-muted-foreground text-sm">Allocate extra funds toward debt repayment by identifying areas where you can reduce spending. Track progress as you pay down credit cards, student loans, or other debts, and celebrate milestones as you work toward becoming debt-free.</p>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">Savings Goals</h3>
                <p className="text-muted-foreground text-sm">Plan for major purchases or life events by setting specific savings targets. Whether you're saving for a down payment, vacation, wedding, or emergency fund, the budget planner helps you allocate funds consistently and track your progress toward achieving your goals.</p>
              </div>
            </div>
          </section>

          {/* FAQs Section */}
          <section className="mb-12 bg-card p-6 md:p-8 rounded-2xl border shadow-sm">
            <h2 className="text-2xl font-bold mb-6">Frequently asked questions</h2>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-left">What is the 50/30/20 budget rule?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  The 50/30/20 rule is a simple budgeting framework that divides your after-tax income into three categories: 50% for needs (essential expenses like housing, food, utilities, transportation), 30% for wants (discretionary spending like entertainment, dining out, hobbies), and 20% for savings and debt repayment. This balanced approach ensures you cover necessities, enjoy life, and build financial security simultaneously.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger className="text-left">How often should I update my budget?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  Review and update your budget at least monthly to account for changes in income, expenses, or financial goals. Many people find it helpful to review their budget weekly to stay on track with spending. Update your budget immediately when you experience major life changes like a new job, moving, or having a child, as these events significantly impact your financial situation.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger className="text-left">What should I do if my expenses exceed my income?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  If expenses exceed income, first identify non-essential spending you can reduce or eliminate. Look for subscriptions you don't use, dining out expenses, or entertainment costs that can be cut. If cutting wants isn't enough, examine your needs category for potential savings like negotiating bills, finding cheaper alternatives, or downsizing. Consider increasing income through a side hustle, asking for a raise, or selling unused items. The goal is to create a sustainable budget where income exceeds expenses.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger className="text-left">How much should I save each month?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  Financial experts generally recommend saving at least 20% of your income, though the right amount depends on your goals and circumstances. If you're building an emergency fund, prioritize that first with a goal of 3-6 months of expenses. Once established, allocate savings toward retirement (aim for 15% of income), short-term goals, and long-term wealth building. If 20% seems impossible, start with any amount you can manage and gradually increase it as you optimize your budget.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5">
                <AccordionTrigger className="text-left">Should I include irregular expenses in my monthly budget?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  Yes, include irregular expenses by calculating their annual cost and dividing by 12 to get a monthly amount. This applies to expenses like car insurance, property taxes, annual subscriptions, holiday gifts, and car maintenance. By setting aside money each month for these predictable but infrequent expenses, you avoid budget surprises and ensure you have funds available when these bills come due.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6">
                <AccordionTrigger className="text-left">How do I handle variable income when budgeting?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  For variable income (freelancers, commission-based workers), base your budget on your lowest expected monthly income to ensure you can always cover essentials. When you earn more than expected, allocate the extra toward savings, debt payoff, or irregular expenses. Build a larger emergency fund (6-12 months of expenses) to smooth out income fluctuations. Track your income over several months to identify patterns and establish a realistic baseline for budgeting purposes.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>
        </div>
      </main>
    </div>
  );
};

export default BudgetPlannerPage;