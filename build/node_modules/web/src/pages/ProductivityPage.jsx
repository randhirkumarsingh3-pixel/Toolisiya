import React from 'react';
import { Helmet } from 'react-helmet';
import { 
  CheckSquare, LayoutDashboard, Calendar, StickyNote, 
  FileText, Timer, Clock, Target, Droplets, 
  Smile, Receipt, Pill, Utensils, ListTodo
} from 'lucide-react';
import ToolCard from '@/components/ToolCard.jsx';
import StickyNavigation from '@/components/StickyNavigation.jsx';
import { useSEOData } from '@/hooks/useSEOData.js';
import { useActiveTools } from '@/contexts/ActiveToolsContext.jsx';

const tools = [
  { name: 'Smart To-Do List', path: '/productivity/smart-todo-list', icon: CheckSquare, description: 'Manage tasks with priorities and due dates.' },
  { name: 'Task Board', path: '/productivity/task-board', icon: LayoutDashboard, description: 'Kanban-style board for project tracking.' },
  { name: 'Daily Planner', path: '/productivity/daily-planner', icon: Calendar, description: 'Schedule your day with time slots.' },
  { name: 'Sticky Notes', path: '/productivity/sticky-notes', icon: StickyNote, description: 'Colorful digital sticky notes.' },
  { name: 'Meeting Notes', path: '/productivity/meeting-notes', icon: FileText, description: 'Record agendas and action items.' },
  { name: 'Countdown Timer', path: '/productivity/countdown-timer', icon: Timer, description: 'Customizable countdown timers.' },
  { name: 'Pomodoro Timer', path: '/productivity/pomodoro-timer', icon: Clock, description: 'Focus with the Pomodoro technique.' },
  { name: 'Habit Streak', path: '/productivity/habit-streak', icon: Target, description: 'Build habits and track your streaks.' },
  { name: 'Water Tracker', path: '/productivity/water-tracker', icon: Droplets, description: 'Monitor your daily hydration.' },
  { name: 'Mood Tracker', path: '/productivity/mood-tracker', icon: Smile, description: 'Log and analyze your daily moods.' },
  { name: 'Expense Reminder', path: '/productivity/expense-reminder', icon: Receipt, description: 'Track daily expenses by category.' },
  { name: 'Medicine Reminder', path: '/productivity/medicine-reminder', icon: Pill, description: 'Never miss a dose with schedules.' },
  { name: 'Meal Planner', path: '/productivity/meal-planner', icon: Utensils, description: 'Plan weekly meals and ingredients.' },
  { name: 'Routine Builder', path: '/productivity/routine-builder', icon: ListTodo, description: 'Create structured daily routines.' },
];

const ProductivityPage = () => {
  const { seoData } = useSEOData('category_productivity');
  const { activeUrls } = useActiveTools();
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>{seoData?.meta_title || 'Productivity Tools - Toolisiya'}</title>
        {seoData?.meta_description && <meta name="description" content={seoData.meta_description} />}
        {seoData?.meta_keywords && <meta name="keywords" content={seoData.meta_keywords} />}
        {seoData?.og_title && <meta property="og:title" content={seoData.og_title} />}
        {seoData?.og_description && <meta property="og:description" content={seoData.og_description} />}
        {seoData?.og_image && <meta property="og:image" content={seoData.og_image} />}
        <meta property="og:url" content={currentUrl} />
        <meta property="og:type" content="website" />
        {seoData?.structured_data && (
          <script type="application/ld+json">
            {typeof seoData.structured_data === 'string' ? seoData.structured_data : JSON.stringify(seoData.structured_data)}
          </script>
        )}
      </Helmet>
      <main className="flex-1 py-12 bg-muted/30">
        <StickyNavigation />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">{seoData?.h1_tag || 'Productivity Hub'}</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to organize your life, track your habits, and get more done.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.filter(tool => !activeUrls || activeUrls.has(tool.path)).map((tool, index) => (
              <ToolCard key={tool.path} tool={tool} index={index} />
            ))}
          </div>

          {/* SEO Content Section */}
          <div className="mt-16 bg-card p-8 rounded-2xl border border-border/50 shadow-sm">
            <h2 className="text-2xl font-bold mb-4 text-foreground">Free Productivity & Organization Tools</h2>
            <p className="text-muted-foreground mb-4">
              Toolisiya offers a robust suite of free online productivity tools to help you manage your daily tasks, track important habits, and streamline your schedule. Whether you need a smart to-do list, a Pomodoro timer for deep work sessions, or an intuitive Kanban task board for project management, our utilities are designed to keep you focused and organized.
            </p>
            <h2 className="text-2xl font-bold mb-4 text-foreground">Track Habits, Moods, and Goals</h2>
            <p className="text-muted-foreground mb-4">
              Building consistent routines is easier with the right tools. Use our Habit Streak tracker to maintain daily momentum, monitor your hydration with the Water Tracker, and reflect on your mental well-being with the Mood Tracker. Our comprehensive planners integrate seamlessly into your lifestyle, providing everything from meal planning to daily schedule optimization.
            </p>
            <h2 className="text-2xl font-bold mb-4 text-foreground">Why Rely on Toolisiya Productivity Hub?</h2>
            <p className="text-muted-foreground">
              All our productivity web apps are entirely free, secure, and require no user registration. Operating directly in your browser, your personal task data, meeting notes, and habit logs remain private on your device. Enhance your workflow, reduce procrastination, and boost your daily output with our easy-to-use digital workspace tools.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductivityPage;