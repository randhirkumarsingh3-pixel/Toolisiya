import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Flame, Check, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import CalculatorLayout from '@/components/CalculatorLayout.jsx';
import pb from '@/lib/pocketbaseClient';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { toast } from 'sonner';
import { format } from 'date-fns';
import SEOContentDisplay from '@/components/SEOContentDisplay.jsx';

const HabitStreakPage = () => {
  const { currentUser } = useAuth();
  const [habits, setHabits] = useState([]);
  const [habitName, setHabitsName] = useState('');

  const todayStr = format(new Date(), 'yyyy-MM-dd');

  useEffect(() => {
    fetchHabits();
  }, [currentUser]);

  const fetchHabits = async () => {
    try {
      if (currentUser) {
        const records = await pb.collection('habits').getFullList({ sort: '-created', $autoCancel: false });
        setHabits(records);
      } else {
        setHabits(JSON.parse(localStorage.getItem('localHabits') || '[]'));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const addHabit = async (e) => {
    e.preventDefault();
    if (!habitName.trim()) return;

    const newHabit = { userId: currentUser?.id || null, habitName, currentStreak: 0, longestStreak: 0, completedDates: [], lastCompletedDate: null };

    try {
      if (currentUser) {
        await pb.collection('habits').create(newHabit, { $autoCancel: false });
        fetchHabits();
      } else {
        const updated = [{ ...newHabit, id: Date.now().toString() }, ...habits];
        setHabits(updated);
        localStorage.setItem('localHabits', JSON.stringify(updated));
      }
      setHabitsName('');
      toast.success('Habit added');
    } catch (error) { toast.error('Failed to add habit'); }
  };

  const markDone = async (habit) => {
    const dates = Array.isArray(habit.completedDates) ? habit.completedDates : [];
    if (dates.includes(todayStr)) return;

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = format(yesterday, 'yyyy-MM-dd');

    let newStreak = habit.currentStreak || 0;
    if (habit.lastCompletedDate && habit.lastCompletedDate.startsWith(yesterdayStr)) {
      newStreak += 1;
    } else if (!habit.lastCompletedDate || !habit.lastCompletedDate.startsWith(todayStr)) {
      newStreak = 1;
    }

    const newLongest = Math.max(newStreak, habit.longestStreak || 0);
    const newDates = [...dates, todayStr];

    const updates = { currentStreak: newStreak, longestStreak: newLongest, completedDates: newDates, lastCompletedDate: todayStr + " 00:00:00.000Z" };

    try {
      if (currentUser) {
        await pb.collection('habits').update(habit.id, updates, { $autoCancel: false });
        fetchHabits();
      } else {
        const updated = habits.map(h => h.id === habit.id ? { ...h, ...updates } : h);
        setHabits(updated);
        localStorage.setItem('localHabits', JSON.stringify(updated));
      }
      toast.success('Habit marked as done!');
    } catch (error) { toast.error('Failed to update habit'); }
  };

  const deleteHabit = async (id) => {
    if (!window.confirm('Delete this habit?')) return;
    try {
      if (currentUser) {
        await pb.collection('habits').delete(id, { $autoCancel: false });
        fetchHabits();
      } else {
        const updated = habits.filter(h => h.id !== id);
        setHabits(updated);
        localStorage.setItem('localHabits', JSON.stringify(updated));
      }
    } catch (error) { toast.error('Failed to delete'); }
  };

  return (
    <CalculatorLayout title="Habit Streak" description="Build and maintain positive habits." category="Productivity" categoryPath="/productivity">
      <Card className="mb-8 border-none shadow-sm bg-habit-green/5 dark:bg-habit-green/10">
        <CardContent className="p-6">
          <form onSubmit={addHabit} className="flex gap-4">
            <Input value={habitName} onChange={e => setHabitsName(e.target.value)} placeholder="New Habit (e.g., Read 10 pages)" className="flex-1 bg-background" required />
            <Button type="submit" className="bg-habit-green hover:bg-habit-green/90 text-white"><Plus className="mr-2 h-4 w-4" /> Add Habit</Button>
          </form>
        </CardContent>
      </Card>

      {habits.length === 0 ? (
        <div className="text-center py-16 bg-muted/30 rounded-xl border border-dashed mb-12">
          <Target className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
          <p className="text-muted-foreground">You haven't added any habits yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {habits.map(habit => {
            const isDoneToday = (habit.completedDates || []).includes(todayStr);
            return (
              <Card key={habit.id} className="border-border relative group overflow-hidden">
                {isDoneToday && <div className="absolute top-0 left-0 w-1 h-full bg-habit-green" />}
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-6">
                    <h3 className="font-bold text-lg leading-tight">{habit.habitName}</h3>
                    <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 text-destructive hover:bg-destructive/10" onClick={() => deleteHabit(habit.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="flex justify-between items-end mb-6">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Current Streak</p>
                      <div className="flex items-center gap-2">
                        <Flame className={`h-6 w-6 ${habit.currentStreak > 0 ? 'text-orange-500 fill-orange-500/20' : 'text-muted'}`} />
                        <span className="text-2xl font-bold tabular-nums">{habit.currentStreak || 0}</span>
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="text-xs text-muted-foreground">Longest: {habit.longestStreak || 0}</p>
                    </div>
                  </div>

                  <Button 
                    className={`w-full ${isDoneToday ? 'bg-habit-green/20 text-habit-green hover:bg-habit-green/30' : ''}`}
                    variant={isDoneToday ? "secondary" : "default"}
                    onClick={() => markDone(habit)}
                    disabled={isDoneToday}
                  >
                    {isDoneToday ? <><Check className="mr-2 h-4 w-4" /> Completed Today</> : 'Mark Done'}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <SEOContentDisplay toolName="habit-streak" />
    </CalculatorLayout>
  );
};

export default HabitStreakPage;