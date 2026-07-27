import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Receipt, PieChart } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import CalculatorLayout from '@/components/CalculatorLayout.jsx';
import pb from '@/lib/pocketbaseClient';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { toast } from 'sonner';

const CATEGORIES = ['Food', 'Transport', 'Entertainment', 'Shopping', 'Health', 'Bills', 'Other'];

const ExpenseReminderPage = () => {
  const { currentUser } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [description, setDescription] = useState('');
  const [filterCat, setFilterCat] = useState('All');

  useEffect(() => {
    fetchExpenses();
  }, [currentUser]);

  const fetchExpenses = async () => {
    try {
      if (currentUser) {
        const records = await pb.collection('expenses').getFullList({ sort: '-expenseDate,-created', $autoCancel: false });
        setExpenses(records);
      } else {
        setExpenses(JSON.parse(localStorage.getItem('localExpenses') || '[]'));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const addExpense = async (e) => {
    e.preventDefault();
    if (!amount || !category) return;

    const newExp = {
      userId: currentUser?.id || null,
      amount: Number(amount),
      category,
      expenseDate: date + " 00:00:00.000Z",
      description
    };

    try {
      if (currentUser) {
        await pb.collection('expenses').create(newExp, { $autoCancel: false });
        fetchExpenses();
      } else {
        const updated = [{ ...newExp, id: Date.now().toString() }, ...expenses].sort((a,b)=> new Date(b.expenseDate) - new Date(a.expenseDate));
        setExpenses(updated);
        localStorage.setItem('localExpenses', JSON.stringify(updated));
      }
      setAmount(''); setDescription('');
      toast.success('Expense recorded');
    } catch (error) {
      toast.error('Failed to add expense');
    }
  };

  const deleteExpense = async (id) => {
    try {
      if (currentUser) {
        await pb.collection('expenses').delete(id, { $autoCancel: false });
        fetchExpenses();
      } else {
        const updated = expenses.filter(e => e.id !== id);
        setExpenses(updated);
        localStorage.setItem('localExpenses', JSON.stringify(updated));
      }
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const filtered = expenses.filter(e => filterCat === 'All' || e.category === filterCat);
  const total = filtered.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <CalculatorLayout title="Expense Tracker" description="Monitor daily spending by category." category="Productivity" categoryPath="/productivity">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-expense-orange/30 shadow-md">
            <CardContent className="p-6 bg-expense-orange/5 dark:bg-expense-orange/10 rounded-xl">
              <h3 className="text-sm font-semibold text-expense-orange mb-1 uppercase tracking-wider">Total Spending</h3>
              <p className="text-4xl font-bold tracking-tight">${total.toFixed(2)}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4 text-lg">Add Expense</h3>
              <form onSubmit={addExpense} className="space-y-4">
                <div className="flex gap-2 text-foreground">
                  <span className="flex items-center justify-center bg-muted px-4 rounded-md border font-semibold">$</span>
                  <Input type="number" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" required className="flex-1" />
                </div>
                <Select value={category} onValueChange={setCategory} required>
                  <SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Input type="date" value={date} onChange={e => setDate(e.target.value)} required />
                <Input value={description} onChange={e => setDescription(e.target.value)} placeholder="Description (Optional)" />
                <Button type="submit" className="w-full bg-expense-orange hover:bg-expense-orange/90 text-white">Save Expense</Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Recent Transactions</h3>
            <Select value={filterCat} onValueChange={setFilterCat}>
              <SelectTrigger className="w-[150px]"><SelectValue placeholder="Filter" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Categories</SelectItem>
                {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-16 bg-muted/30 rounded-xl border border-dashed">
              <Receipt className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
              <p className="text-muted-foreground">No expenses found.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map(exp => {
                const dateStr = exp.expenseDate.split(' ')[0] || exp.expenseDate.split('T')[0];
                return (
                  <Card key={exp.id} className="transition-smooth hover:shadow-sm">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground shrink-0">
                          <PieChart className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-semibold">{exp.category}</p>
                          <div className="flex text-sm text-muted-foreground gap-2">
                            <span>{dateStr}</span>
                            {exp.description && <span>• {exp.description}</span>}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-bold text-lg">${exp.amount.toFixed(2)}</span>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10" onClick={() => deleteExpense(exp.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </CalculatorLayout>
  );
};

export default ExpenseReminderPage;