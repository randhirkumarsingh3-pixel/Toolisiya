import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Search, Building, Palette, Grid3x3, Sofa } from 'lucide-react';
import { Input } from '@/components/ui/input';
import ToolCard from '@/components/ToolCard.jsx';
import StickyNavigation from '@/components/StickyNavigation.jsx';

const RealEstateToolsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const tools = [
    { id: 'construction-cost-calculator', name: 'Construction Cost Calculator', path: '/real-estate/construction-cost-calculator', description: 'Estimate total building costs including base construction and additional expenses.', icon: Building },
    { id: 'paint-calculator', name: 'Paint Calculator', path: '/real-estate/paint-calculator', description: 'Calculate how much paint you need and estimate the total cost.', icon: Palette },
    { id: 'tile-calculator', name: 'Tile Calculator', path: '/real-estate/tile-calculator', description: 'Calculate how many tiles you need for your project, including waste.', icon: Grid3x3 },
    { id: 'carpet-area-calculator', name: 'Carpet Area Calculator', path: '/real-estate/carpet-area-calculator', description: 'Calculate total carpet area and estimated cost for multiple rooms.', icon: Sofa },
  ];

  const filteredTools = tools.filter(tool => 
    tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Helmet>
        <title>Real Estate & Construction Tools - Toolisiya.com</title>
        <meta name="description" content="Free online calculators for construction costs, paint, tiles, and carpet area." />
      </Helmet>
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 py-12 bg-muted/30">
          <StickyNavigation />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h1 className="text-4xl font-bold mb-4 tracking-tight">Real Estate Tools</h1>
              <p className="text-lg text-muted-foreground mb-8">
                Calculators for construction, renovation, and interior design projects.
              </p>
              <div className="relative max-w-md mx-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                  type="text" 
                  placeholder="Search real estate tools..." 
                  className="pl-10 h-12 text-base bg-background"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTools.map((tool, index) => (
                <ToolCard key={tool.id} tool={tool} index={index} />
              ))}
            </div>

            {filteredTools.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">No tools found matching "{searchQuery}"</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default RealEstateToolsPage;