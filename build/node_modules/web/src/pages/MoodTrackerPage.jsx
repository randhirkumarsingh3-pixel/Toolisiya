import React, { useState, useEffect } from 'react';
import { Smile, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import CalculatorLayout from '@/components/CalculatorLayout.jsx';
import pb from '@/lib/pocketbaseClient';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { toast } from 'sonner';

const MOODS = [
  { id: 'Happy', emoji: '😊', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  { id: 'Excited', emoji: '🤩', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' },
  { id: 'Calm', emoji: '😌', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  { id: 'Neutral', emoji: '😐', color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400' },
  { id: 'Sad', emoji: '😢', color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' },
  { id: 'Angry', emoji: '😠', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' }
];

const MoodTrackerPage = () => {
  const { currentUser } = useAuth();
  const [moods, setMoods] = useState([]);
  const [selectedMood, setSelectedMood] = useState(null);
  const [note, setNote] = useState('');

  useEffect(() => {
    fetchMoods();
  }, [currentUser]);

  const fetchMoods = async () => {
    try {
      if (currentUser) {
        const records = await pb.collection('moods').getFullList({ sort: '-moodDate,-moodTime', $autoCancel: false });
        setMoods(records);
      } else {
        setMoods(JSON.parse(localStorage.getItem('localMoods') || '[]'));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const addMood = async () => {
    if (!selectedMood) {
      toast.error('Select a mood first');
      return;
    }

    const now = new Date();
    const newMood = {
      userId: currentUser?.id || null,
      mood: selectedMood,
      note,
      moodDate: now.toISOString().split('T')[0] + " 00:00:00.000Z",
      moodTime: now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    };

    try {
      if (currentUser) {
        await pb.collection('moods').create(newMood, { $autoCancel: false });
        fetchMoods();
      } else {
        const updated = [{ ...newMood, id: Date.now().toString(), moodDate: now.toISOString() }, ...moods];
        setMoods(updated);
        localStorage.setItem('localMoods', JSON.stringify(updated));
      }
      setSelectedMood(null);
      setNote('');
      toast.success('Mood logged');
    } catch (error) {
      toast.error('Failed to log mood');
    }
  };

  const deleteMood = async (id) => {
    try {
      if (currentUser) {
        await pb.collection('moods').delete(id, { $autoCancel: false });
        fetchMoods();
      } else {
        const updated = moods.filter(m => m.id !== id);
        setMoods(updated);
        localStorage.setItem('localMoods', JSON.stringify(updated));
      }
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  return (
    <CalculatorLayout title="Mood Tracker" description="Log and analyze your daily emotions." category="Productivity" categoryPath="/productivity">
      <Card className="max-w-2xl mx-auto mb-8 border-mood-purple/20 shadow-md">
        <CardContent className="p-8">
          <h2 className="text-2xl font-bold text-center mb-6">How are you feeling?</h2>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 mb-6">
            {MOODS.map(m => (
              <button
                key={m.id}
                onClick={() => setSelectedMood(m.id)}
                className={`flex flex-col items-center p-4 rounded-xl transition-all ${selectedMood === m.id ? 'ring-2 ring-primary scale-110 bg-muted' : 'hover:bg-muted/50 grayscale hover:grayscale-0'}`}
              >
                <span className="text-4xl mb-2">{m.emoji}</span>
                <span className="text-xs font-medium">{m.id}</span>
              </button>
            ))}
          </div>
          {selectedMood && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
              <Textarea placeholder="Add a note (optional)... why are you feeling this way?" value={note} onChange={e => setNote(e.target.value)} />
              <Button className="w-full bg-mood-purple hover:bg-mood-purple/90 text-white" onClick={addMood}>Save Mood</Button>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="max-w-2xl mx-auto">
        <h3 className="text-xl font-bold mb-4">Recent Logs</h3>
        {moods.length === 0 ? (
          <div className="text-center py-12 bg-muted/30 rounded-xl border border-dashed">
            <Smile className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
            <p className="text-muted-foreground">No moods logged yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {moods.map(m => {
              const moodDef = MOODS.find(x => x.id === m.mood) || MOODS[3];
              const dateStr = m.moodDate.split(' ')[0] || m.moodDate.split('T')[0];
              return (
                <div key={m.id} className={`flex items-start gap-4 p-4 rounded-xl border ${moodDef.color}`}>
                  <div className="text-4xl shrink-0">{moodDef.emoji}</div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold">{m.mood}</h4>
                      <span className="text-xs opacity-70">{dateStr} {m.moodTime}</span>
                    </div>
                    {m.note && <p className="text-sm mt-1 opacity-90">{m.note}</p>}
                  </div>
                  <Button variant="ghost" size="icon" className="shrink-0 h-8 w-8 hover:bg-black/10 text-current opacity-50 hover:opacity-100" onClick={() => deleteMood(m.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </CalculatorLayout>
  );
};

export default MoodTrackerPage;