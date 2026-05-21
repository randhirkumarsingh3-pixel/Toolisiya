import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Search, FlaskConical, Atom, Activity, Zap, Waves, Dna } from 'lucide-react';
import { Input } from '@/components/ui/input';
import ToolCard from '@/components/ToolCard.jsx';
import { useSEOData } from '@/hooks/useSEOData.js';
import StickyNavigation from '@/components/StickyNavigation.jsx';

const ScienceToolsPage = () => {
  const { seoData } = useSEOData('category_science');
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const [searchQuery, setSearchQuery] = useState('');

  const tools = [
    { id: 'molarity-calculator', name: 'Molarity Calculator', path: '/science/molarity-calculator', description: 'Calculate molar concentration of a solution.', category: 'Chemistry', icon: FlaskConical },
    { id: 'normality-calculator', name: 'Normality Calculator', path: '/science/normality-calculator', description: 'Calculate the normality of a solution.', category: 'Chemistry', icon: FlaskConical },
    { id: 'dilution-calculator', name: 'Dilution Calculator', path: '/science/dilution-calculator', description: 'Calculate volume or concentration for dilutions.', category: 'Chemistry', icon: FlaskConical },
    { id: 'mole-fraction-calculator', name: 'Mole Fraction Calculator', path: '/science/mole-fraction-calculator', description: 'Calculate the mole fraction of components.', category: 'Chemistry', icon: FlaskConical },
    { id: 'molality-calculator', name: 'Molality Calculator', path: '/science/molality-calculator', description: 'Calculate molality of a solution.', category: 'Chemistry', icon: FlaskConical },
    { id: 'ph-calculator', name: 'pH Calculator', path: '/science/ph-calculator', description: 'Calculate pH from hydrogen ion concentration.', category: 'Chemistry', icon: FlaskConical },
    { id: 'dna-rna-converter', name: 'DNA/RNA Converter', path: '/science/dna-rna-converter', description: 'Convert between DNA and RNA sequences.', category: 'Biology', icon: Dna },
    { id: 'velocity-calculator', name: 'Velocity Calculator', path: '/science/velocity-calculator', description: 'Calculate velocity, distance, or time.', category: 'Physics', icon: Activity },
    { id: 'force-calculator', name: 'Force Calculator', path: '/science/force-calculator', description: 'Calculate force using Newton\'s second law.', category: 'Physics', icon: Atom },
    { id: 'work-calculator', name: 'Work Calculator', path: '/science/work-calculator', description: 'Calculate work done by a force.', category: 'Physics', icon: Atom },
    { id: 'power-calculator', name: 'Power Calculator', path: '/science/power-calculator', description: 'Calculate power from work and time.', category: 'Physics', icon: Zap },
    { id: 'kinetic-energy-calculator', name: 'Kinetic Energy Calculator', path: '/science/kinetic-energy-calculator', description: 'Calculate energy of motion.', category: 'Physics', icon: Activity },
    { id: 'potential-energy-calculator', name: 'Potential Energy Calculator', path: '/science/potential-energy-calculator', description: 'Calculate gravitational potential energy.', category: 'Physics', icon: Activity },
    { id: 'ohms-law-calculator', name: 'Ohm\'s Law Calculator', path: '/science/ohms-law-calculator', description: 'Calculate voltage, current, or resistance.', category: 'Physics', icon: Zap },
    { id: 'pressure-calculator', name: 'Pressure Calculator', path: '/science/pressure-calculator', description: 'Calculate pressure from force and area.', category: 'Physics', icon: Atom },
    { id: 'wave-speed-calculator', name: 'Wave Speed Calculator', path: '/science/wave-speed-calculator', description: 'Calculate wave speed, frequency, or wavelength.', category: 'Physics', icon: Waves },
  ];

  const filteredTools = tools.filter(tool => 
    tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const chemistryTools = filteredTools.filter(t => t.category === 'Chemistry');
  const physicsTools = filteredTools.filter(t => t.category === 'Physics');
  const biologyTools = filteredTools.filter(t => t.category === 'Biology');

  const ToolGrid = ({ items }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((tool, index) => (
        <ToolCard key={tool.id} tool={tool} index={index} />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>{seoData?.meta_title || 'Science Calculators & Tools - Toolisiya.com'}</title>
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
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 tracking-tight">{seoData?.h1_tag || 'Science Tools'}</h1>
            <p className="text-lg text-muted-foreground mb-8">
              A comprehensive collection of calculators for chemistry, physics, and biology.
            </p>
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input 
                type="text" 
                placeholder="Search science tools..." 
                className="pl-10 h-12 text-base bg-background"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {chemistryTools.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                <FlaskConical className="h-6 w-6 text-primary" /> Chemistry
              </h2>
              <ToolGrid items={chemistryTools} />
            </div>
          )}

          {physicsTools.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                <Atom className="h-6 w-6 text-primary" /> Physics
              </h2>
              <ToolGrid items={physicsTools} />
            </div>
          )}

          {biologyTools.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                <Dna className="h-6 w-6 text-primary" /> Biology
              </h2>
              <ToolGrid items={biologyTools} />
            </div>
          )}

          {filteredTools.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No tools found matching "{searchQuery}"</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ScienceToolsPage;