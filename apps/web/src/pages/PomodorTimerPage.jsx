import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Settings, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import CalculatorLayout from '@/components/CalculatorLayout.jsx';
import pb from '@/lib/pocketbaseClient';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { toast } from 'sonner';
import NavigationButtons from '@/components/NavigationButtons.jsx';

const PomodorTimerPage = () => {
  const { currentUser } = useAuth();
  const [workMins, setWorkMins] = useState(25);
  const [breakMins, setBreakMins] = useState(5);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [isWork, setIsWork] = useState(true);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    fetchSessionData();
  }, [currentUser]);

  const fetchSessionData = async () => {
    try {
      if (currentUser) {
        const todayStr = new Date().toISOString().split('T')[0] + " 00:00:00.000Z";
        const records = await pb.collection('pomodoro_sessions').getFullList({
          filter: `lastSessionDate >= "${todayStr}"`,
          $autoCancel: false
        });
        if (records.length > 0) {
          setSessionsCompleted(records[0].completedSessions || 0);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const updateSessionDB = async () => {
    if (!currentUser) return;
    try {
      const todayStr = new Date().toISOString().split('T')[0] + " 00:00:00.000Z";
      const records = await pb.collection('pomodoro_sessions').getFullList({
        filter: `lastSessionDate >= "${todayStr}"`,
        $autoCancel: false
      });
      
      if (records.length > 0) {
        await pb.collection('pomodoro_sessions').update(records[0].id, {
          completedSessions: records[0].completedSessions + 1
        }, { $autoCancel: false });
      } else {
        await pb.collection('pomodoro_sessions').create({
          userId: currentUser.id,
          lastSessionDate: todayStr,
          completedSessions: 1,
          workDuration: workMins,
          breakDuration: breakMins
        }, { $autoCancel: false });
      }
    } catch (error) {
      console.error('Failed to update sessions', error);
    }
  };

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      // Play sound
      const audio = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
      audio.play().catch(e => console.log(e));
      
      if (isWork) {
        setSessionsCompleted(s => s + 1);
        updateSessionDB();
        setIsWork(false);
        setTimeLeft(breakMins * 60);
        toast.success('Work session completed! Time for a break.');
      } else {
        setIsWork(true);
        setTimeLeft(workMins * 60);
        toast.success('Break is over! Ready to focus?');
      }
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, isWork, workMins, breakMins]);

  const resetTimer = () => {
    setIsActive(false);
    setIsWork(true);
    setTimeLeft(workMins * 60);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const currentDuration = isWork ? workMins * 60 : breakMins * 60;
  const progressPercent = ((currentDuration - timeLeft) / currentDuration) * 100;

  return (
    <CalculatorLayout title="Pomodoro Timer" description="Focus deeply, then take a break." category="Productivity" categoryPath="/productivity">
      <NavigationButtons />
      <Card className="max-w-lg mx-auto">
        <CardContent className="p-8 text-center">
          <div className="flex justify-between items-center mb-8">
            <div className="flex gap-2">
              <Button variant={isWork ? 'default' : 'outline'} size="sm" onClick={() => { setIsWork(true); setTimeLeft(workMins * 60); setIsActive(false); }}>Work</Button>
              <Button variant={!isWork ? 'default' : 'outline'} size="sm" onClick={() => { setIsWork(false); setTimeLeft(breakMins * 60); setIsActive(false); }}>Break</Button>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setShowSettings(!showSettings)}>
              <Settings className="h-5 w-5" />
            </Button>
          </div>

          {showSettings && (
            <div className="flex gap-4 justify-center mb-8 bg-muted p-4 rounded-xl">
              <div className="space-y-1 text-left">
                <label className="text-xs font-semibold">Work (min)</label>
                <Input type="number" value={workMins} onChange={e => { setWorkMins(Number(e.target.value)); if(isWork) setTimeLeft(Number(e.target.value)*60); }} className="w-20" min="1" />
              </div>
              <div className="space-y-1 text-left">
                <label className="text-xs font-semibold">Break (min)</label>
                <Input type="number" value={breakMins} onChange={e => { setBreakMins(Number(e.target.value)); if(!isWork) setTimeLeft(Number(e.target.value)*60); }} className="w-20" min="1" />
              </div>
            </div>
          )}

          <div className="relative w-64 h-64 mx-auto mb-8 flex items-center justify-center">
            {/* Progress Circle SVG */}
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="8" className="text-muted" />
              <circle 
                cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="8" 
                className={isWork ? "text-primary" : "text-green-500"}
                strokeDasharray="289" 
                strokeDashoffset={289 - (289 * progressPercent) / 100}
                strokeLinecap="round"
              />
            </svg>
            <div className="z-10 flex flex-col items-center">
              <span className="text-6xl font-bold tracking-tighter tabular-nums">{formatTime(timeLeft)}</span>
              <span className="text-muted-foreground uppercase tracking-widest text-sm font-semibold mt-2">{isWork ? 'Focus' : 'Break'}</span>
            </div>
          </div>

          <div className="flex justify-center gap-4 mb-8">
            <Button size="lg" className="w-32 rounded-full h-14 text-lg" onClick={() => setIsActive(!isActive)}>
              {isActive ? <Pause className="mr-2 h-5 w-5" /> : <Play className="mr-2 h-5 w-5" />}
              {isActive ? 'Pause' : 'Start'}
            </Button>
            <Button size="lg" variant="outline" className="rounded-full h-14 w-14 p-0" onClick={resetTimer} aria-label="Reset">
              <RotateCcw className="h-5 w-5" />
            </Button>
          </div>

          <div className="inline-flex items-center gap-2 bg-muted/50 px-4 py-2 rounded-full text-sm font-medium">
            <CheckCircle className="h-4 w-4 text-green-500" />
            Completed Today: {sessionsCompleted}
          </div>
        </CardContent>
      </Card>
    </CalculatorLayout>
  );
};

export default PomodorTimerPage;