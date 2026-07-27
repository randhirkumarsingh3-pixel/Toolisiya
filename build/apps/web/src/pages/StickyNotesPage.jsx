import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Plus, Trash2, Pin, StickyNote as StickyNoteIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import CalculatorLayout from '@/components/CalculatorLayout.jsx';
import pb from '@/lib/pocketbaseClient';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { toast } from 'sonner';

const NOTE_COLORS = [
  { id: 'yellow', class: 'bg-[#fef08a] text-yellow-950 dark:bg-yellow-600/20 dark:text-yellow-100 border-yellow-300 dark:border-yellow-600/30' },
  { id: 'pink', class: 'bg-[#fbcfe8] text-pink-950 dark:bg-pink-600/20 dark:text-pink-100 border-pink-300 dark:border-pink-600/30' },
  { id: 'blue', class: 'bg-[#bfdbfe] text-blue-950 dark:bg-blue-600/20 dark:text-blue-100 border-blue-300 dark:border-blue-600/30' },
  { id: 'green', class: 'bg-[#bbf7d0] text-green-950 dark:bg-green-600/20 dark:text-green-100 border-green-300 dark:border-green-600/30' },
  { id: 'purple', class: 'bg-[#e9d5ff] text-purple-950 dark:bg-purple-600/20 dark:text-purple-100 border-purple-300 dark:border-purple-600/30' },
];

const StickyNotesPage = () => {
  const { currentUser } = useAuth();
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedColor, setSelectedColor] = useState('yellow');

  useEffect(() => {
    fetchNotes();
  }, [currentUser]);

  const fetchNotes = async () => {
    try {
      if (currentUser) {
        const records = await pb.collection('sticky_notes').getFullList({ sort: '-pinned,-created', $autoCancel: false });
        setNotes(records);
      } else {
        const local = JSON.parse(localStorage.getItem('localNotes') || '[]');
        setNotes(local.sort((a, b) => (b.pinned === a.pinned) ? 0 : b.pinned ? 1 : -1));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const addNote = async (e) => {
    e.preventDefault();
    
    // CRITICAL: Title is required - validate before submission
    if (!title.trim()) {
      toast.error('Title is required. Please enter a title for your note.');
      return;
    }

    if (!content.trim()) {
      toast.error('Content is required. Please enter some content for your note.');
      return;
    }

    const newNote = {
      userId: currentUser?.id || null,
      title: title.trim(),
      content: content.trim(),
      color: selectedColor,
      pinned: false
    };

    try {
      if (currentUser) {
        // Ensure all required fields are included in the payload
        await pb.collection('sticky_notes').create(newNote, { $autoCancel: false });
        fetchNotes();
      } else {
        const updated = [{ ...newNote, id: Date.now().toString() }, ...notes];
        setNotes(updated);
        localStorage.setItem('localNotes', JSON.stringify(updated));
      }
      setTitle('');
      setContent('');
      toast.success('Note created successfully');
    } catch (error) {
      console.error('Failed to create note:', error);
      // Display the actual PocketBase error message
      const errorMessage = error?.response?.message || error?.message || 'Failed to create note';
      toast.error(`Error: ${errorMessage}`);
    }
  };

  const togglePin = async (id, status) => {
    try {
      if (currentUser) {
        await pb.collection('sticky_notes').update(id, { pinned: !status }, { $autoCancel: false });
        fetchNotes();
      } else {
        const updated = notes.map(n => n.id === id ? { ...n, pinned: !status } : n).sort((a, b) => (b.pinned === a.pinned) ? 0 : b.pinned ? 1 : -1);
        setNotes(updated);
        localStorage.setItem('localNotes', JSON.stringify(updated));
      }
    } catch (error) {
      toast.error('Failed to update note');
    }
  };

  const deleteNote = async (id) => {
    if (!window.confirm('Delete this note?')) return;
    try {
      if (currentUser) {
        await pb.collection('sticky_notes').delete(id, { $autoCancel: false });
        fetchNotes();
      } else {
        const updated = notes.filter(n => n.id !== id);
        setNotes(updated);
        localStorage.setItem('localNotes', JSON.stringify(updated));
      }
      toast.success('Note deleted');
    } catch (error) {
      toast.error('Failed to delete note');
    }
  };

  return (
    <CalculatorLayout title="Sticky Notes" description="Colorful digital sticky notes." category="Productivity" categoryPath="/productivity">
      <Helmet>
        <title>Free Sticky Notes - Toolisiya | Colorful digital sticky notes</title>
      </Helmet>
      <Card className="mb-8 border-none shadow-md">
        <CardContent className="p-6">
          <form onSubmit={addNote} className="space-y-4">
            <Input 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="Note Title (Required)" 
              className="text-lg font-semibold border-none px-0 shadow-none focus-visible:ring-0"
              required
            />
            <Textarea 
              value={content} 
              onChange={(e) => setContent(e.target.value)} 
              placeholder="Take a note... (Required)" 
              className="min-h-[100px] border-none px-0 shadow-none focus-visible:ring-0 resize-none"
              required
            />
            <div className="flex items-center justify-between pt-2 border-t">
              <div className="flex gap-2">
                {NOTE_COLORS.map(c => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedColor(c.id)}
                    className={`w-6 h-6 rounded-full transition-transform ${c.class} ${selectedColor === c.id ? 'ring-2 ring-offset-2 ring-primary scale-110' : ''}`}
                    aria-label={`Select ${c.id} color`}
                  />
                ))}
              </div>
              <Button type="submit">Add Note</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {notes.length === 0 ? (
        <div className="text-center py-16 bg-muted/30 rounded-xl border border-dashed">
          <StickyNoteIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
          <p className="text-muted-foreground">Your workspace is empty. Create a sticky note above.</p>
        </div>
      ) : (
        <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
          {notes.map(note => {
            const colorClass = NOTE_COLORS.find(c => c.id === note.color)?.class || NOTE_COLORS[0].class;
            return (
              <div key={note.id} className={`break-inside-avoid rounded-xl p-5 shadow-sm border relative group ${colorClass}`}>
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                  <button onClick={() => togglePin(note.id, note.pinned)} className="p-1.5 hover:bg-black/10 rounded-md transition-colors" title={note.pinned ? "Unpin" : "Pin"}>
                    <Pin className={`h-4 w-4 ${note.pinned ? 'fill-current' : ''}`} />
                  </button>
                  <button onClick={() => deleteNote(note.id)} className="p-1.5 hover:bg-black/10 rounded-md transition-colors text-red-700 dark:text-red-300" title="Delete">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                {note.pinned && <Pin className="absolute top-4 right-4 h-4 w-4 fill-current opacity-30 group-hover:opacity-0" />}
                {note.title && <h3 className="font-bold text-lg mb-2 pr-10">{note.title}</h3>}
                <p className="whitespace-pre-wrap text-sm leading-relaxed">{note.content}</p>
              </div>
            );
          })}
        </div>
      )}
    </CalculatorLayout>
  );
};

export default StickyNotesPage;