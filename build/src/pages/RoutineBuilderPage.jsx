import React, { useState, useEffect } from 'react';
import { Plus, Trash2, CheckCircle2, Circle, ListTodo, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import CalculatorLayout from '@/components/CalculatorLayout.jsx';
import pb from '@/lib/pocketbaseClient';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { toast } from 'sonner';

const CATEGORIES = ['Morning', 'Afternoon', 'Evening', 'Night'];

const RoutineBuilderPage = () => {
  const { currentUser } = useAuth();
  const [routines, setRoutines] = useState([]);
  const [name, setName] = useState('');
  const [time, setTime] = useState('07:00');
  const [duration, setDuration] = useState('15');
  const [category, setCategory] = useState('Morning');

  const todayStr = new Date().toISOString().split('T')[0];

  useEffect(() => {
    fetchRoutines();
  }, [currentUser]);

  const fetchRoutines = async () => {
    try {
      if (currentUser) {
        const records = await pb.collection('routines').getFullList({ sort: 'routineTime', $autoCancel: false });
        setRoutines(records);
      } else {
        setRoutines(JSON.parse(localStorage.getItem('localRoutines') || '[]'));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const addRoutine = async (e) => {
    e.preventDefault();
    if (!name) return;

    const newRt = {
      userId: currentUser?.id || null,
      taskName: name,
      routineTime: time,
      duration: Number(duration),
      category,
      completed: false,
      completedDate: null
    };

    try {
      if (currentUser) {
        await pb.collection('routines').create(newRt, { $autoCancel: false });
        fetchRoutines();
      } else {
        const updated = [...routines, { ...newRt, id: Date.now().toString() }].sort((a,b)=> a.routineTime.localeCompare(b.routineTime));
        setRoutines(updated);
        localStorage.setItem('localRoutines', JSON.stringify(updated));
      }
      setName('');
      toast.success('Routine updated');
    } catch (error) {
      toast.error('Failed to add');
    }
  };

  const toggleDone = async (rt) => {
    const isDone = rt.completedDate?.startsWith(todayStr);
    const updates = {
      completedDate: isDone ? null : todayStr + " 00:00:00.000Z"
    };

    try {
      if (currentUser) {
        await pb.collection('routines').update(rt.id, updates, { $autoCancel: false });
        fetchRoutines();
      } else {
        const updated = routines.map(r => r.id === rt.id ? { ...r, ...updates } : r);
        setRoutines(updated);
        localStorage.setItem('localRoutines', JSON.stringify(updated));
      }
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const deleteRt = async (id) => {
    try {
      if (currentUser) {
        await pb.collection('routines').delete(id, { $autoCancel: false });
        fetchRoutines();
      } else {
        const updated = routines.filter(r => r.id !== id);
        setRoutines(updated);
        localStorage.setItem('localRoutines', JSON.stringify(updated));
      }
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const totalDuration = routines.reduce((acc, curr) => acc + curr.duration, 0);

  return (
    <CalculatorLayout title="Routine Builder" description="Structure your perfect day." category="Productivity" categoryPath="/productivity">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-routine-indigo/30 bg-routine-indigo/5 dark:bg-routine-indigo/10 shadow-sm">
            <CardContent className="p-6">
              <h3 className="text-sm font-semibold text-routine-indigo mb-2 uppercase tracking-wider">Daily Summary</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <ListTodo className="h-5 w-5 opacity-70" />
                  <span className="text-2xl font-bold">{routines.length}</span> <span className="text-sm opacity-70">tasks</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 opacity-70" />
                  <span className="text-2xl font-bold">{totalDuration}</span> <span className="text-sm opacity-70">min</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <form onSubmit={addRoutine} className="space-y-4">
                <Input value={name} onChange={e => setName(e.target.value)} placeholder="Habit / Task Name" required />
                <div className="flex gap-2">
                  <Input type="time" value={time} onChange={e => setTime(e.target.value)} required className="flex-1" />
                  <Input type="number" value={duration} onChange={e => setDuration(e.target.value)} placeholder="Min" min="1" required className="w-20" />
                </div>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Button type="submit" className="w-full bg-routine-indigo hover:bg-routine-indigo/90 text-white"><Plus className="mr-2 h-4 w-4" /> Add to Routine</Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <div className="relative border-l-2 border-muted ml-4 pl-6 space-y-6 py-4">
            {routines.length === 0 ? (
              <div className="text-center py-12 -ml-6 border border-dashed rounded-xl bg-muted/30">
                <p className="text-muted-foreground">Your routine timeline is empty.</p>
              </div>
            ) : (
              routines.map((rt, i) => {
                const isDone = rt.completedDate?.startsWith(todayStr);
                return (
                  <div key={rt.id} className="relative group">
                    <div className="absolute -left-[35px] top-4 w-4 h-4 rounded-full bg-background border-2 border-routine-indigo" />
                    <Card className={`transition-smooth ${isDone ? 'opacity-60 bg-muted' : ''}`}>
                      <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <button onClick={() => toggleDone(rt)} className="text-primary hover:scale-110 transition-transform">
                            {isDone ? <CheckCircle2 className="h-6 w-6 text-green-500" /> : <Circle className="h-6 w-6 text-muted-foreground" />}
                          </button>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-bold text-lg">{rt.routineTime}</span>
                              <span className="text-xs px-2 py-0.5 bg-muted rounded-full">{rt.duration}m</span>
                              <span className="text-xs px-2 py-0.5 bg-routine-indigo/10 text-routine-indigo rounded-full">{rt.category}</span>
                            </div>
                            <p className={`font-medium ${isDone ? 'line-through text-muted-foreground' : ''}`}>{rt.taskName}</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 text-destructive" onClick={() => deleteRt(rt.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                )
              })
            )}
          </div>
        </div>

      </div>
    </CalculatorLayout>
  );
};

export default RoutineBuilderPage;