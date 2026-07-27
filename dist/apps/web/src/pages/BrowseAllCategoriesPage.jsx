
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, Calculator, Code, Image as ImageIcon, FileText, 
  QrCode, Briefcase, ArrowRight, FlaskConical, Clock, 
  Ruler, Home, PartyPopper
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const CATEGORIES = [
  {
    id: 'document',
    name: 'Document',
    icon: FileText,
    count: 8,
    color: 'bg-red-500/10 text-red-600 border-red-500/20 group-hover:bg-red-500 group-hover:text-white',
    desc: 'Generate professional documents, receipts, and certificates securely.',
    tools: [
      { name: 'Receipt Generator', path: '/document/receipt-generator' },
      { name: 'Certificate Generator', path: '/document/certificate-generator' },
      { name: 'Letter Generator', path: '/document/letter-generator' },
      { name: 'Contract Generator', path: '/document/contract-generator' },
      { name: 'Proposal Generator', path: '/document/proposal-generator' },
      { name: 'Quote Generator', path: '/document/quote-generator' },
      { name: 'Bill Generator', path: '/document/bill-generator' },
      { name: 'Invoice Generator', path: '/document/invoice-generator' }
    ]
  },
  {
    id: 'pdf',
    name: 'PDF',
    icon: FileText,
    count: 16,
    color: 'bg-rose-500/10 text-rose-600 border-rose-500/20 group-hover:bg-rose-500 group-hover:text-white',
    desc: 'Compress, merge, split, scan, and manipulate PDF files with ease.',
    tools: [
      { name: 'Document Scanner', path: '/pdf/document-scanner' },
      { name: 'PDF Compressor', path: '/pdf/pdf-compressor' },
      { name: 'PDF Merger', path: '/pdf/pdf-merger' },
      { name: 'PDF Splitter', path: '/pdf/pdf-splitter' },
      { name: 'PDF Page Rotator', path: '/pdf/pdf-page-rotator' },
      { name: 'PDF to Image', path: '/pdf/pdf-to-image-converter' }
    ]
  },
  {
    id: 'image',
    name: 'Image',
    icon: ImageIcon,
    count: 13,
    color: 'bg-pink-500/10 text-pink-600 border-pink-500/20 group-hover:bg-pink-500 group-hover:text-white',
    desc: 'Resize, crop, convert, edit, and optimize images for web and print.',
    tools: [
      { name: 'Photo Editor', path: '/image/photo-editor' },
      { name: 'Image Compressor', path: '/image/image-compressor' },
      { name: 'Image Converter', path: '/image/image-converter' },
      { name: 'Image Resizer', path: '/image/image-resizer' },
      { name: 'Image Cropper', path: '/image/image-cropper' },
      { name: 'QR Code Scanner', path: '/image/qr-code-scanner' }
    ]
  },
  {
    id: 'finance',
    name: 'Finance',
    icon: Calculator,
    count: 14,
    color: 'bg-blue-500/10 text-blue-600 border-blue-500/20 group-hover:bg-blue-500 group-hover:text-white',
    desc: 'Calculate taxes, loans, investments, budgets, and more.',
    tools: [
      { name: 'GST Calculator', path: '/finance/gst-calculator' },
      { name: 'EMI Calculator', path: '/finance/emi-calculator' },
      { name: 'Loan Calculator', path: '/finance/loan-calculator' },
      { name: 'Investment Calculator', path: '/finance/investment-calculator' },
      { name: 'Budget Planner', path: '/finance/budget-planner' },
      { name: 'Age Calculator', path: '/finance/age-calculator' }
    ]
  },
  {
    id: 'developer',
    name: 'Developer Tools',
    icon: Code,
    count: 12,
    color: 'bg-orange-500/10 text-orange-600 border-orange-500/20 group-hover:bg-orange-500 group-hover:text-white',
    desc: 'Format code, encode data, and streamline your development workflow.',
    tools: [
      { name: 'JSON Formatter', path: '/developer/json-formatter' },
      { name: 'XML Formatter', path: '/developer/xml-formatter' },
      { name: 'Code Beautifier', path: '/developer/code-beautifier' },
      { name: 'Color Picker', path: '/developer/color-picker' },
      { name: 'Word Counter', path: '/developer/word-counter' },
      { name: 'UUID Generator', path: '/developer/uuid-generator' }
    ]
  },
  {
    id: 'generator',
    name: 'Generators',
    icon: QrCode,
    count: 7,
    color: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20 group-hover:bg-indigo-500 group-hover:text-white',
    desc: 'Generate barcodes, QR codes, passwords, and format text.',
    tools: [
      { name: 'Barcode Generator', path: '/generator/barcode-generator' },
      { name: 'QR Code Generator', path: '/generator/qr-code-generator' },
      { name: 'Password Generator', path: '/generator/password-generator' },
      { name: 'Slug Generator', path: '/generator/slug-generator' },
      { name: 'Random Name Generator', path: '/generator/random-name-generator' },
      { name: 'Number to Words', path: '/generator/number-to-words' }
    ]
  },
  {
    id: 'career',
    name: 'Career',
    icon: Briefcase,
    count: 9,
    color: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20 group-hover:bg-yellow-500 group-hover:text-white',
    desc: 'Build resumes, write cover letters, prepare for interviews, and more.',
    tools: [
      { name: 'Resume Builder', path: '/career/resume-builder' },
      { name: 'Cover Letter Generator', path: '/career/cover-letter-generator' },
      { name: 'Job Application Tracker', path: '/career/job-application-tracker' },
      { name: 'Interview Preparation', path: '/career/interview-preparation' },
      { name: 'LinkedIn Optimizer', path: '/career/linkedin-optimizer' },
      { name: 'Portfolio Builder', path: '/career/portfolio-builder' }
    ]
  },
  {
    id: 'science',
    name: 'Science',
    icon: FlaskConical,
    count: 16,
    color: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 group-hover:bg-emerald-500 group-hover:text-white',
    desc: 'Chemistry, physics, and biology calculators for students and professionals.',
    tools: [
      { name: 'Molarity Calculator', path: '/science/molarity-calculator' },
      { name: 'pH Calculator', path: '/science/ph-calculator' },
      { name: 'Force Calculator', path: '/science/force-calculator' },
      { name: 'Ohm\'s Law Calculator', path: '/science/ohms-law-calculator' },
      { name: 'Velocity Calculator', path: '/science/velocity-calculator' },
      { name: 'DNA/RNA Converter', path: '/science/dna-rna-converter' }
    ]
  },
  {
    id: 'productivity',
    name: 'Productivity',
    icon: Clock,
    count: 14,
    color: 'bg-violet-500/10 text-violet-600 border-violet-500/20 group-hover:bg-violet-500 group-hover:text-white',
    desc: 'Planners, trackers, timers, and organizers to boost your daily productivity.',
    tools: [
      { name: 'Smart To-Do List', path: '/productivity/smart-todo-list' },
      { name: 'Task Board', path: '/productivity/task-board' },
      { name: 'Daily Planner', path: '/productivity/daily-planner' },
      { name: 'Pomodoro Timer', path: '/productivity/pomodoro-timer' },
      { name: 'Habit Streak', path: '/productivity/habit-streak' },
      { name: 'Meal Planner', path: '/productivity/meal-planner' }
    ]
  },
  {
    id: 'converters',
    name: 'Converters',
    icon: Ruler,
    count: 9,
    color: 'bg-cyan-500/10 text-cyan-600 border-cyan-500/20 group-hover:bg-cyan-500 group-hover:text-white',
    desc: 'Convert between units of length, weight, temperature, and media formats.',
    tools: [
      { name: 'Length Converter', path: '/converters/length-converter' },
      { name: 'Weight Converter', path: '/converters/weight-converter' },
      { name: 'Temperature Converter', path: '/converters/temperature-converter' },
      { name: 'Audio Converter', path: '/converters/audio-converter' },
      { name: 'Video Converter', path: '/converters/video-converter' },
      { name: 'Speed Converter', path: '/converters/speed-converter' }
    ]
  },
  {
    id: 'real-estate',
    name: 'Real Estate',
    icon: Home,
    count: 4,
    color: 'bg-amber-500/10 text-amber-600 border-amber-500/20 group-hover:bg-amber-500 group-hover:text-white',
    desc: 'Construction cost, paint, tile, and carpet area calculators.',
    tools: [
      { name: 'Construction Cost Calculator', path: '/real-estate/construction-cost-calculator' },
      { name: 'Paint Calculator', path: '/real-estate/paint-calculator' },
      { name: 'Tile Calculator', path: '/real-estate/tile-calculator' },
      { name: 'Carpet Area Calculator', path: '/real-estate/carpet-area-calculator' }
    ]
  },
  {
    id: 'invitations',
    name: 'Invitations',
    icon: PartyPopper,
    count: 2,
    color: 'bg-fuchsia-500/10 text-fuchsia-600 border-fuchsia-500/20 group-hover:bg-fuchsia-500 group-hover:text-white',
    desc: 'Create beautiful birthday and wedding invitation cards.',
    tools: [
      { name: 'Birthday Invitations', path: '/invitations/birthday-invitations' },
      { name: 'Wedding Invitations', path: '/invitations/wedding-invitations' }
    ]
  }
];

