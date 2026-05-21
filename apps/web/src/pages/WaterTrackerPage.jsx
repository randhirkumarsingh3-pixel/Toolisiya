import React, { useState, useEffect } from 'react';
import { Droplets, Plus, History, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import CalculatorLayout from '@/components/CalculatorLayout.jsx';
import pb from '@/lib/pocketbaseClient';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { toast } from 'sonner';

const WaterTrackerPage = () => {
  const { currentUser } = useAuth();
  const [dailyGoal, setDailyGoal] = useState(2500); // ml
  const [currentIntake, setCurrentIntake] = useState(0);
  const [history, setHistory] = useState([]); // array of {amount, time, id}
  const [recordId, setRecordId] = useState(null);

  const todayStr = new Date().toISOString().split('T')[0];

  useEffect(() => {
    fetchTodayData();
  }, [currentUser]);

  const fetchTodayData = async () => {
    try {
      if (currentUser) {
        const records = await pb.collection('water_intake').getFullList({
          filter: `intakeDate >= "${todayStr} 00:00:00"`,
          $autoCancel: false
        });
        if (records.length > 0) {
          const r = records[0];
          setRecordId(r.id);
          setDailyGoal(r.dailyGoal);
          setCurrentIntake(r.currentIntake);
          setHistory(r.intakeHistory || []);
        } else {
          setRecordId(null);
          setCurrentIntake(0);
          setHistory([]);
        }
      } else {
        const local = JSON.parse(localStorage.getItem('localWaterToday') || '{}');
        if (local.date === todayStr) {
          setDailyGoal(local.goal || 2500);
          setCurrentIntake(local.intake || 0);
          setHistory(local.history || []);
        } else {
          setCurrentIntake(0);
          setHistory([]);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const addWater = async (amount) => {
    const newIntake = currentIntake + amount;
    const newEntry = { id: Date.now().toString(), amount, time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) };
    const newHistory = [newEntry, ...history];

    try {
      if (currentUser) {
        if (recordId) {
          await pb.collection('water_intake').update(recordId, {
            currentIntake: newIntake,
            dailyGoal,
            intakeHistory: newHistory
          }, { $autoCancel: false });
        } else {
          const newRecord = await pb.collection('water_intake').create({
            userId: currentUser.id,
            intakeDate: todayStr + " 00:00:00.000Z",
            dailyGoal,
            currentIntake: newIntake,
            intakeHistory: newHistory
          }, { $autoCancel: false });
          setRecordId(newRecord.id);
        }
      } else {
        localStorage.setItem('localWaterToday', JSON.stringify({
          date: todayStr, goal: dailyGoal, intake: newIntake, history: newHistory
        }));
      }
      setCurrentIntake(newIntake);
      setHistory(newHistory);
      if (newIntake >= dailyGoal && currentIntake < dailyGoal) {
        toast.success("Goal Reached! Great job staying hydrated.", { icon: "🌊" });
      }
    } catch (error) {
      toast.error('Failed to save');
    }
  };

  const deleteEntry = async (entryId) => {
    const entry = history.find(h => h.id === entryId);
    if (!entry) return;
    
    const newIntake = Math.max(0, currentIntake - entry.amount);
    const newHistory = history.filter(h => h.id !== entryId);

    try {
      if (currentUser && recordId) {
        await pb.collection('water_intake').update(recordId, {
          currentIntake: newIntake,
          intakeHistory: newHistory
        }, { $autoCancel: false });
      } else if (!currentUser) {
        localStorage.setItem('localWaterToday', JSON.stringify({
          date: todayStr, goal: dailyGoal, intake: newIntake, history: newHistory
        }));
      }
      setCurrentIntake(newIntake);
      setHistory(newHistory);
    } catch (error) {
      toast.error('Failed to delete entry');
    }
  };

  const progress = Math.min(100, Math.round((currentIntake / dailyGoal) * 100));

  return (
    <CalculatorLayout title="Water Tracker" description="Monitor your daily hydration." category="Productivity" categoryPath="/productivity">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <Card className="shadow-lg border-border">
          <CardContent className="p-8 text-center">
            <Droplets className="h-16 w-16 mx-auto text-water-cyan mb-6" />
            <h2 className="text-4xl font-bold tracking-tight mb-2">{currentIntake} <span className="text-xl text-muted-foreground font-normal">ml</span></h2>
            <p className="text-muted-foreground mb-6">of {dailyGoal} ml goal</p>
            
            <Progress value={progress} className="h-4 mb-2 bg-muted/50" indicatorClassName="bg-water-cyan" />
            <p className="text-sm font-semibold text-water-cyan mb-8">{progress}% Completed</p>

            <div className="grid grid-cols-3 gap-3 mb-6">
              <Button variant="outline" className="h-16 flex-col gap-1 border-water-cyan/20 hover:bg-water-cyan/10 hover:text-water-cyan" onClick={() => addWater(250)}>
                <span className="font-bold">250</span><span className="text-xs opacity-70">ml</span>
              </Button>
              <Button variant="outline" className="h-16 flex-col gap-1 border-water-cyan/30 hover:bg-water-cyan/10 hover:text-water-cyan" onClick={() => addWater(500)}>
                <span className="font-bold">500</span><span className="text-xs opacity-70">ml</span>
              </Button>
              <Button variant="outline" className="h-16 flex-col gap-1 border-water-cyan/40 hover:bg-water-cyan/10 hover:text-water-cyan" onClick={() => addWater(1000)}>
                <span className="font-bold">1000</span><span className="text-xs opacity-70">ml</span>
              </Button>
            </div>
            
            <div className="flex gap-2 items-center">
              <span className="text-sm text-muted-foreground">Goal:</span>
              <Input type="number" value={dailyGoal} onChange={(e) => setDailyGoal(Number(e.target.value))} className="h-8 w-24" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg"><History className="h-5 w-5" /> Today's Log</CardTitle>
          </CardHeader>
          <CardContent>
            {history.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">Drink some water to start tracking!</p>
            ) : (
              <div className="space-y-3">
                {history.map(entry => (
                  <div key={entry.id} className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <Droplets className="h-4 w-4 text-water-cyan" />
                      <span className="font-semibold">{entry.amount} ml</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-muted-foreground">{entry.time}</span>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => deleteEntry(entry.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </CalculatorLayout>
  );
};

export default WaterTrackerPage;