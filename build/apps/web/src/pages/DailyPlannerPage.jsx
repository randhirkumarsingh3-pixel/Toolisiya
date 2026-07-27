import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Plus, Trash2, CheckCircle2, Circle, Calendar as CalendarIcon } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import CalculatorLayout from '@/components/CalculatorLayout.jsx';
import pb from '@/lib/pocketbaseClient';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { toast } from 'sonner';

const TIME_SLOTS = Array.from({ length: 18 }, (_, i) => {
  const hour = i + 6;
  return `${hour.toString().padStart(2, '0')}:00`;
});

const DailyPlannerPage = () => {
  const { currentUser } = useAuth();
  const [plans, setPlans] = useState([]);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [timeSlot, setTimeSlot] = useState('09:00');

  useEffect(() => {
    fetchPlans();
  }, [currentUser]);

  const fetchPlans = async () => {
    try {
      if (currentUser) {
        const records = await pb.collection('daily_plans').getFullList({ sort: '+timeSlot', $autoCancel: false });
        setPlans(records);
      } else {
        setPlans(JSON.parse(localStorage.getItem('localDailyPlans') || '[]'));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const addPlan = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newPlan = {
      userId: currentUser?.id || null,
      planDate: selectedDate + " 00:00:00.000Z",
      timeSlot,
      taskTitle: title,
      taskDescription: description,
      completed: false
    };

    try {
      if (currentUser) {
        await pb.collection('daily_plans').create(newPlan, { $autoCancel: false });
        fetchPlans();
      } else {
        const updated = [...plans, { ...newPlan, id: Date.now().toString() }].sort((a, b) => a.timeSlot.localeCompare(b.timeSlot));
        setPlans(updated);
        localStorage.setItem('localDailyPlans', JSON.stringify(updated));
      }
      setTitle('');
      setDescription('');
      toast.success('Task scheduled');
    } catch (error) {
      toast.error('Failed to add plan');
    }
  };

  const togglePlan = async (id, status) => {
    try {
      if (currentUser) {
        await pb.collection('daily_plans').update(id, { completed: !status }, { $autoCancel: false });
        fetchPlans();
      } else {
        const updated = plans.map(p => p.id === id ? { ...p, completed: !status } : p);
        setPlans(updated);
        localStorage.setItem('localDailyPlans', JSON.stringify(updated));
      }
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const deletePlan = async (id) => {
    try {
      if (currentUser) {
        await pb.collection('daily_plans').delete(id, { $autoCancel: false });
        fetchPlans();
      } else {
        const updated = plans.filter(p => p.id !== id);
        setPlans(updated);
        localStorage.setItem('localDailyPlans', JSON.stringify(updated));
      }
      toast.success('Task removed');
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  const dailyPlans = plans.filter(p => p.planDate.startsWith(selectedDate));

  return (
    <CalculatorLayout title="Daily Planner" description="Schedule your day efficiently." category="Productivity" categoryPath="/productivity">
      <Helmet>
        <title>Free Daily Planner - Toolisiya | Schedule your day efficiently</title>
      </Helmet>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4 text-lg">Select Date</h3>
              <Input 
                type="date" 
                value={selectedDate} 
                onChange={(e) => setSelectedDate(e.target.value)} 
                className="w-full"
              />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4 text-lg">Schedule Task</h3>
              <form onSubmit={addPlan} className="space-y-4">
                <Select value={timeSlot} onValueChange={setTimeSlot}>
                  <SelectTrigger><SelectValue placeholder="Time Slot" /></SelectTrigger>
                  <SelectContent>
                    {TIME_SLOTS.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Task Title" required />
                <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description (Optional)" />
                <Button type="submit" className="w-full"><Plus className="h-4 w-4 mr-2" /> Add to Schedule</Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xl font-bold mb-4">Schedule for {format(parseISO(selectedDate), 'MMMM d, yyyy')}</h3>
          
          {dailyPlans.length === 0 ? (
            <div className="text-center py-16 bg-muted/30 rounded-xl border border-dashed">
              <CalendarIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
              <p className="text-muted-foreground">No tasks scheduled for this date.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {dailyPlans.map(plan => (
                <Card key={plan.id} className={`transition-smooth ${plan.completed ? 'opacity-60 bg-muted' : ''}`}>
                  <CardContent className="p-4 flex items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <button onClick={() => togglePlan(plan.id, plan.completed)} className="mt-1 text-primary hover:text-primary/80 shrink-0">
                        {plan.completed ? <CheckCircle2 className="h-6 w-6" /> : <Circle className="h-6 w-6" />}
                      </button>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm px-2 py-0.5 bg-primary/10 text-primary rounded-md">{plan.timeSlot}</span>
                          <span className={`font-semibold ${plan.completed ? 'line-through text-muted-foreground' : ''}`}>{plan.taskTitle}</span>
                        </div>
                        {plan.taskDescription && (
                          <p className="text-sm text-muted-foreground mt-1">{plan.taskDescription}</p>
                        )}
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => deletePlan(plan.id)} className="text-destructive hover:bg-destructive/10">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </CalculatorLayout>
  );
};

export default DailyPlannerPage;