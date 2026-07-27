import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Wrench, ArrowRight } from 'lucide-react';
import { useActiveTools } from '@/contexts/ActiveToolsContext.jsx';
import { TOOLS_MAPPING } from './CategoryDropdown.jsx';

const ALLOWED_CAREER_TOOLS = [
  '/career/resume-builder',
  '/career/cover-letter-generator',
  '/career/job-application-tracker',
  '/career/salary-calculator'
];

const getCategoryFromUrl = (url) => {
  if (!url) return 'Other';
  if (url.includes('/finance/')) return 'Finance';
  if (url.includes('/image/')) return 'Image Tools';
  if (url.includes('/career/')) return 'Career';
  if (url.includes('/document/')) return 'Document';
  if (url.includes('/developer/')) return 'Developer';
  return 'Other';
};

const HighlightMatch = ({ text, query }) => {
  if (!query || !text) return <span>{text}</span>;
  const regex = new RegExp(`(${query})`, 'gi');
  const parts = text.split(regex);
  return (
    <span>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} className="bg-primary/20 text-primary bg-transparent font-bold px-0.5 rounded-sm">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  );
};

const SearchDropdown = ({ query, isOpen, setIsOpen }) => {
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const navigate = useNavigate();
  const { activeTools } = useActiveTools();

  const tools = useMemo(() => {
    // Map activeTools to the format expected by the dropdown search
    return activeTools
      .filter(r => {
        // Ensure we filter out deleted career tools
        if (r.url.startsWith('/career/') && !ALLOWED_CAREER_TOOLS.includes(r.url)) {
          return false;
        }
        const category = getCategoryFromUrl(r.url);
        if (category === 'Other') {
          return false;
        }
        return true;
      })
      .map(r => ({
        id: r.id,
        name: r.name,
        description: r.description || '',
        url: r.url,
        category: getCategoryFromUrl(r.url)
      }));
  }, [activeTools]);

  const flatResults = useMemo(() => {
    if (!query.trim()) return [];
    const searchLower = query.toLowerCase();
    const filtered = tools.filter(
      t => t.name.toLowerCase().includes(searchLower) || t.description.toLowerCase().includes(searchLower)
    );
    
    // Group by category to display nicely, but return a flat list for keyboard nav
    const grouped = filtered.reduce((acc, tool) => {
      if (!acc[tool.category]) acc[tool.category] = [];
      acc[tool.category].push(tool);
      return acc;
    }, {});
    
    let flat = [];
    Object.keys(grouped).sort().forEach(cat => {
      flat.push({ isHeader: true, name: cat, id: `header-${cat}` });
      flat.push(...grouped[cat]);
    });
    
    return flat;
  }, [query, tools]);

  // Exclude headers from selectable indices
  const selectableIndices = useMemo(() => {
    return flatResults.map((item, idx) => item.isHeader ? -1 : idx).filter(idx => idx !== -1);
  }, [flatResults]);

  useEffect(() => {
    setSelectedIndex(-1);
  }, [query]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => {
          const currentIndexInSelectable = selectableIndices.indexOf(prev);
          const nextIndexInSelectable = Math.min(currentIndexInSelectable + 1, selectableIndices.length - 1);
          return selectableIndices[nextIndexInSelectable] ?? -1;
        });
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => {
          const currentIndexInSelectable = selectableIndices.indexOf(prev);
          const prevIndexInSelectable = Math.max(currentIndexInSelectable - 1, 0);
          return selectableIndices[prevIndexInSelectable] ?? -1;
        });
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (selectedIndex >= 0 && !flatResults[selectedIndex].isHeader) {
          navigate(flatResults[selectedIndex].url);
          setIsOpen(false);
        }
      } else if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, flatResults, selectedIndex, selectableIndices, navigate, setIsOpen]);

  return (
    <AnimatePresence>
      {isOpen && query.trim() && (
        <motion.div 
          initial={{ opacity: 0, y: -10, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.98 }}
          transition={{ duration: 0.2 }}
          className="absolute top-full left-0 right-0 mt-3 bg-card border border-border rounded-xl shadow-xl overflow-hidden z-50 text-left max-h-[400px] overflow-y-auto custom-scrollbar"
        >
          {flatResults.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground flex flex-col items-center">
              <Wrench className="h-8 w-8 mb-2 opacity-20" />
              <p>No tools found matching "{query}"</p>
            </div>
          ) : (
            <ul className="py-2">
              {flatResults.map((item, idx) => {
                if (item.isHeader) {
                  return (
                    <li 
                      key={item.id} 
                      className="px-4 py-2 mt-2 text-xs font-bold text-muted-foreground uppercase tracking-wider bg-muted/30"
                    >
                      {item.name}
                    </li>
                  );
                }

                const isSelected = idx === selectedIndex;
                const toolKey = item.id || `${item.url}-${idx}`;
                
                return (
                  <li 
                    key={toolKey}
                    className={`px-4 py-3 flex items-center justify-between cursor-pointer transition-colors ${isSelected ? 'bg-primary/10 border-l-2 border-primary' : 'hover:bg-muted/60 border-l-2 border-transparent'}`}
                    onClick={() => {
                      navigate(item.url);
                      setIsOpen(false);
                    }}
                    onMouseEnter={() => setSelectedIndex(idx)}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg transition-colors ${isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                        <Wrench className="h-4 w-4" />
                      </div>
                      <div>
                        <p className={`font-medium ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                          <HighlightMatch text={item.name} query={query} />
                        </p>
                        {item.description && (
                          <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                            <HighlightMatch text={item.description} query={query} />
                          </p>
                        )}
                      </div>
                    </div>
                    {isSelected && <ArrowRight className="h-4 w-4 text-primary animate-in slide-in-from-left-2" />}
                  </li>
                );
              })}
            </ul>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SearchDropdown;