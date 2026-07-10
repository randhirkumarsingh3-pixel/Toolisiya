import React from 'react';
import { motion } from 'framer-motion';
import { LayoutGrid, FileText, Globe, Users } from 'lucide-react';
import { useActiveTools } from '@/contexts/ActiveToolsContext.jsx';

export default function PlatformStatistics() {
  const { activeTools, activeCategories } = useActiveTools();

  const STATS = [
    { label: 'Total Tools Available', value: activeTools.length > 0 ? `${activeTools.length}+` : '100+', icon: LayoutGrid },
    { label: 'Tool Categories', value: activeCategories.length > 0 ? `${activeCategories.length}` : '12', icon: FileText },
    { label: 'Documents Processed', value: '1.2M+', icon: FileText },
    { label: 'Countries Served', value: '145+', icon: Globe },
  ];

  return (
    <section className="py-20 bg-background border-t border-border px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground mb-4">Platform at a Glance</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Toolisiya is growing every day. Here is the impact our free tools are having globally.
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card border border-border rounded-2xl p-6 text-center shadow-sm"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                  <Icon className="w-6 h-6" />
                </div>
                <div className="text-3xl md:text-4xl font-black text-foreground mb-2">{stat.value}</div>
                <div className="text-sm font-medium text-muted-foreground">{stat.label}</div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