const BrowseAllCategoriesPage = () => {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const navigate = useNavigate();

  const filteredCategories = CATEGORIES
    .filter(cat => 
      cat.name.toLowerCase().includes(search.toLowerCase()) || 
      cat.desc.toLowerCase().includes(search.toLowerCase()) ||
      cat.tools.some(t => t.name.toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortBy === 'count') return b.count - a.count;
      return a.name.localeCompare(b.name);
    });

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans w-full">
      <Helmet>
        <title>Browse All Categories - Toolisiya</title>
        <meta name="description" content="Explore all categories of free online tools including Document, PDF, Image, Finance, Developer, Generators, Career, Science, Productivity, Converters, Real Estate, and Invitation tools." />
      </Helmet>
      
      <main className="flex-1 w-full">
        <div className="bg-muted/40 py-12 border-b border-border">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="text-sm text-muted-foreground mb-4">
              <Link to="/" className="hover:text-foreground hover:underline">Home</Link> <span className="mx-2">&gt;</span> Categories
            </div>
            
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="max-w-2xl">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-foreground">
                  Browse All Categories
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Explore all tool categories and find what you need. Completely free tools organized across professional categories to help you work smarter.
                </p>
              </div>
              <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search categories or tools..." 
                    className="pl-9 h-10 w-full bg-background border-border"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <div className="flex bg-background border border-border rounded-md p-1 shrink-0">
                  <Button 
                    variant={sortBy === 'name' ? 'secondary' : 'ghost'} 
                    size="sm" 
                    onClick={() => setSortBy('name')}
                    className="text-xs h-8"
                  >
                    A-Z
                  </Button>
                  <Button 
                    variant={sortBy === 'count' ? 'secondary' : 'ghost'} 
                    size="sm" 
                    onClick={() => setSortBy('count')}
                    className="text-xs h-8"
                  >
                    Most Tools
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-16 max-w-7xl">
          {filteredCategories.length === 0 ? (
            <div className="text-center py-24 bg-muted/20 rounded-2xl border border-dashed">
              <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
              <h3 className="text-xl font-bold mb-2">No categories found</h3>
              <p className="text-muted-foreground">Try adjusting your search terms.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-fr">
              {filteredCategories.map((category) => {
                const Icon = category.icon;
                return (
                  <div key={category.id} className="group flex flex-col bg-card rounded-3xl border border-border/60 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                    <div className="p-8 flex-1 flex flex-col cursor-pointer" onClick={() => navigate(`/${category.id}`)}>
                      <div className="flex justify-between items-start mb-6">
                        <div className={`h-16 w-16 rounded-2xl flex items-center justify-center border transition-colors duration-300 ${category.color}`}>
                          <Icon className="h-8 w-8" />
                        </div>
                        <Badge variant="secondary" className="bg-muted text-muted-foreground font-semibold shrink-0 shadow-sm">
                          {category.count} Tools
                        </Badge>
                      </div>
                      
                      <h3 className="text-2xl font-bold mb-3 text-foreground tracking-tight group-hover:text-primary transition-colors">
                        {category.name}
                      </h3>
                      
                      <p className="text-muted-foreground leading-relaxed mb-6 flex-1">
                        {category.desc}
                      </p>

                      <div className="mb-8">
                        <div className="flex flex-wrap gap-2">
                          {category.tools.slice(0, 4).map((tool, idx) => (
                            <Link 
                              key={idx} 
                              to={tool.path}
                              onClick={(e) => e.stopPropagation()}
                              className="text-xs font-medium px-2.5 py-1 bg-muted/50 rounded-md text-foreground/80 border border-border/40 hover:bg-primary/10 hover:text-primary hover:border-primary/20 transition-colors"
                            >
                              {tool.name}
                            </Link>
                          ))}
                          {category.tools.length > 4 && (
                            <span className="text-xs font-medium px-2.5 py-1 text-muted-foreground">
                              +{category.tools.length - 4} more
                            </span>
                          )}
                        </div>
                      </div>

                      <Button 
                        variant="outline" 
                        className="w-full mt-auto font-semibold group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/${category.id}`);
                        }}
                      >
                        View All {category.count} Tools <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default BrowseAllCategoriesPage;
