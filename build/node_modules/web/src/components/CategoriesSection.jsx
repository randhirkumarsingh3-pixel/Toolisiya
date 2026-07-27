import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Calculator, Wrench, RefreshCw, Atom, Code, Image, FileText, QrCode, Home as HomeIcon, Briefcase, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useActiveTools } from '@/contexts/ActiveToolsContext.jsx';

const CATEGORIES = [
  { name: 'Productivity', path: '/productivity', icon: CheckCircle2, count: 14, tools: ['Smart To-Do List', 'Daily Planner', 'Pomodoro Timer'] },
  { name: 'Finance', path: '/finance', icon: Calculator, count: 8, tools: ['GST Calculator', 'EMI Calculator', 'Invoice Generator'] },
  { name: 'Utilities', path: '/utilities', icon: Wrench, count: 6, tools: ['Word Counter', 'Age Calculator', 'Password Generator'] },
  { name: 'Converters', path: '/converters', icon: RefreshCw, count: 10, tools: ['Length Converter', 'Currency Converter', 'Weight Converter'] },
  { name: 'Science', path: '/science', icon: Atom, count: 8, tools: ['pH Calculator', 'Ohm\'s Law', 'Velocity Calculator'] },
  { name: 'Developer Tools', path: '/developer', icon: Code, count: 12, tools: ['JSON Formatter', 'Base64 Encoder', 'Color Picker'] },
  { name: 'Image Tools', path: '/image-tools', icon: Image, count: 8, tools: ['Compressor', 'Resizer', 'Watermark Remover'] },
  { name: 'Document Tools', path: '/documents', icon: FileText, count: 10, tools: ['PDF Merger', 'Word to PDF', 'Split PDF'] },
  { name: 'Generators', path: '/generators', icon: QrCode, count: 6, tools: ['QR Code', 'Barcode', 'Password'] },
  { name: 'Real Estate', path: '/real-estate', icon: HomeIcon, count: 4, tools: ['Construction Cost', 'Paint Calculator', 'Carpet Area'] },
  { name: 'Career', path: '/career', icon: Briefcase, count: 2, tools: ['Resume Builder', 'Cover Letter'] },
];

const categorySlugMapping = {
  '/productivity': 'productivity',
  '/finance': 'finance',
  '/utilities': 'utilities',
  '/converters': 'converters',
  '/science': 'science',
  '/developer': 'developer',
  '/image-tools': 'image',
  '/documents': 'document',
  '/generators': 'generators',
  '/real-estate': 'real-estate',
  '/career': 'career',
};

const CategoriesSection = () => {
  const { inactiveCategorySlugs, activeTools } = useActiveTools();

  const visibleCategories = CATEGORIES.filter(cat => {
    const slug = categorySlugMapping[cat.path];
    return !inactiveCategorySlugs.has(slug);
  }).map(cat => ({
    ...cat,
    tools: cat.tools.filter(toolName => activeTools.some(t => t.name === toolName))
  }));

  return (
    <section className="py-24 bg-muted/40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div className="max-w-2xl">
            <h2 className="mb-4">Browse by Category</h2>
            <p className="text-muted-foreground text-lg">Find specific tools organized logically into categories.</p>
          </div>
          <Link to="/productivity">
            <Button variant="link" className="text-primary hover:text-primary/80 font-semibold px-0">
              View All Categories <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleCategories.map((cat, index) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={cat.path}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <Card className="h-full border-border bg-card shadow-sm hover:shadow-md transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="h-12 w-12 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shrink-0 shadow-sm">
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold leading-tight">{cat.name}</h3>
                        <p className="text-sm text-muted-foreground">{cat.count} tools available</p>
                      </div>
                    </div>
                    <ul className="space-y-3 mb-6">
                      {cat.tools.map((tool, i) => (
                        <li key={i} className="flex items-center text-sm text-foreground/80">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary/40 mr-3"></span>
                          {tool}
                        </li>
                      ))}
                    </ul>
                    <Link to={cat.path}>
                      <Button variant="secondary" className="w-full bg-secondary/5 hover:bg-secondary/10 text-secondary-foreground shadow-none">
                        View All {cat.name} Tools
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;