import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import CalculatorLayout from '@/components/CalculatorLayout.jsx';
import NavigationButtons from '@/components/NavigationButtons.jsx';

const CountdownTimerPage = () => {
  const [time, setTime] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [inputMins, setInputMins] = useState(5);

  useEffect(() => {
    let interval = null;
    if (isActive && time > 0) {
      interval = setInterval(() => setTime(t => t - 1), 1000);
    } else if (time === 0 && isActive) {
      setIsActive(false);
      // Play sound
      const audio = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
      audio.play().catch(e => console.log(e));
    }
    return () => clearInterval(interval);
  }, [isActive, time]);

  const startTimer = () => {
    if (time === 0) setTime(inputMins * 60);
    setIsActive(true);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <CalculatorLayout title="Countdown Timer" description="Customizable countdown timers." category="Productivity" categoryPath="/productivity">
      <NavigationButtons />
      <Card className="max-w-md mx-auto">
        <CardContent className="p-8 text-center space-y-8">
          <div className="text-7xl font-mono font-bold tracking-tighter">
            {formatTime(time > 0 ? time : inputMins * 60)}
          </div>
          
          {!isActive && time === 0 && (
            <div className="flex items-center justify-center gap-4">
              <Input 
                type="number" 
                value={inputMins} 
                onChange={(e) => setInputMins(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-24 text-center text-lg"
                min="1"
              />
              <span className="text-muted-foreground">minutes</span>
            </div>
          )}

          <div className="flex justify-center gap-4">
            <Button size="lg" onClick={isActive ? () => setIsActive(false) : startTimer} className="w-32">
              {isActive ? <><Pause className="mr-2 h-5 w-5" /> Pause</> : <><Play className="mr-2 h-5 w-5" /> Start</>}
            </Button>
            <Button size="lg" variant="outline" onClick={() => { setIsActive(false); setTime(0); }}>
              <RotateCcw className="mr-2 h-5 w-5" /> Reset
            </Button>
          </div>
        </CardContent>
      </Card>
    </CalculatorLayout>
  );
};

export default CountdownTimerPage;