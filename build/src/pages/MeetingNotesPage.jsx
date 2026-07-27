import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Plus, Trash2, Download, FileText, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CalculatorLayout from '@/components/CalculatorLayout.jsx';
import pb from '@/lib/pocketbaseClient';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { toast } from 'sonner';

const MeetingNotesPage = () => {
  const { currentUser } = useAuth();
  const [meetings, setMeetings] = useState([]);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [time, setTime] = useState('10:00');
  const [attendees, setAttendees] = useState('');
  const [agenda, setAgenda] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    fetchMeetings();
  }, [currentUser]);

  const fetchMeetings = async () => {
    try {
      if (currentUser) {
        const records = await pb.collection('meetings').getFullList({ sort: '-meetingDate,-meetingTime', $autoCancel: false });
        setMeetings(records);
      } else {
        setMeetings(JSON.parse(localStorage.getItem('localMeetings') || '[]'));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const addMeeting = async (e) => {
    e.preventDefault();
    if (!title.trim() || !notes.trim()) {
      toast.error('Title and Notes are required');
      return;
    }

    const newMeeting = {
      userId: currentUser?.id || null,
      title,
      meetingDate: date + " 00:00:00.000Z",
      meetingTime: time,
      attendees,
      agenda,
      notes,
      actionItems: []
    };

    try {
      if (currentUser) {
        await pb.collection('meetings').create(newMeeting, { $autoCancel: false });
        fetchMeetings();
      } else {
        const updated = [{ ...newMeeting, id: Date.now().toString() }, ...meetings];
        setMeetings(updated);
        localStorage.setItem('localMeetings', JSON.stringify(updated));
      }
      setTitle(''); setAttendees(''); setAgenda(''); setNotes('');
      toast.success('Meeting saved');
    } catch (error) {
      toast.error('Failed to save meeting');
    }
  };

  const deleteMeeting = async (id) => {
    if (!window.confirm('Delete this meeting note?')) return;
    try {
      if (currentUser) {
        await pb.collection('meetings').delete(id, { $autoCancel: false });
        fetchMeetings();
      } else {
        const updated = meetings.filter(m => m.id !== id);
        setMeetings(updated);
        localStorage.setItem('localMeetings', JSON.stringify(updated));
      }
      toast.success('Meeting deleted');
    } catch (error) {
      toast.error('Failed to delete meeting');
    }
  };

  const exportNote = (meeting) => {
    const text = `
MEETING: ${meeting.title}
DATE: ${meeting.meetingDate.split(' ')[0]} ${meeting.meetingTime}
ATTENDEES: ${meeting.attendees || 'None'}

AGENDA:
${meeting.agenda || 'No agenda'}

NOTES:
${meeting.notes}
    `.trim();

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Meeting_${meeting.title.replace(/\s+/g, '_')}_${meeting.meetingDate.split(' ')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <CalculatorLayout title="Meeting Notes" description="Record and organize your meeting notes." category="Productivity" categoryPath="/productivity">
      <Helmet>
        <title>Free Meeting Notes - Toolisiya | Record and organize your meeting notes</title>
      </Helmet>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1 h-fit sticky top-24">
          <CardHeader>
            <CardTitle>New Meeting</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={addMeeting} className="space-y-4">
              <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Meeting Title *" required />
              <div className="flex gap-2">
                <Input type="date" value={date} onChange={e => setDate(e.target.value)} required className="flex-1" />
                <Input type="time" value={time} onChange={e => setTime(e.target.value)} required className="w-32" />
              </div>
              <Input value={attendees} onChange={e => setAttendees(e.target.value)} placeholder="Attendees (comma separated)" />
              <Textarea value={agenda} onChange={e => setAgenda(e.target.value)} placeholder="Agenda" className="min-h-[80px]" />
              <Textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Meeting Notes *" className="min-h-[150px]" required />
              <Button type="submit" className="w-full"><Plus className="mr-2 h-4 w-4" /> Save Meeting</Button>
            </form>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 space-y-4">
          {meetings.length === 0 ? (
             <div className="text-center py-16 bg-muted/30 rounded-xl border border-dashed">
             <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
             <p className="text-muted-foreground">No meetings recorded yet.</p>
           </div>
          ) : (
            meetings.map(m => (
              <Card key={m.id} className="group">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold">{m.title}</h3>
                      <div className="flex items-center text-sm text-muted-foreground mt-1 gap-4">
                        <span className="flex items-center"><Calendar className="h-3 w-3 mr-1" /> {m.meetingDate.split(' ')[0]} at {m.meetingTime}</span>
                        {m.attendees && <span>• Attendees: {m.attendees}</span>}
                      </div>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="outline" size="sm" onClick={() => exportNote(m)}><Download className="h-4 w-4" /></Button>
                      <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/10" onClick={() => deleteMeeting(m.id)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </div>
                  {m.agenda && (
                    <div className="mb-4">
                      <h4 className="font-semibold text-sm mb-1 uppercase tracking-wider text-muted-foreground">Agenda</h4>
                      <p className="text-sm whitespace-pre-wrap bg-muted/30 p-3 rounded-lg border">{m.agenda}</p>
                    </div>
                  )}
                  <div>
                    <h4 className="font-semibold text-sm mb-1 uppercase tracking-wider text-muted-foreground">Notes</h4>
                    <p className="text-sm whitespace-pre-wrap">{m.notes}</p>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </CalculatorLayout>
  );
};

export default MeetingNotesPage;