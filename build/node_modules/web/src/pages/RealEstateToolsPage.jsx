import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Search, Building, Palette, Grid3x3, Sofa } from 'lucide-react';
import { Input } from '@/components/ui/input';
import ToolCard from '@/components/ToolCard.jsx';
import { useActiveTools } from '@/contexts/ActiveToolsContext.jsx';
import StickyNavigation from '@/components/StickyNavigation.jsx';

const RealEstateToolsPage = () => {
  const { activeUrls } = useActiveTools();
  const [searchQuery, setSearchQuery] = useState('');

  const tools = [
    { id: 'construction-cost-calculator', name: 'Construction Cost Calculator', path: '/real-estate/construction-cost-calculator', description: 'Estimate total building costs including base construction and additional expenses.', icon: Building },
    { id: 'paint-calculator', name: 'Paint Calculator', path: '/real-estate/paint-calculator', description: 'Calculate how much paint you need and estimate the total cost.', icon: Palette },
    { id: 'tile-calculator', name: 'Tile Calculator', path: '/real-estate/tile-calculator', description: 'Calculate how many tiles you need for your project, including waste.', icon: Grid3x3 },
    { id: 'carpet-area-calculator', name: 'Carpet Area Calculator', path: '/real-estate/carpet-area-calculator', description: 'Calculate total carpet area and estimated cost for multiple rooms.', icon: Sofa },
  ];

  const filteredTools = tools.filter(tool => {
    if (activeUrls && !activeUrls.has(tool.path)) return false;
    return tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           tool.description.toLowerCase().includes(searchQuery.toLowerCase());
  });

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

            {/* SEO Content Section */}
            <div className="mt-16 bg-card p-8 rounded-2xl border border-border/50 shadow-sm">
              <h2 className="text-2xl font-bold mb-4 text-foreground">Free Real Estate & Construction Calculators</h2>
              <p className="text-muted-foreground mb-4">
                Toolisiya provides a powerful set of free online real estate and construction calculators tailored for contractors, interior designers, and homeowners. Accurately estimate the total materials required and costs for your renovation projects, ensuring your budgets and resource planning are precise before the actual work begins.
              </p>
              <h2 className="text-2xl font-bold mb-4 text-foreground">Paint, Tile, and Area Calculators</h2>
              <p className="text-muted-foreground mb-4">
                Our suite includes dedicated tools like the Paint Calculator to determine the exact gallons of paint needed for your walls, and the Tile Calculator to measure flooring requirements with waste factored in. Additionally, use the Carpet Area Calculator to easily sum up the livable area across multiple rooms for accurate property valuations and listings.
              </p>
              <h2 className="text-2xl font-bold mb-4 text-foreground">Why Use Our Construction Tools?</h2>
              <p className="text-muted-foreground">
                All real estate and construction calculators on Toolisiya are completely free and require no account sign-up. Accessible directly from your browser on any device, these interactive utilities ensure you can crunch numbers quickly whether you're at the office or directly on the job site. Plan smarter and build better with Toolisiya.
              </p>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default RealEstateToolsPage;