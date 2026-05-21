import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Plus, Trash2, CheckCircle2, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import CalculatorLayout from '@/components/CalculatorLayout.jsx';
import pb from '@/lib/pocketbaseClient';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { toast } from 'sonner';
import NavigationButtons from '@/components/NavigationButtons.jsx';
import SEOContentDisplay from '@/components/SEOContentDisplay.jsx';

const SmartTodoListPage = () => {
  const { currentUser } = useAuth();
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    fetchTodos();
  }, [currentUser]);

  const fetchTodos = async () => {
    try {
      if (currentUser) {
        const records = await pb.collection('todos').getFullList({ sort: '-created', $autoCancel: false });
        setTodos(records);
      } else {
        const local = JSON.parse(localStorage.getItem('localTodos') || '[]');
        setTodos(local);
      }
    } catch (error) { console.error(error); }
  };

  const addTodo = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    const newTodo = { title, priority, completed: false, userId: currentUser?.id || null, created: new Date().toISOString() };
    try {
      if (currentUser) {
        await pb.collection('todos').create(newTodo, { $autoCancel: false });
        fetchTodos();
      } else {
        const updated = [{ ...newTodo, id: Date.now().toString() }, ...todos];
        setTodos(updated);
        localStorage.setItem('localTodos', JSON.stringify(updated));
      }
      setTitle(''); toast.success('Task added');
    } catch (error) { toast.error('Failed to add task'); }
  };

  const toggleTodo = async (id, currentStatus) => {
    try {
      if (currentUser) {
        await pb.collection('todos').update(id, { completed: !currentStatus }, { $autoCancel: false });
        fetchTodos();
      } else {
        const updated = todos.map(t => t.id === id ? { ...t, completed: !currentStatus } : t);
        setTodos(updated);
        localStorage.setItem('localTodos', JSON.stringify(updated));
      }
    } catch (error) { toast.error('Failed to update task'); }
  };

  const deleteTodo = async (id) => {
    try {
      if (currentUser) {
        await pb.collection('todos').delete(id, { $autoCancel: false });
        fetchTodos();
      } else {
        const updated = todos.filter(t => t.id !== id);
        setTodos(updated);
        localStorage.setItem('localTodos', JSON.stringify(updated));
      }
      toast.success('Task deleted');
    } catch (error) { toast.error('Failed to delete task'); }
  };

  const filteredTodos = todos.filter(t => {
    if (filter === 'Active') return !t.completed;
    if (filter === 'Completed') return t.completed;
    return true;
  });

  return (
    <CalculatorLayout title="Smart To-Do List" description="Manage your tasks efficiently." category="Productivity" categoryPath="/productivity">
      <Helmet><title>Free Smart To-Do List | Toolisiya</title></Helmet>
      
      <NavigationButtons />

      <div className="max-w-3xl mx-auto mt-6 mb-12">
        <Card className="mb-8 shadow-md border-border">
          <CardContent className="pt-6 pb-6">
            <form onSubmit={addTodo} className="flex flex-col sm:flex-row gap-4">
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="What needs to be done?" className="flex-1 h-12 text-base" />
              <div className="flex gap-4">
                <Select value={priority} onValueChange={setPriority}>
                  <SelectTrigger className="w-[140px] h-12 font-medium"><SelectValue placeholder="Priority" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="High" className="text-destructive font-bold">High</SelectItem>
                    <SelectItem value="Medium" className="text-yellow-600 font-bold">Medium</SelectItem>
                    <SelectItem value="Low" className="text-green-600 font-bold">Low</SelectItem>
                  </SelectContent>
                </Select>
                <Button type="submit" className="h-12 px-6 font-bold shadow-sm"><Plus className="h-5 w-5 mr-2" /> Add</Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="flex gap-2 mb-6">
          {['All', 'Active', 'Completed'].map(f => (
            <Button key={f} variant={filter === f ? 'default' : 'outline'} size="sm" onClick={() => setFilter(f)} className={`font-semibold ${filter !== f ? 'bg-background hover:bg-muted' : ''}`}>
              {f}
            </Button>
          ))}
        </div>

        <div className="space-y-3">
          {filteredTodos.map(todo => (
            <Card key={todo.id} className={`transition-all border-border shadow-sm group ${todo.completed ? 'opacity-60 bg-muted/30' : 'bg-card'}`}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <button onClick={() => toggleTodo(todo.id, todo.completed)} className="text-primary hover:scale-110 transition-transform shrink-0">
                    {todo.completed ? <CheckCircle2 className="h-6 w-6 text-emerald-500" /> : <Circle className="h-6 w-6 text-muted-foreground" />}
                  </button>
                  <span className={`text-base font-medium break-words leading-snug ${todo.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>{todo.title}</span>
                </div>
                <div className="flex items-center gap-4 shrink-0 pl-4">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${todo.priority === 'High' ? 'bg-destructive/10 text-destructive' : todo.priority === 'Medium' ? 'bg-yellow-500/10 text-yellow-600' : 'bg-emerald-500/10 text-emerald-600'}`}>
                    {todo.priority}
                  </span>
                  <Button variant="ghost" size="icon" onClick={() => deleteTodo(todo.id)} className="text-destructive opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12">
          <SEOContentDisplay toolName="smart-to-do-list" />
        </div>
      </div>
    </CalculatorLayout>
  );
};

export default SmartTodoListPage;