import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CalculatorLayout from '@/components/CalculatorLayout.jsx';
import pb from '@/lib/pocketbaseClient';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { toast } from 'sonner';

const COLUMNS = ['To Do', 'In Progress', 'Done'];

const TaskBoardPage = () => {
  const { currentUser } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    fetchTasks();
  }, [currentUser]);

  const fetchTasks = async () => {
    try {
      if (currentUser) {
        const records = await pb.collection('tasks').getFullList({ sort: '-created', $autoCancel: false });
        setTasks(records);
      } else {
        setTasks(JSON.parse(localStorage.getItem('localTasks') || '[]'));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    
    const task = { title: newTask, status: 'To Do', priority: 'Medium', userId: currentUser?.id || null };
    try {
      if (currentUser) {
        await pb.collection('tasks').create(task, { $autoCancel: false });
        fetchTasks();
      } else {
        const updated = [{ ...task, id: Date.now().toString() }, ...tasks];
        setTasks(updated);
        localStorage.setItem('localTasks', JSON.stringify(updated));
      }
      setNewTask('');
    } catch (error) {
      toast.error('Failed to add task');
    }
  };

  const deleteTask = async (id) => {
    try {
      if (currentUser) {
        await pb.collection('tasks').delete(id, { $autoCancel: false });
        fetchTasks();
      } else {
        const updated = tasks.filter(t => t.id !== id);
        setTasks(updated);
        localStorage.setItem('localTasks', JSON.stringify(updated));
      }
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  const onDragEnd = async (result) => {
    if (!result.destination) return;
    const { source, destination, draggableId } = result;
    if (source.droppableId === destination.droppableId) return;

    const newStatus = destination.droppableId;
    
    // Optimistic update
    const updatedTasks = tasks.map(t => t.id === draggableId ? { ...t, status: newStatus } : t);
    setTasks(updatedTasks);

    try {
      if (currentUser) {
        await pb.collection('tasks').update(draggableId, { status: newStatus }, { $autoCancel: false });
      } else {
        localStorage.setItem('localTasks', JSON.stringify(updatedTasks));
      }
    } catch (error) {
      toast.error('Failed to move task');
      fetchTasks(); // Revert
    }
  };

  return (
    <CalculatorLayout title="Task Board" description="Kanban board for your projects." category="Productivity" categoryPath="/productivity">
      <form onSubmit={addTask} className="flex gap-4 mb-8">
        <Input value={newTask} onChange={(e) => setNewTask(e.target.value)} placeholder="New task title..." className="max-w-md" />
        <Button type="submit"><Plus className="h-4 w-4 mr-2" /> Add Task</Button>
      </form>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {COLUMNS.map(col => (
            <div key={col} className="bg-muted/50 rounded-xl p-4">
              <h3 className="font-semibold mb-4 text-lg">{col}</h3>
              <Droppable droppableId={col}>
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className="min-h-[200px] space-y-3">
                    {tasks.filter(t => t.status === col).map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided) => (
                          <Card
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="bg-card shadow-sm"
                          >
                            <CardContent className="p-4 flex justify-between items-start gap-2">
                              <p className="text-sm font-medium">{task.title}</p>
                              <button onClick={() => deleteTask(task.id)} className="text-muted-foreground hover:text-destructive">
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </CardContent>
                          </Card>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </CalculatorLayout>
  );
};

export default TaskBoardPage;